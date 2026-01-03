import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prisma";

// POST /api/connect/onboard - Create or get Stripe Connect onboarding link
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

    // Check if user is a host
    if (currentUser.userType !== "host") {
      return NextResponse.json(
        { error: "Only hosts can connect Stripe accounts" },
        { status: 403 }
      );
    }

    let accountId = currentUser.stripeAccountId;

    // Create a new Stripe Connect account if doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "NG", // Nigeria
        email: currentUser.email,
        capabilities: {
          transfers: { requested: true },
        },
      });

      accountId = account.id;

      // Save the account ID
      await prismadb.user.update({
        where: { id: currentUser.id },
        data: { stripeAccountId: accountId },
      });
    }

    // Create account link for onboarding
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/dashboard/host/connect?refresh=true`,
      return_url: `${origin}/dashboard/host/connect?success=true`,
      type: "account_onboarding",
    });

    return NextResponse.json({
      url: accountLink.url,
      accountId,
    });
  } catch (error: any) {
    console.error("[CONNECT_ONBOARD]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create onboarding link" },
      { status: 500 }
    );
  }
}
