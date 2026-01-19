import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prisma";

// GET /api/bookings/[id]/messages - Get all messages for a booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const currentUser = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch booking with property to verify user access
    const booking = await prismadb.booking.findUnique({
      where: { id },
      include: {
        property: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify user is either the guest or the host
    const isGuest = booking.userId === currentUser.id;
    const isHost = booking.property.userId === currentUser.id;

    if (!isGuest && !isHost) {
      return NextResponse.json(
        { error: "Forbidden - You don't have access to this conversation" },
        { status: 403 }
      );
    }

    // Fetch all messages for the booking
    const messages = await prismadb.message.findMany({
      where: { bookingId: id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      messages.map((msg) => ({
        id: msg.id,
        bookingId: msg.bookingId,
        senderId: msg.senderId,
        content: msg.content,
        createdAt: msg.createdAt.toISOString(),
        sender: msg.sender,
      }))
    );
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
