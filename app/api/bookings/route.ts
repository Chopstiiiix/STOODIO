import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import prismadb from "@/lib/prisma";

const bookingSchema = z.object({
  listingId: z.string().min(1),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
}).refine(
  (data) => {
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
    message: "Invalid booking times: start must be in future, end must be after start, and duration must be at least 1 hour",
  }
);

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to book" },
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
    const validatedData = bookingSchema.parse(body);

    const startTime = new Date(validatedData.startTime);
    const endTime = new Date(validatedData.endTime);

    // Check if listing exists
    const listing = await prismadb.property.findUnique({
      where: { id: validatedData.listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (!listing.published) {
      return NextResponse.json(
        { error: "Listing is not available for booking" },
        { status: 400 }
      );
    }

    // Check for booking conflicts
    const conflictingBooking = await prismadb.booking.findFirst({
      where: {
        propertyId: validatedData.listingId,
        OR: [
          {
            // New booking starts during existing booking
            AND: [
              { startDate: { lte: startTime } },
              { endDate: { gt: startTime } },
            ],
          },
          {
            // New booking ends during existing booking
            AND: [
              { startDate: { lt: endTime } },
              { endDate: { gte: endTime } },
            ],
          },
          {
            // New booking completely contains existing booking
            AND: [
              { startDate: { gte: startTime } },
              { endDate: { lte: endTime } },
            ],
          },
        ],
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { error: "This time slot is not available. Please choose different times." },
        { status: 409 }
      );
    }

    // Calculate total price (round up to hours * base price)
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
    const totalPrice = durationHours * listing.price;

    // Create the booking
    const booking = await prismadb.booking.create({
      data: {
        propertyId: validatedData.listingId,
        userId: currentUser.id,
        startDate: startTime,
        endDate: endTime,
        totalPrice,
      },
    });

    return NextResponse.json({
      id: booking.id,
      propertyId: booking.propertyId,
      userId: booking.userId,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      totalPrice: booking.totalPrice,
      createdAt: booking.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[BOOKINGS_POST]", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
