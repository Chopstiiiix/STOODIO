import Stripe from "stripe";

// Allow build to succeed without STRIPE_SECRET_KEY
// Runtime errors will occur if Stripe is used without the key
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    })
  : (null as unknown as Stripe);
