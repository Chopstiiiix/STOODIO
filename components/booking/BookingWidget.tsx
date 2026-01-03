"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import toast from "react-hot-toast";

interface BookingWidgetProps {
  listingId: string;
  basePrice: number; // Price per hour in minor units (e.g., kobo)
  currency: string;
  currentUserId?: string;
}

const bookingSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
}).refine(
  (data) => {
    if (!data.startTime || !data.endTime) return false;

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    const now = new Date();

    // Start must be in the future
    if (start <= now) {
      return false;
    }

    // End must be after start
    if (end <= start) {
      return false;
    }

    // Duration must be at least 1 hour
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (durationHours < 1) {
      return false;
    }

    return true;
  },
  {
    message: "Invalid times: start must be in future, end must be after start, and duration must be at least 1 hour",
  }
);

export default function BookingWidget({
  listingId,
  basePrice,
  currency,
  currentUserId,
}: BookingWidgetProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [estimatedHours, setEstimatedHours] = useState(0);

  // Calculate estimated price when times change
  useEffect(() => {
    if (startTime && endTime) {
      try {
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (end > start) {
          const durationMs = end.getTime() - start.getTime();
          const hours = Math.ceil(durationMs / (1000 * 60 * 60));
          const price = hours * basePrice;

          setEstimatedHours(hours);
          setEstimatedPrice(price);
        } else {
          setEstimatedHours(0);
          setEstimatedPrice(0);
        }
      } catch {
        setEstimatedHours(0);
        setEstimatedPrice(0);
      }
    } else {
      setEstimatedHours(0);
      setEstimatedPrice(0);
    }
  }, [startTime, endTime, basePrice]);

  const handleBook = async () => {
    // Check if user is logged in
    if (!currentUserId) {
      toast.error("Please login to book");
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(window.location.pathname);
      router.push(`/login?returnUrl=${returnUrl}`);
      return;
    }

    // Validate inputs
    const validation = bookingSchema.safeParse({ startTime, endTime });

    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || "Invalid booking times";
      toast.error(errorMessage);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          startTime,
          endTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      toast.success("Booking created successfully!");

      // Redirect to checkout
      router.push(`/checkout/${data.id}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsLoading(false);
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
      {/* Price Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-gray-900">
            {currency} {formatPrice(basePrice)}
          </div>
          <div className="text-gray-600">per hour</div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="p-6 space-y-4">
        <div>
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Start Time
          </label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            End Time
          </label>
          <input
            type="datetime-local"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
          />
        </div>

        <button
          onClick={handleBook}
          disabled={isLoading || !startTime || !endTime}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Book Now"}
        </button>
      </div>

      {/* Price Estimate */}
      {estimatedHours > 0 && (
        <div className="px-6 pb-6">
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Duration:</span>
              <span className="font-medium">
                {estimatedHours} {estimatedHours === 1 ? "hour" : "hours"}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Rate:</span>
              <span className="font-medium">
                {currency} {formatPrice(basePrice)} × {estimatedHours}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">Estimated Total:</span>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {currency} {formatPrice(estimatedPrice)}
                  </div>
                  <div className="text-xs text-gray-500">
                    (rounded up to full hours)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="px-6 pb-6">
        <p className="text-xs text-gray-500 text-center">
          Minimum booking duration: 1 hour
        </p>
      </div>
    </div>
  );
}
