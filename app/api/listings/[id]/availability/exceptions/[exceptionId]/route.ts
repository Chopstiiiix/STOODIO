import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  verifyPropertyOwnership,
  deleteAvailabilityException,
} from "@/lib/availability";
import prismadb from "@/lib/prisma";

// DELETE /api/listings/[id]/availability/exceptions/[exceptionId] - Delete an exception
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; exceptionId: string }> }
) {
  try {
    const { id, exceptionId } = await params;
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

    // Verify the exception belongs to this property
    const exception = await prismadb.availabilityException.findUnique({
      where: { id: exceptionId },
    });

    if (!exception) {
      return NextResponse.json(
        { error: "Exception not found" },
        { status: 404 }
      );
    }

    if (exception.propertyId !== id) {
      return NextResponse.json(
        { error: "Exception does not belong to this property" },
        { status: 400 }
      );
    }

    await deleteAvailabilityException(exceptionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[EXCEPTION_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete exception" },
      { status: 500 }
    );
  }
}
