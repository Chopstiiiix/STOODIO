"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/inputs/Input";
import toast from "react-hot-toast";

const listingSchema = z.object({
  type: z.enum(["STUDIO", "SERVICE"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  city: z.string().optional(),
  country: z.string().optional(),
  basePrice: z.coerce.number().int().positive("Price must be positive"),
  currency: z.string().default("NGN"),
  policy: z.enum(["FLEXIBLE", "MODERATE", "STRICT"]),
  instantBook: z.boolean().default(false),
  published: z.boolean().default(false),
});

type ListingFormData = z.infer<typeof listingSchema>;

export default function NewListingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(listingSchema) as any,
    defaultValues: {
      type: "STUDIO",
      title: "",
      description: "",
      category: "",
      city: "",
      country: "",
      basePrice: 0,
      currency: "NGN",
      policy: "FLEXIBLE",
      instantBook: false,
      published: false,
    },
  });

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);

    try {
      const validatedData = listingSchema.parse(data);

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to create listing");
      }

      toast.success("Listing created successfully!");
      router.push(`/dashboard/host/listings/${responseData.id}/edit`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create listing");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
        <p className="text-gray-600 mt-1">
          Add a new studio or service to your listings
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listing Type *
              </label>
              <select
                {...register("type")}
                disabled={isLoading}
                className="w-full p-4 border-2 border-neutral-300 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed focus:border-black"
              >
                <option value="STUDIO">Studio</option>
                <option value="SERVICE">Service</option>
              </select>
            </div>

            <Input
              id="title"
              label="Title *"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                {...register("description")}
                disabled={isLoading}
                rows={4}
                className={`w-full p-4 border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${
                  errors.description
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-neutral-300 focus:border-black"
                }`}
                placeholder="Describe your listing..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-rose-500">
                  {errors.description.message as string}
                </p>
              )}
            </div>

            <Input
              id="category"
              label="Category *"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Location</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="city"
              label="City"
              disabled={isLoading}
              register={register}
              errors={errors}
            />

            <Input
              id="country"
              label="Country"
              disabled={isLoading}
              register={register}
              errors={errors}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                id="basePrice"
                label="Price per hour (in minor units, e.g., 500000 = 5000 NGN) *"
                type="number"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter amount in kobo (1 NGN = 100 kobo)
              </p>
            </div>

            <Input
              id="currency"
              label="Currency"
              disabled={isLoading}
              register={register}
              errors={errors}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Policy *
              </label>
              <select
                {...register("policy")}
                disabled={isLoading}
                className="w-full p-4 border-2 border-neutral-300 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed focus:border-black"
              >
                <option value="FLEXIBLE">Flexible</option>
                <option value="MODERATE">Moderate</option>
                <option value="STRICT">Strict</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="instantBook"
                {...register("instantBook")}
                disabled={isLoading}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="instantBook" className="text-sm font-medium text-gray-700">
                Enable Instant Book
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                {...register("published")}
                disabled={isLoading}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">
                Publish immediately (make visible to guests)
              </label>
            </div>
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
            {isLoading ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
