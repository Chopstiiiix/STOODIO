"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyImageGalleryProps {
  images: { url: string; key: string }[];
  fallbackImage?: string;
  title: string;
}

export default function PropertyImageGallery({
  images,
  fallbackImage,
  title,
}: PropertyImageGalleryProps) {
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages =
    images.length > 0
      ? images
      : fallbackImage
      ? [{ url: fallbackImage, key: "fallback" }]
      : [];

  if (displayImages.length === 0) {
    return (
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[60vh] cursor-pointer">
        {/* Main/First Image */}
        <div
          className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-xl"
          onClick={() => {
            setCurrentIndex(0);
            setShowLightbox(true);
          }}
        >
          <Image
            src={displayImages[0].url}
            fill
            className="object-cover hover:scale-105 transition"
            alt={`${title} - Main`}
            priority
          />
        </div>

        {/* Additional Images (up to 4 more) */}
        {displayImages.slice(1, 5).map((image, index) => (
          <div
            key={image.key}
            className="relative overflow-hidden rounded-xl"
            onClick={() => {
              setCurrentIndex(index + 1);
              setShowLightbox(true);
            }}
          >
            <Image
              src={image.url}
              fill
              className="object-cover hover:scale-105 transition"
              alt={`${title} - ${index + 2}`}
            />
            {/* Show count if more images */}
            {index === 3 && displayImages.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  +{displayImages.length - 5} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition z-50"
          >
            <X size={24} />
          </button>

          {/* Navigation Buttons */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition z-50"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition z-50"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Current Image */}
          <div className="relative w-full h-full max-w-7xl max-h-screen p-12">
            <Image
              src={displayImages[currentIndex].url}
              fill
              className="object-contain"
              alt={`${title} - ${currentIndex + 1}`}
              priority
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
            {currentIndex + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </>
  );
}
