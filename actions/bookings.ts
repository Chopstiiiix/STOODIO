"use server";

import prismadb from "@/lib/prisma";

// Typed helper that matches the exact query
async function getBookingsWithPropertyTyped() {
  return prismadb.booking.findMany({
    include: { property: true },
  });
}

// Derive type directly from the function (always correct)
type BookingWithProperty = Awaited<ReturnType<typeof getBookingsWithPropertyTyped>>[number];

export async function createBooking(data: {
  propertyId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
}) {
  try {
    const booking = await prismadb.booking.create({
      data: {
        propertyId: data.propertyId,
        userId: data.userId,
        startDate: data.startDate,
        endDate: data.endDate,
        totalPrice: data.totalPrice,
      },
    });

    return {
      ...booking,
      createdAt: booking.createdAt.toISOString(),
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
    };
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getBookings(params: {
  propertyId?: string;
  userId?: string;
  authorId?: string;
}) {
  try {
    const { propertyId, userId, authorId } = params;

    const query: any = {};

    if (propertyId) {
      query.propertyId = propertyId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.property = { userId: authorId };
    }

    const bookings = await prismadb.booking.findMany({
      where: query,
      include: {
        property: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeBookings = (bookings as BookingWithProperty[]).map(
      (booking: BookingWithProperty) => ({
        ...booking,
        createdAt: booking.createdAt.toISOString(),
        startDate: booking.startDate.toISOString(),
        endDate: booking.endDate.toISOString(),
        property: {
          ...booking.property,
          createdAt: booking.property.createdAt.toISOString(),
        },
      })
    );

    return safeBookings;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function deleteBooking(bookingId: string, userId: string) {
  try {
    const booking = await prismadb.booking.deleteMany({
      where: {
        id: bookingId,
        OR: [{ userId: userId }, { property: { userId: userId } }],
      },
    });

    return booking;
  } catch (error: any) {
    throw new Error(error);
  }
}
