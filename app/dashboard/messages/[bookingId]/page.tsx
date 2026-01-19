import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import prismadb from "@/lib/prisma";
import ChatInterface from "./ChatInterface";

async function getBookingDetails(bookingId: string, userId: string) {
  const booking = await prismadb.booking.findUnique({
    where: { id: bookingId },
    include: {
      property: {
        include: {
          user: true, // Host
        },
      },
      user: true, // Guest
    },
  });

  if (!booking) {
    return null;
  }

  // Verify user has access to this booking
  const isGuest = booking.userId === userId;
  const isHost = booking.property.userId === userId;

  if (!isGuest && !isHost) {
    return null;
  }

  return {
    id: booking.id,
    propertyTitle: booking.property.title,
    propertyImage: booking.property.imageSrc,
    propertyLocation: `${booking.property.city || ""}, ${booking.property.country || ""}`.trim(),
    startDate: booking.startDate.toISOString(),
    endDate: booking.endDate.toISOString(),
    totalPrice: booking.totalPrice,
    status: booking.status,
    currency: booking.property.currency,
    guest: {
      id: booking.user.id,
      name: booking.user.name,
      email: booking.user.email,
      image: booking.user.image,
    },
    host: {
      id: booking.property.user.id,
      name: booking.property.user.name,
      email: booking.property.user.email,
      image: booking.property.user.image,
    },
    role: (isGuest ? "guest" : "host") as "guest" | "host",
  };
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const booking = await getBookingDetails(bookingId, currentUser.id);

  if (!booking) {
    redirect("/dashboard/messages");
  }

  return (
    <ChatInterface
      bookingId={bookingId}
      booking={booking}
      currentUserId={currentUser.id}
    />
  );
}
