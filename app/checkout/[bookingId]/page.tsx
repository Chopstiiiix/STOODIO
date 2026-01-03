import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { getBookings } from "@/actions/bookings";
import Container from "@/components/Container";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import StripeCheckoutWrapper from "./StripeCheckoutWrapper";

interface IParams {
  bookingId: string;
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<IParams>;
}) {
  const { bookingId } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  // Fetch the booking
  const allBookings = await getBookings({ userId: currentUser.id });
  const booking = allBookings.find((b) => b.id === bookingId);

  if (!booking) {
    return (
      <Container>
        <div className="max-w-2xl mx-auto py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Booking Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The booking you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go Home
          </Link>
        </div>
      </Container>
    );
  }

  // Format date and time
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600">Review your booking and pay securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Booking Summary
            </h2>

            <div className="space-y-4">
              {/* Property Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  Property
                </h3>
                <p className="text-gray-900 font-medium">
                  {booking.property.title}
                </p>
                {booking.property.locationValue && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <MapPin size={14} />
                    <span>{booking.property.locationValue}</span>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <Calendar size={14} />
                    Start
                  </div>
                  <p className="text-sm text-gray-900">
                    {startDate.toLocaleDateString("en-NG", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-600">
                    {startDate.toLocaleTimeString("en-NG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <Calendar size={14} />
                    End
                  </div>
                  <p className="text-sm text-gray-900">
                    {endDate.toLocaleDateString("en-NG", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-600">
                    {endDate.toLocaleTimeString("en-NG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                  <Clock size={14} />
                  Duration
                </div>
                <p className="text-gray-900">
                  {durationHours} {durationHours === 1 ? "hour" : "hours"}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>
                    {booking.property.currency || "NGN"}{" "}
                    {((booking.property.price || 0) / 100).toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    × {durationHours} {durationHours === 1 ? "hour" : "hours"}
                  </span>
                  <span className="font-medium">
                    {booking.property.currency || "NGN"}{" "}
                    {(booking.totalPrice / 100).toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>
                    {booking.property.currency || "NGN"}{" "}
                    {(booking.totalPrice / 100).toLocaleString("en-NG", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <StripeCheckoutWrapper
              bookingId={booking.id}
              amount={booking.totalPrice}
              currency={booking.property.currency || "NGN"}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
