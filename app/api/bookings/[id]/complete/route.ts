import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prisma";

// PATCH /api/bookings/[id]/complete - Mark booking as completed
export async function PATCH(
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

    // Fetch the booking with property details
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

    // Check if user is the property owner (host)
    if (booking.property.userId !== currentUser.id) {
      return NextResponse.json(
        { error: "Forbidden - Only the listing owner can complete this booking" },
        { status: 403 }
      );
    }

    // Check if booking is in CONFIRMED status
    if (booking.status !== "CONFIRMED") {
      return NextResponse.json(
        { error: `Cannot complete booking with status: ${booking.status}. Booking must be CONFIRMED.` },
        { status: 400 }
      );
    }

    // Update booking status to COMPLETED
    const updatedBooking = await prismadb.booking.update({
      where: { id },
      data: {
        status: "COMPLETED",
      },
      include: {
        property: true,
        user: true,
      },
    });

    return NextResponse.json({
      id: updatedBooking.id,
      status: updatedBooking.status,
      propertyId: updatedBooking.propertyId,
      userId: updatedBooking.userId,
      startDate: updatedBooking.startDate.toISOString(),
      endDate: updatedBooking.endDate.toISOString(),
      totalPrice: updatedBooking.totalPrice,
      updatedAt: updatedBooking.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("[BOOKING_COMPLETE]", error);
    return NextResponse.json(
      { error: "Failed to complete booking" },
      { status: 500 }
    );
  }
}
