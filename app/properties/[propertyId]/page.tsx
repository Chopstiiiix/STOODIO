import { getPropertyById } from "@/actions/properties";
import { getCurrentUser } from "@/actions/auth";
import { getBookings } from "@/actions/bookings";
import EmptyState from "@/components/EmptyState";
import Container from "@/components/Container";
import PropertyReservation from "@/components/listings/PropertyReservation";
import PropertyImageGallery from "@/components/listings/PropertyImageGallery";
import ReviewsList from "@/components/reviews/ReviewsList";
import ReviewForm from "@/components/reviews/ReviewForm";
import prismadb from "@/lib/prisma";
import { Bath, Users, Home } from "lucide-react";

interface IParams {
  propertyId: string;
}

export default async function PropertyPage({
  params
}: {
  params: Promise<IParams>
}) {
  const { propertyId } = await params;
  const property = await getPropertyById(propertyId);
  const bookings = await getBookings({ propertyId });
  const currentUser = await getCurrentUser();

  if (!property) {
    return <EmptyState />;
  }

  // Check if current user can leave a review
  let canReview = false;
  let hasReviewed = false;

  if (currentUser) {
    // Check if user has completed booking
    const completedBooking = await prismadb.booking.findFirst({
      where: {
        propertyId,
        userId: currentUser.id,
        status: "COMPLETED",
      },
    });

    canReview = !!completedBooking;

    // Check if user already left a review
    if (canReview) {
      const existingReview = await prismadb.review.findFirst({
        where: {
          propertyId,
          userId: currentUser.id,
        },
      });
      hasReviewed = !!existingReview;
    }
  }

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">{property.title}</h1>
            <p className="text-neutral-500 mt-2">{property.locationValue}</p>
          </div>
          <PropertyImageGallery
            images={property.images || []}
            fallbackImage={property.imageSrc || undefined}
            title={property.title}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <div className="col-span-4 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold flex flex-row items-center gap-2">
                  <div>Hosted by {property.user?.name}</div>
                </h2>
                <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Users size={20} />
                    {property.guestCount} guests
                  </div>
                  <div className="flex items-center gap-2">
                    <Home size={20} />
                    {property.roomCount} rooms
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath size={20} />
                    {property.bathroomCount} bathrooms
                  </div>
                </div>
              </div>
              <hr />
              <div className="text-lg font-light text-neutral-500">
                {property.description}
              </div>
            </div>
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <PropertyReservation
                price={property.price}
                propertyId={property.id}
                bookings={bookings}
                currentUserId={currentUser?.id}
              />
            </div>
          </div>

          {/* Reviews Section */}
          <hr className="my-8" />

          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10">
            <div className="col-span-4">
              <ReviewsList propertyId={propertyId} />
            </div>

            {canReview && !hasReviewed && (
              <div className="md:col-span-3">
                <ReviewForm propertyId={propertyId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
