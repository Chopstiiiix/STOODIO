"use client";

import { useCallback, useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import { X, Upload } from "lucide-react";
import Image from "next/image";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface ImageUploadProps {
  value: { url: string; key: string }[];
  onChange: (value: { url: string; key: string }[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}

export default function ImageUpload({
  value = [],
  onChange,
  disabled,
  maxFiles = 10,
}: ImageUploadProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleRemove = useCallback(
    async (key: string) => {
      setIsDeleting(key);
      try {
        // Remove from local state
        onChange(value.filter((img) => img.key !== key));

        // TODO: Optionally call UploadThing delete endpoint
        // await fetch('/api/uploadthing/delete', {
        //   method: 'POST',
        //   body: JSON.stringify({ key }),
        // });
      } catch (error) {
        console.error("Error removing image:", error);
      } finally {
        setIsDeleting(null);
      }
    },
    [value, onChange]
  );

  const handleUpload = useCallback(
    (newFiles: { url: string; key: string }[]) => {
      onChange([...value, ...newFiles]);
    },
    [value, onChange]
  );

  const canUploadMore = value.length < maxFiles;

  return (
    <div className="space-y-4">
      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((image, index) => (
            <div
              key={image.key}
              className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group"
            >
              <Image
                src={image.url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() => handleRemove(image.key)}
                disabled={disabled || isDeleting === image.key}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Dropzone */}
      {canUploadMore && !disabled && (
        <UploadDropzone<OurFileRouter, "propertyImage">
          endpoint="propertyImage"
          onClientUploadComplete={(res) => {
            if (res) {
              const newFiles = res.map((file) => ({
                url: file.url,
                key: file.key,
              }));
              handleUpload(newFiles);
            }
          }}
          onUploadError={(error: Error) => {
            console.error("Upload error:", error);
            alert(`Upload failed: ${error.message}`);
          }}
          config={{
            mode: "auto",
          }}
          appearance={{
            container: "border-2 border-dashed border-gray-300 rounded-lg p-8",
            uploadIcon: "text-gray-400",
            label: "text-gray-600 text-sm",
            allowedContent: "text-gray-500 text-xs",
          }}
          content={{
            label: `Upload images (${value.length}/${maxFiles})`,
            allowedContent: "Images up to 4MB, max 10 files",
            button: "Choose files",
          }}
        />
      )}

      {!canUploadMore && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            Maximum number of images reached ({maxFiles})
          </p>
        </div>
      )}

      {value.length === 0 && (
        <p className="text-xs text-gray-500 text-center">
          The first image will be used as the cover photo
        </p>
      )}
    </div>
  );
}
