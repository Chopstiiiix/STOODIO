import { getCurrentUser } from "@/actions/auth";
import prismadb from "@/lib/prisma";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import Image from "next/image";
import { User, Mail, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface IParams {
  userId: string;
}

async function getUserProfile(userId: string) {
  try {
    const user = await prismadb.user.findUnique({
      where: { id: userId },
      include: {
        properties: {
          where: { published: true },
          take: 6,
          orderBy: { createdAt: "desc" },
          include: {
            images: {
              take: 1,
              orderBy: { order: "asc" },
            },
          },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            property: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        _count: {
          select: {
            properties: { where: { published: true } },
            reviews: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      emailVerified: user.emailVerified?.toISOString() || null,
    };
  } catch (error) {
    return null;
  }
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<IParams>;
}) {
  const { userId } = await params;
  const currentUser = await getCurrentUser();
  const profile = await getUserProfile(userId);

  if (!profile) {
    return <EmptyState title="User not found" subtitle="This user does not exist" />;
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <Container>
      <div className="max-w-5xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                  {profile.image ? (
                    <Image
                      src={profile.image}
                      alt={profile.name || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-500">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.name || "Anonymous User"}
                </h1>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  {profile.email && !isOwnProfile && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>Email available</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {format(new Date(profile.createdAt), "MMMM yyyy")}</span>
                  </div>
                  {profile.userType && (
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {profile.userType}
                      </span>
                    </div>
                  )}
                  {profile.studioType && profile.userType === "host" && (
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {profile.studioType} Studio
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isOwnProfile && (
                <Link
                  href="/profile/edit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {profile._count.properties}
                </div>
                <div className="text-sm text-gray-600">Listings</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {profile._count.reviews}
                </div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
            </div>

            {/* Listings Section */}
            {profile.properties.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {isOwnProfile ? "Your Listings" : "Listings"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.properties.map((property) => (
                    <Link
                      key={property.id}
                      href={`/properties/${property.id}`}
                      className="group"
                    >
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                        <div className="relative h-48 bg-gray-200">
                          {property.images[0] ? (
                            <Image
                              src={property.images[0].url}
                              alt={property.title}
                              fill
                              className="object-cover group-hover:scale-105 transition"
                            />
                          ) : property.imageSrc ? (
                            <Image
                              src={property.imageSrc}
                              alt={property.title}
                              fill
                              className="object-cover group-hover:scale-105 transition"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MapPin className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {property.title}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {property.locationValue}
                          </p>
                          <p className="mt-1 font-bold text-gray-900">
                            ₦{(property.price / 100).toLocaleString()}
                            <span className="text-sm font-normal text-gray-600">/hr</span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
