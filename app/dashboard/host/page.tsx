import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prisma";
import Link from "next/link";
import {
  Home,
  Calendar,
  DollarSign,
  TrendingUp,
  Star,
  Users,
} from "lucide-react";

async function getHostDashboardData(userId: string) {
  const [properties, bookings, reviews] = await Promise.all([
    // Get all properties
    prismadb.property.findMany({
      where: { userId },
      include: {
        bookings: true,
        reviews: true,
        images: { take: 1, orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }),

    // Get all bookings
    prismadb.booking.findMany({
      where: {
        property: { userId },
      },
      include: {
        property: {
          select: {
            title: true,
            imageSrc: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),

    // Get all reviews
    prismadb.review.findMany({
      where: {
        property: { userId },
      },
      include: {
        property: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // Calculate stats
  const totalProperties = properties.length;
  const publishedProperties = properties.filter((p) => p.published).length;

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedBookingsArray = bookings.filter(
    (b) => b.status === "CONFIRMED"
  );
  const confirmedBookings = confirmedBookingsArray.length;
  const completedBookingsArray = bookings.filter(
    (b) => b.status === "COMPLETED"
  );
  const completedBookings = completedBookingsArray.length;

  const totalRevenue = completedBookingsArray.reduce(
    (sum, b) => sum + b.totalPrice,
    0
  );
  const pendingRevenue = confirmedBookingsArray.reduce(
    (sum, b) => sum + b.totalPrice,
    0
  );

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  return {
    properties,
    bookings,
    reviews,
    stats: {
      totalProperties,
      publishedProperties,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalRevenue,
      pendingRevenue,
      totalReviews,
      averageRating,
    },
  };
}

export default async function HostDashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }

  const data = await getHostDashboardData(currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage your listings, bookings, and view analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Listings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data.stats.totalProperties}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {data.stats.publishedProperties} published
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data.stats.totalBookings}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {data.stats.pendingBookings} pending
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₦{(data.stats.totalRevenue / 100).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ₦{(data.stats.pendingRevenue / 100).toLocaleString()} pending
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data.stats.averageRating.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {data.stats.totalReviews} reviews
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/dashboard/host/listings/new"
          className="bg-blue-600 text-white rounded-lg p-4 text-center font-semibold hover:bg-blue-700 transition"
        >
          + Create New Listing
        </Link>
        <Link
          href="/dashboard/host/bookings"
          className="bg-white border-2 border-gray-200 text-gray-900 rounded-lg p-4 text-center font-semibold hover:bg-gray-50 transition"
        >
          Manage Bookings
        </Link>
        <Link
          href="/dashboard/host/listings"
          className="bg-white border-2 border-gray-200 text-gray-900 rounded-lg p-4 text-center font-semibold hover:bg-gray-50 transition"
        >
          View All Listings
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Bookings
          </h2>
          {data.bookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No bookings yet</p>
          ) : (
            <div className="space-y-4">
              {data.bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {booking.property.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {booking.user.name || booking.user.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(booking.startDate).toLocaleDateString()} -{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₦{(booking.totalPrice / 100).toLocaleString()}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Reviews
          </h2>
          {data.reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {data.reviews.map((review) => (
                <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {review.property.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    by {review.user.name || "Anonymous"}
                  </p>
                  {review.comment && (
                    <p className="text-sm text-gray-700 mt-2">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
