import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prisma";
import { z } from "zod";

const messageSchema = z.object({
  bookingId: z.string().min(1),
  content: z.string().min(1).max(2000),
});

// POST /api/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const { bookingId, content } = messageSchema.parse(body);

    // Fetch booking with property to verify user access
    const booking = await prismadb.booking.findUnique({
      where: { id: bookingId },
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

    // Create the message
    const message = await prismadb.message.create({
      data: {
        bookingId,
        senderId: currentUser.id,
        content,
      },
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
    });

    return NextResponse.json({
      id: message.id,
      bookingId: message.bookingId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[MESSAGE_POST]", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
