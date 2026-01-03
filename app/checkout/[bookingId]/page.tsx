import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { getBookings } from "@/actions/bookings";
import Container from "@/components/Container";
import Link from "next/link";
import { CheckCircle, Calendar, Clock, CreditCard } from "lucide-react";

interface IParams {
  bookingId: string;
}

export default async function CheckoutPage({
  params
}: {
  params: Promise<IParams>
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
            The booking you're looking for doesn't exist or you don't have access to it.
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
      <div className="max-w-3xl mx-auto py-8">
        {/* Success Header */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle size={64} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-700">
            Your booking has been successfully created. Here are the details:
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Booking Details
          </h2>

          <div className="space-y-6">
            {/* Property Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Property
              </h3>
              <p className="text-lg font-medium text-gray-900">
                {booking.property.title}
              </p>
              <p className="text-gray-600">{booking.property.locationValue}</p>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Start Time
                </h3>
                <p className="text-gray-900">
                  {startDate.toLocaleDateString("en-NG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-600">
                  {startDate.toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  End Time
                </h3>
                <p className="text-gray-900">
                  {endDate.toLocaleDateString("en-NG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-600">
                  {endDate.toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock size={16} />
                Duration
              </h3>
              <p className="text-gray-900">
                {durationHours} {durationHours === 1 ? "hour" : "hours"}
              </p>
            </div>

            {/* Booking ID */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Booking Reference
              </h3>
              <p className="text-gray-900 font-mono text-sm">{booking.id}</p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CreditCard size={24} />
            Payment Summary
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Rate per hour:</span>
              <span className="font-medium">
                NGN {((booking.property.price || 0) / 100).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Duration:</span>
              <span className="font-medium">{durationHours} hours</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total:</span>
              <span>
                NGN {(booking.totalPrice / 100).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This is a booking confirmation. Payment processing
              will be implemented in a future update. For now, please contact the host
              directly to arrange payment.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard/bookings"
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 text-center rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            View My Bookings
          </Link>
          <Link
            href="/"
            className="flex-1 px-6 py-3 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Browse More Listings
          </Link>
        </div>
      </div>
    </Container>
  );
}
