"use client";

import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe-client";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import toast from "react-hot-toast";

interface StripeCheckoutWrapperProps {
  bookingId: string;
  amount: number;
  currency: string;
}

export default function StripeCheckoutWrapper({
  bookingId,
  amount,
  currency,
}: StripeCheckoutWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const res = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingId }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to create payment intent");
        }

        setClientSecret(data.clientSecret);
      } catch (error: any) {
        console.error("Failed to create payment intent:", error);
        toast.error(error.message || "Failed to initialize payment");
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [bookingId]);

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#3B82F6",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (isLoading) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Initializing payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to initialize payment</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={getStripe()} options={options}>
      <CheckoutForm
        bookingId={bookingId}
        amount={amount}
        currency={currency}
      />
    </Elements>
  );
}
