import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { MessageCircle, Calendar, MapPin } from "lucide-react";
import { getCurrentUser } from "@/actions/auth";
import prismadb from "@/lib/prisma";
import Container from "@/components/Container";

async function getBookingsWithMessages(userId: string) {
  // Get bookings where user is guest
  const asGuest = await prismadb.booking.findMany({
    where: { userId },
    include: {
      property: {
        include: {
          user: true, // Host
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Get bookings where user is host
  const asHost = await prismadb.booking.findMany({
    where: {
      property: {
        userId,
      },
    },
    include: {
      property: {
        include: {
          user: true, // Host (current user)
        },
      },
      user: true, // Guest
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Combine and sort by most recent activity
  const allBookings = [...asGuest, ...asHost].sort((a, b) => {
    const aTime = a.messages[0]?.createdAt || a.updatedAt;
    const bTime = b.messages[0]?.createdAt || b.updatedAt;
    return bTime.getTime() - aTime.getTime();
  });

  return allBookings.map((booking) => ({
    id: booking.id,
    propertyTitle: booking.property.title,
    propertyImage: booking.property.imageSrc,
    propertyLocation: `${booking.property.city || ""}, ${booking.property.country || ""}`.trim(),
    startDate: booking.startDate.toISOString(),
    endDate: booking.endDate.toISOString(),
    totalPrice: booking.totalPrice,
    status: booking.status,
    // Determine the other party in the conversation
    otherParty: {
      id: booking.userId === userId ? booking.property.user.id : booking.user!.id,
      name: booking.userId === userId ? booking.property.user.name : booking.user!.name,
      image: booking.userId === userId ? booking.property.user.image : booking.user!.image,
    },
    role: booking.userId === userId ? "guest" : "host",
    lastMessage: booking.messages[0]
      ? {
          content: booking.messages[0].content,
          createdAt: booking.messages[0].createdAt.toISOString(),
        }
      : null,
  }));
}

export default async function MessagesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const bookings = await getBookingsWithMessages(currentUser.id);

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600 mb-8">
          View and manage your conversations with {currentUser.userType === "host" ? "guests" : "hosts"}
        </p>

        {bookings.length === 0 ? (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No conversations yet
            </h2>
            <p className="text-gray-600">
              Your messages will appear here once you have bookings
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/dashboard/messages/${booking.id}`}
                className="block bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition"
              >
                <div className="flex items-start gap-4">
                  {/* Property Image */}
                  {booking.propertyImage && (
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={booking.propertyImage}
                        alt={booking.propertyTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Property Title & Role Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {booking.propertyTitle}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          booking.role === "host"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {booking.role === "host" ? "Host" : "Guest"}
                      </span>
                    </div>

                    {/* Other Party */}
                    <p className="text-sm text-gray-600 mb-2">
                      {booking.role === "host" ? "Guest" : "Host"}:{" "}
                      <span className="font-medium">{booking.otherParty.name || "Unknown"}</span>
                    </p>

                    {/* Booking Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {format(new Date(booking.startDate), "MMM d")} -{" "}
                          {format(new Date(booking.endDate), "MMM d, yyyy")}
                        </span>
                      </div>
                      {booking.propertyLocation && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{booking.propertyLocation}</span>
                        </div>
                      )}
                    </div>

                    {/* Last Message */}
                    {booking.lastMessage ? (
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {booking.lastMessage.content}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No messages yet</p>
                    )}
                  </div>

                  {/* Status & Time */}
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "COMPLETED"
                          ? "bg-gray-100 text-gray-800"
                          : booking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                    {booking.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {format(new Date(booking.lastMessage.createdAt), "MMM d, h:mm a")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
