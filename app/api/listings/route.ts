import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const listingSchema = z.object({
  type: z.enum(["STUDIO", "SERVICE"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  city: z.string().optional(),
  country: z.string().optional(),
  basePrice: z.number().int().positive("Price must be positive"),
  currency: z.string().default("NGN"),
  policy: z.enum(["FLEXIBLE", "MODERATE", "STRICT"]),
  instantBook: z.boolean().default(false),
  published: z.boolean().default(false),
});

// GET /api/listings - Get all listings (with optional ownerId filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId");

    const where: any = {};

    if (ownerId) {
      where.userId = ownerId;
    } else {
      // Public listings - only show published
      where.published = true;
    }

    const listings = await prismadb.property.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert dates to ISO strings for serialization
    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
      user: {
        ...listing.user,
      },
    }));

    return NextResponse.json(safeListings);
  } catch (error) {
    console.error("[LISTINGS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

// POST /api/listings - Create a new listing
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
      where: {
        email: session.user.email,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = listingSchema.parse(body);

    const listing = await prismadb.property.create({
      data: {
        type: validatedData.type,
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        city: validatedData.city || "",
        country: validatedData.country || "",
        price: validatedData.basePrice,
        currency: validatedData.currency,
        policy: validatedData.policy,
        instantBook: validatedData.instantBook,
        published: validatedData.published,
        userId: currentUser.id,
        // Default values for fields not in MVP form
        imageSrc: "",
        locationValue: `${validatedData.city || ""}, ${validatedData.country || ""}`,
        roomCount: 1,
        bathroomCount: 1,
        guestCount: 1,
      },
      include: {
        user: {
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
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[LISTINGS_POST]", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
