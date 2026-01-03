import { getProperties } from "@/actions/properties";
import { getCurrentUser } from "@/actions/auth";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import PropertyCard from "@/components/listings/PropertyCard";
import { SafeProperty } from "@/types";

interface HomeProps {
  searchParams: Promise<{
    category?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    locationValue?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const properties = await getProperties({
    category: params.category,
    guestCount: params.guestCount,
    roomCount: params.roomCount,
    bathroomCount: params.bathroomCount,
    locationValue: params.locationValue,
  });
  const currentUser = await getCurrentUser();

  if (properties.length === 0) {
    return <EmptyState showReset />;
  }

  return (
    <Container>
      <div
        className="
          pt-24
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {properties.map((property: SafeProperty) => (
          <PropertyCard
            currentUser={currentUser}
            key={property.id}
            data={property}
          />
        ))}
      </div>
    </Container>
  );
}
