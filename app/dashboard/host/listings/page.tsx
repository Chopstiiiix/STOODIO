import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import Link from "next/link";
import { SafeProperty } from "@/types";
import prismadb from "@/lib/prisma";

async function getHostListings(userId: string) {
  const listings = await prismadb.property.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert dates to ISO strings for serialization
  return listings.map((listing) => ({
    ...listing,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  }));
}

export default async function HostListingsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const listings: SafeProperty[] = await getHostListings(currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600 mt-1">
            Manage your studio and service listings
          </p>
        </div>
        <Link
          href="/dashboard/host/listings/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Create New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No listings yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Get started by creating your first studio or service listing.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/host/listings/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Your First Listing
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {listing.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        listing.published
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {listing.published ? "Published" : "Draft"}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {listing.type}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2 mb-3">
                    {listing.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-medium">{listing.category}</span>
                    {listing.city && listing.country && (
                      <span>
                        {listing.city}, {listing.country}
                      </span>
                    )}
                    <span className="font-semibold text-gray-900">
                      {listing.currency} {(listing.price / 100).toLocaleString()} /hr
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Policy: {listing.policy}</span>
                    {listing.instantBook && (
                      <span className="text-blue-600">Instant Book</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/dashboard/host/listings/${listing.id}/edit`}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
