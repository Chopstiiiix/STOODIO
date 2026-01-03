import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prisma";
import { z } from "zod";

const createIntentSchema = z.object({
  bookingId: z.string().min(1),
});

// POST /api/payments/create-intent - Create a PaymentIntent for a booking
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
    const { bookingId } = createIntentSchema.parse(body);

    // Fetch the booking with property details
    const booking = await prismadb.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
        payment: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify the booking belongs to the current user
    if (booking.userId !== currentUser.id) {
      return NextResponse.json(
        { error: "Forbidden - This is not your booking" },
        { status: 403 }
      );
    }

    // Check if payment already exists and has a PaymentIntent
    if (booking.payment?.stripePaymentIntentId) {
      // Return existing payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(
        booking.payment.stripePaymentIntentId
      );

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

    // Create a new PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.totalPrice,
      currency: booking.property.currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingId: booking.id,
        propertyId: booking.propertyId,
        userId: currentUser.id,
      },
    });

    // Create or update Payment record
    await prismadb.payment.upsert({
      where: { bookingId: booking.id },
      create: {
        bookingId: booking.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: booking.totalPrice,
        currency: booking.property.currency,
        status: "PENDING",
      },
      update: {
        stripePaymentIntentId: paymentIntent.id,
        amount: booking.totalPrice,
        currency: booking.property.currency,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[PAYMENT_INTENT_CREATE]", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
