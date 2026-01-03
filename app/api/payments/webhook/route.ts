import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prisma";
import Stripe from "stripe";

// Disable body parsing, need raw body for webhook signature verification
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Webhook handler error:`, error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);

  // Update payment status
  const payment = await prismadb.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
    include: { booking: true },
  });

  if (!payment) {
    console.error(`Payment not found for PaymentIntent: ${paymentIntent.id}`);
    return;
  }

  // Update payment and booking status in a transaction
  await prismadb.$transaction([
    prismadb.payment.update({
      where: { id: payment.id },
      data: { status: "PAID" },
    }),
    prismadb.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CONFIRMED" },
    }),
  ]);

  console.log(`Booking ${payment.bookingId} confirmed after payment`);
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`PaymentIntent failed: ${paymentIntent.id}`);

  // Update payment status
  const payment = await prismadb.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (!payment) {
    console.error(`Payment not found for PaymentIntent: ${paymentIntent.id}`);
    return;
  }

  await prismadb.payment.update({
    where: { id: payment.id },
    data: { status: "FAILED" },
  });

  console.log(`Payment ${payment.id} marked as failed`);
}
