"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/inputs/Input";
import toast from "react-hot-toast";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";
import { User, X } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  userType: z.enum(["host", "guest"]).optional(),
  studioType: z.enum(["Music", "Podcast", "Photo", "Make up"]).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profileImage, setProfileImage] = useState<string>("");
  const [userType, setUserType] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FieldValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      userType: undefined,
      studioType: undefined,
    },
  });

  const watchedUserType = watch("userType");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();

        reset({
          name: data.name || "",
          userType: data.userType || undefined,
          studioType: data.studioType || undefined,
        });

        setProfileImage(data.image || "");
        setUserType(data.userType || "");
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to load profile");
        router.push("/");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [reset, router]);

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);

    try {
      const validatedData = profileSchema.parse(data);

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...validatedData,
          image: profileImage,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      router.push(`/profile/${responseData.id}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-600 mt-1">Update your personal information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Image */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>

          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {profileImage ? (
                <>
                  <Image
                    src={profileImage}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setProfileImage("")}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-500">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              {!profileImage && (
                <UploadButton<OurFileRouter, "propertyImage">
                  endpoint="propertyImage"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]) {
                      setProfileImage(res[0].url);
                      toast.success("Image uploaded!");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload failed: ${error.message}`);
                  }}
                  appearance={{
                    button:
                      "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition",
                    allowedContent: "text-sm text-gray-500",
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <Input
              id="name"
              label="Name *"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Type
              </label>
              <select
                {...register("userType")}
                disabled={isLoading}
                className="w-full p-4 border-2 border-neutral-300 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed focus:border-black"
              >
                <option value="">Select type</option>
                <option value="host">Host</option>
                <option value="guest">Guest</option>
              </select>
              {errors.userType && (
                <p className="mt-1 text-sm text-rose-500">
                  {errors.userType.message as string}
                </p>
              )}
            </div>

            {watchedUserType === "host" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Studio Type
                </label>
                <select
                  {...register("studioType")}
                  disabled={isLoading}
                  className="w-full p-4 border-2 border-neutral-300 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed focus:border-black"
                >
                  <option value="">Select studio type</option>
                  <option value="Music">Music</option>
                  <option value="Podcast">Podcast</option>
                  <option value="Photo">Photo</option>
                  <option value="Make up">Make up</option>
                </select>
                {errors.studioType && (
                  <p className="mt-1 text-sm text-rose-500">
                    {errors.studioType.message as string}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
