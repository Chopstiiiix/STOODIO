import Container from "@/components/Container";
import PropertyCard from "@/components/listings/PropertyCard";
import EmptyState from "@/components/EmptyState";
import prismadb from "@/lib/prisma";
import { Search as SearchIcon } from "lucide-react";

interface SearchParams {
  location?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  guests?: string;
  rooms?: string;
  bathrooms?: string;
}

async function searchProperties(params: SearchParams) {
  const where: any = {
    published: true,
  };

  if (params.location) {
    where.OR = [
      { city: { contains: params.location, mode: "insensitive" } },
      { country: { contains: params.location, mode: "insensitive" } },
      { locationValue: { contains: params.location, mode: "insensitive" } },
    ];
  }

  if (params.category) {
    where.category = params.category;
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) {
      where.price.gte = parseInt(params.minPrice) * 100; // Convert to kobo
    }
    if (params.maxPrice) {
      where.price.lte = parseInt(params.maxPrice) * 100; // Convert to kobo
    }
  }

  if (params.guests) {
    where.guestCount = { gte: parseInt(params.guests) };
  }

  if (params.rooms) {
    where.roomCount = { gte: parseInt(params.rooms) };
  }

  if (params.bathrooms) {
    where.bathroomCount = { gte: parseInt(params.bathrooms) };
  }

  const properties = await prismadb.property.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      images: {
        take: 1,
        orderBy: { order: "asc" },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return properties.map((property) => ({
    ...property,
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  }));
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const properties = await searchProperties(params);

  // Build filter description
  const filters: string[] = [];
  if (params.location) filters.push(`in ${params.location}`);
  if (params.category) filters.push(params.category);
  if (params.minPrice || params.maxPrice) {
    const priceRange = [];
    if (params.minPrice) priceRange.push(`from ₦${params.minPrice}`);
    if (params.maxPrice) priceRange.push(`to ₦${params.maxPrice}`);
    filters.push(priceRange.join(" "));
  }
  if (params.guests) filters.push(`${params.guests}+ guests`);
  if (params.rooms) filters.push(`${params.rooms}+ rooms`);
  if (params.bathrooms) filters.push(`${params.bathrooms}+ bathrooms`);

  const filterDescription = filters.length > 0 ? filters.join(", ") : "all properties";

  if (properties.length === 0) {
    return (
      <EmptyState
        title="No properties found"
        subtitle={`Try adjusting your search filters to find what you're looking for`}
      />
    );
  }

  return (
    <Container>
      <div className="pt-6 pb-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SearchIcon className="w-6 h-6 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
          </div>
          <p className="text-gray-600">
            Found {properties.length} {properties.length === 1 ? "property" : "properties"} {filterDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((property) => {
            const averageRating =
              property.reviews.length > 0
                ? property.reviews.reduce((sum, r) => sum + r.rating, 0) /
                  property.reviews.length
                : 0;

            const imageUrl =
              property.images[0]?.url || property.imageSrc || "";

            return (
              <PropertyCard
                key={property.id}
                data={{
                  ...property,
                  imageSrc: imageUrl,
                }}
                averageRating={averageRating}
                reviewCount={property.reviews.length}
              />
            );
          })}
        </div>
      </div>
    </Container>
  );
}
