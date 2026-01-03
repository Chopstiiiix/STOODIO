import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prisma";
import { z } from "zod";

const payoutSchema = z.object({
  bookingId: z.string().min(1),
});

// POST /api/payouts/run - Execute payout for a completed booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUser = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { bookingId } = payoutSchema.parse(body);

    // Fetch booking with all related data
    const booking = await prismadb.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: {
          include: {
            user: true, // Host/owner
          },
        },
        payment: true,
        payout: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // IDEMPOTENCY CHECK: If payout already exists, return 409
    if (booking.payout) {
      return NextResponse.json(
        {
          error: "Payout already exists for this booking",
          payoutId: booking.payout.id,
          status: booking.payout.status,
        },
        { status: 409 }
      );
    }

    // Verify booking is COMPLETED
    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { error: `Booking must be COMPLETED. Current status: ${booking.status}` },
        { status: 400 }
      );
    }

    // Verify payment exists and is PAID
    if (!booking.payment) {
      return NextResponse.json(
        { error: "No payment found for this booking" },
        { status: 400 }
      );
    }

    if (booking.payment.status !== "PAID") {
      return NextResponse.json(
        { error: `Payment must be PAID. Current status: ${booking.payment.status}` },
        { status: 400 }
      );
    }

    // Verify host has Stripe Connect account
    const host = booking.property.user;

    if (!host.stripeAccountId) {
      return NextResponse.json(
        {
          error: "Host has not connected their Stripe account",
          hostId: host.id,
        },
        { status: 400 }
      );
    }

    // Calculate payout amounts
    const totalAmount = booking.totalPrice;
    const platformFeePercentage = 10; // 10% platform fee
    const platformFee = Math.floor((totalAmount * platformFeePercentage) / 100);
    const hostAmount = totalAmount - platformFee;

    // Verify Stripe account is ready to receive transfers
    try {
      const account = await stripe.accounts.retrieve(host.stripeAccountId);

      if (!account.charges_enabled || !account.payouts_enabled) {
        return NextResponse.json(
          {
            error: "Host's Stripe account is not ready to receive payouts",
            accountStatus: {
              chargesEnabled: account.charges_enabled,
              payoutsEnabled: account.payouts_enabled,
              detailsSubmitted: account.details_submitted,
            },
          },
          { status: 400 }
        );
      }
    } catch (error: any) {
      return NextResponse.json(
        { error: `Failed to verify host's Stripe account: ${error.message}` },
        { status: 400 }
      );
    }

    // Create transfer to host's connected account
    let stripeTransferId: string | undefined;

    try {
      const transfer = await stripe.transfers.create({
        amount: hostAmount,
        currency: booking.payment.currency.toLowerCase(),
        destination: host.stripeAccountId,
        description: `Payout for booking ${bookingId}`,
        metadata: {
          bookingId: booking.id,
          propertyId: booking.propertyId,
          hostId: host.id,
          platformFee: platformFee.toString(),
        },
      });

      stripeTransferId = transfer.id;
    } catch (error: any) {
      console.error("[STRIPE_TRANSFER_ERROR]", error);
      return NextResponse.json(
        { error: `Failed to create Stripe transfer: ${error.message}` },
        { status: 500 }
      );
    }

    // Create payout record in database
    const payout = await prismadb.payout.create({
      data: {
        bookingId: booking.id,
        paymentId: booking.payment.id,
        hostUserId: host.id,
        amount: totalAmount,
        platformFee,
        hostAmount,
        currency: booking.payment.currency,
        stripeTransferId,
        status: "PAID",
      },
    });

    console.log(`[PAYOUT_SUCCESS] Created payout ${payout.id} for booking ${bookingId}`);
    console.log(`[PAYOUT_SUCCESS] Transfer ID: ${stripeTransferId}`);
    console.log(`[PAYOUT_SUCCESS] Host amount: ${hostAmount}, Platform fee: ${platformFee}`);

    return NextResponse.json({
      id: payout.id,
      bookingId: payout.bookingId,
      hostUserId: payout.hostUserId,
      amount: payout.amount,
      platformFee: payout.platformFee,
      hostAmount: payout.hostAmount,
      currency: payout.currency,
      stripeTransferId: payout.stripeTransferId,
      status: payout.status,
      createdAt: payout.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[PAYOUT_RUN]", error);
    return NextResponse.json(
      { error: "Failed to execute payout" },
      { status: 500 }
    );
  }
}
