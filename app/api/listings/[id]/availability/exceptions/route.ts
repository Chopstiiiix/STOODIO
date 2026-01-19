import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import {
  verifyPropertyOwnership,
  createAvailabilityException,
} from "@/lib/availability";
import prismadb from "@/lib/prisma";

const exceptionSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  reason: z.string().optional(),
}).refine(
  (data) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
  },
  {
    message: "End time must be after start time",
  }
);

// POST /api/listings/[id]/availability/exceptions - Create an exception
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Verify ownership
    const isOwner = await verifyPropertyOwnership(id, currentUser.id);

    if (!isOwner) {
      return NextResponse.json(
        { error: "Forbidden - You can only manage your own listing availability" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = exceptionSchema.parse(body);

    const exception = await createAvailabilityException(id, {
      startTime: new Date(validatedData.startTime),
      endTime: new Date(validatedData.endTime),
      reason: validatedData.reason,
    });

    return NextResponse.json(exception);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[EXCEPTION_POST]", error);
    return NextResponse.json(
      { error: "Failed to create exception" },
      { status: 500 }
    );
  }
}
