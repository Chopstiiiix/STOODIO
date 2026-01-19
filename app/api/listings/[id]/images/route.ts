import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prismadb from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// POST /api/listings/[id]/images - Add images to a property
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

    // Verify property ownership
    const property = await prismadb.property.findUnique({
      where: { id },
    });

    if (!property || property.userId !== currentUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { images } = body; // Array of { url: string, key: string }

    if (!Array.isArray(images)) {
      return NextResponse.json(
        { error: "Images must be an array" },
        { status: 400 }
      );
    }

    // Get current image count
    const currentImageCount = await prismadb.propertyImage.count({
      where: { propertyId: id },
    });

    // Create images with proper ordering
    const createdImages = await Promise.all(
      images.map((img, index) =>
        prismadb.propertyImage.create({
          data: {
            propertyId: id,
            url: img.url,
            key: img.key,
            order: currentImageCount + index,
          },
        })
      )
    );

    // Update property imageSrc to first image if not set
    if (!property.imageSrc && createdImages.length > 0) {
      await prismadb.property.update({
        where: { id },
        data: { imageSrc: createdImages[0].url },
      });
    }

    return NextResponse.json(createdImages);
  } catch (error) {
    console.error("[PROPERTY_IMAGES_POST]", error);
    return NextResponse.json(
      { error: "Failed to add images" },
      { status: 500 }
    );
  }
}

// DELETE /api/listings/[id]/images?key=... - Delete a property image
export async function DELETE(
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

    // Verify property ownership
    const property = await prismadb.property.findUnique({
      where: { id },
    });

    if (!property || property.userId !== currentUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Image key is required" },
        { status: 400 }
      );
    }

    // Delete the image
    await prismadb.propertyImage.deleteMany({
      where: {
        propertyId: id,
        key: key,
      },
    });

    // Update property imageSrc if it was the deleted image
    const remainingImages = await prismadb.propertyImage.findMany({
      where: { propertyId: id },
      orderBy: { order: "asc" },
    });

    if (property.imageSrc?.includes(key)) {
      await prismadb.property.update({
        where: { id },
        data: { imageSrc: remainingImages[0]?.url || "" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PROPERTY_IMAGES_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
