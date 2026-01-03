"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";

interface CheckoutFormProps {
  bookingId: string;
  amount: number;
  currency: string;
}

export default function CheckoutForm({
  bookingId,
  amount,
  currency,
}: CheckoutFormProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Check if payment was already successful (from URL parameter)
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent?.status === "succeeded") {
        setPaymentSuccess(true);
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/${bookingId}?success=true`,
        },
      });

      // This point will only be reached if there's an immediate error when
      // confirming the payment. Otherwise, customer will be redirected to
      // the `return_url`
      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message || "Payment failed");
        } else {
          setErrorMessage("An unexpected error occurred");
        }
        toast.error(error.message || "Payment failed");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setErrorMessage("An unexpected error occurred");
      toast.error("Payment failed");
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-700 mb-6">
          Your booking has been confirmed. Thank you for your payment.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Details
        </h3>

        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full px-6 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isProcessing
          ? "Processing..."
          : `Pay ${currency} ${(amount / 100).toLocaleString("en-NG", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Secure payment powered by Stripe. Your payment information is encrypted.
      </p>
    </form>
  );
}
