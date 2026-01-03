import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const updateListingSchema = z.object({
  type: z.enum(["STUDIO", "SERVICE"]).optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  basePrice: z.number().int().positive().optional(),
  currency: z.string().optional(),
  policy: z.enum(["FLEXIBLE", "MODERATE", "STRICT"]).optional(),
  instantBook: z.boolean().optional(),
  published: z.boolean().optional(),
});

// GET /api/listings/[id] - Get a single listing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prismadb.property.findUnique({
      where: {
        id: params.id,
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

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("[LISTING_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}

// PATCH /api/listings/[id] - Update a listing
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if listing exists and belongs to user
    const existingListing = await prismadb.property.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingListing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (existingListing.userId !== currentUser.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only edit your own listings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateListingSchema.parse(body);

    // Build update data object
    const updateData: any = {};

    if (validatedData.type !== undefined) updateData.type = validatedData.type;
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.category !== undefined) updateData.category = validatedData.category;
    if (validatedData.city !== undefined) updateData.city = validatedData.city;
    if (validatedData.country !== undefined) updateData.country = validatedData.country;
    if (validatedData.basePrice !== undefined) updateData.price = validatedData.basePrice;
    if (validatedData.currency !== undefined) updateData.currency = validatedData.currency;
    if (validatedData.policy !== undefined) updateData.policy = validatedData.policy;
    if (validatedData.instantBook !== undefined) updateData.instantBook = validatedData.instantBook;
    if (validatedData.published !== undefined) updateData.published = validatedData.published;

    // Update locationValue if city or country changed
    if (validatedData.city !== undefined || validatedData.country !== undefined) {
      const city = validatedData.city !== undefined ? validatedData.city : existingListing.city;
      const country = validatedData.country !== undefined ? validatedData.country : existingListing.country;
      updateData.locationValue = `${city || ""}, ${country || ""}`;
    }

    const listing = await prismadb.property.update({
      where: {
        id: params.id,
      },
      data: updateData,
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

    console.error("[LISTING_PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
  }
}
