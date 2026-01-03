import { getPropertyById } from "@/actions/properties";
import { getCurrentUser } from "@/actions/auth";
import EmptyState from "@/components/EmptyState";
import Container from "@/components/Container";
import BookingWidget from "@/components/booking/BookingWidget";
import Image from "next/image";
import { Bath, Users, Home, MapPin, Tag } from "lucide-react";

interface IParams {
  id: string;
}

export default async function ListingPage({
  params
}: {
  params: Promise<IParams>
}) {
  const { id } = await params;
  const property = await getPropertyById(id);
  const currentUser = await getCurrentUser();

  if (!property) {
    return <EmptyState />;
  }

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin size={18} />
              <p>{property.city}, {property.country}</p>
            </div>
          </div>

          {/* Image */}
          <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
            {property.imageSrc ? (
              <Image
                src={property.imageSrc}
                fill
                className="object-cover w-full"
                alt={property.title}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            {/* Left Column - Details */}
            <div className="col-span-4 flex flex-col gap-8">
              {/* Host Info */}
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  Hosted by {property.user?.name || "Studio Host"}
                </h2>
                <div className="flex items-center gap-4 font-light text-gray-600">
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

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">About this place</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              <hr />

              {/* Additional Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Type</h4>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag size={16} />
                    <span>{property.type}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Category</h4>
                  <p className="text-gray-600">{property.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Cancellation Policy
                  </h4>
                  <p className="text-gray-600">{property.policy}</p>
                </div>
                {property.instantBook && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">
                      Booking Type
                    </h4>
                    <p className="text-blue-600 font-medium">Instant Book Available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Booking Widget */}
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <div className="sticky top-24">
                <BookingWidget
                  listingId={property.id}
                  basePrice={property.price}
                  currency={property.currency}
                  currentUserId={currentUser?.id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
