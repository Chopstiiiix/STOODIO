import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

// GET /api/properties/[propertyId]/reviews - Get property reviews
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const reviews = await prismadb.review.findMany({
      where: {
        propertyId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeReviews = reviews.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
    }));

    return NextResponse.json(safeReviews);
  } catch (error) {
    console.error("[REVIEWS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/properties/[propertyId]/reviews - Create a review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if property exists
    const property = await prismadb.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Check if user has completed booking for this property
    const completedBooking = await prismadb.booking.findFirst({
      where: {
        propertyId,
        userId: currentUser.id,
        status: "COMPLETED",
      },
    });

    if (!completedBooking) {
      return NextResponse.json(
        { error: "You must complete a booking before leaving a review" },
        { status: 403 }
      );
    }

    // Check if user already reviewed this property
    const existingReview = await prismadb.review.findFirst({
      where: {
        propertyId,
        userId: currentUser.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this property" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = reviewSchema.parse(body);

    const review = await prismadb.review.create({
      data: {
        propertyId,
        userId: currentUser.id,
        rating: validatedData.rating,
        comment: validatedData.comment || "",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...review,
      createdAt: review.createdAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[REVIEWS_POST]", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
