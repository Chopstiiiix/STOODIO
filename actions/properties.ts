"use server";

import prismadb from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type PropertyPayload = Prisma.PropertyGetPayload<{}>;

export interface PropertyFilters {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export async function getProperties(filters: PropertyFilters = {}) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = filters;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
      };
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    if (startDate && endDate) {
      query.NOT = {
        bookings: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    const properties = await prismadb.property.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeProperties = (properties as PropertyPayload[]).map(
      (property: PropertyPayload) => ({
        ...property,
        createdAt: property.createdAt.toISOString(),
        updatedAt: property.updatedAt.toISOString(),
      })
    );

    return safeProperties;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getPropertyById(propertyId: string) {
  try {
    const property = await prismadb.property.findUnique({
      where: {
        id: propertyId,
      },
      include: {
        user: true,
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!property) {
      return null;
    }

    return {
      ...property,
      createdAt: property.createdAt.toISOString(),
      user: {
        ...property.user,
        createdAt: property.user.createdAt.toISOString(),
        updatedAt: property.user.updatedAt.toISOString(),
        emailVerified: property.user.emailVerified?.toISOString() || null,
      },
    };
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createProperty(data: {
  title: string;
  description: string;
  imageSrc: string;
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string;
  price: number;
  userId: string;
}) {
  try {
    const property = await prismadb.property.create({
      data,
    });

    return {
      ...property,
      createdAt: property.createdAt.toISOString(),
    };
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function deleteProperty(propertyId: string, userId: string) {
  try {
    const property = await prismadb.property.deleteMany({
      where: {
        id: propertyId,
        userId,
      },
    });

    return property;
  } catch (error: any) {
    throw new Error(error);
  }
}
