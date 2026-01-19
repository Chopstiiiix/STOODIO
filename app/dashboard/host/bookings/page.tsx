import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, User, MessageSquare, Check, X } from "lucide-react";
import Image from "next/image";

async function getHostBookings(userId: string) {
  const bookings = await prismadb.booking.findMany({
    where: {
      property: { userId },
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          imageSrc: true,
          images: {
            take: 1,
            orderBy: { order: "asc" },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings.map((booking) => ({
    ...booking,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    startDate: booking.startDate.toISOString(),
    endDate: booking.endDate.toISOString(),
  }));
}

export default async function HostBookingsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }

  const bookings = await getHostBookings(currentUser.id);

  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
        <p className="text-gray-600 mt-1">
          View and manage all your property bookings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-800">
            {pendingBookings.length}
          </p>
          <p className="text-sm text-yellow-600">Pending</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-800">
            {confirmedBookings.length}
          </p>
          <p className="text-sm text-green-600">Confirmed</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-800">
            {completedBookings.length}
          </p>
          <p className="text-sm text-blue-600">Completed</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">
            {cancelledBookings.length}
          </p>
          <p className="text-sm text-gray-600">Cancelled</p>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No bookings yet
          </h3>
          <p className="text-gray-600 mb-4">
            Your bookings will appear here once guests start booking your
            properties
          </p>
          <Link
            href="/dashboard/host/listings"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View Your Listings
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const propertyImage =
              booking.property.images[0]?.url || booking.property.imageSrc;

            return (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Property Image */}
                  <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                    {propertyImage ? (
                      <Image
                        src={propertyImage}
                        alt={booking.property.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {booking.property.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="text-sm">
                            {booking.user.name || booking.user.email}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === "CONFIRMED"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(booking.startDate), "PPP")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(booking.endDate), "PPP")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Price</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₦{(booking.totalPrice / 100).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/messages/${booking.id}`}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </Link>
                        {/* Additional actions can be added here */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
