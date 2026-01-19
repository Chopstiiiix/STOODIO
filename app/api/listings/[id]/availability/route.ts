import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import {
  getPropertyAvailability,
  verifyPropertyOwnership,
  replaceWeeklyAvailability,
  isValidTimeFormat,
  isValidTimeRange,
} from "@/lib/availability";
import prismadb from "@/lib/prisma";

const weeklyRuleSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().refine(isValidTimeFormat, {
    message: "Invalid time format. Use HH:MM (e.g., 09:00)",
  }),
  endTime: z.string().refine(isValidTimeFormat, {
    message: "Invalid time format. Use HH:MM (e.g., 18:00)",
  }),
});

const availabilitySchema = z.object({
  weeklyRules: z.array(weeklyRuleSchema).refine(
    (rules) => {
      // Check that all time ranges are valid
      return rules.every((rule) =>
        isValidTimeRange(rule.startTime, rule.endTime)
      );
    },
    {
      message: "End time must be after start time",
    }
  ),
});

// GET /api/listings/[id]/availability - Get availability for a listing
export async function GET(
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
        { error: "Forbidden - You can only view your own listing availability" },
        { status: 403 }
      );
    }

    const availability = await getPropertyAvailability(id);

    return NextResponse.json(availability);
  } catch (error) {
    console.error("[AVAILABILITY_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

// POST /api/listings/[id]/availability - Replace weekly availability rules
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
    const validatedData = availabilitySchema.parse(body);

    const availability = await replaceWeeklyAvailability(
      id,
      validatedData.weeklyRules
    );

    return NextResponse.json(availability);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[AVAILABILITY_POST]", error);
    return NextResponse.json(
      { error: "Failed to update availability" },
      { status: 500 }
    );
  }
}
