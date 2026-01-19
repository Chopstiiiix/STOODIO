"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { SafeProperty, SafeUser } from "@/types";
import { Heart, Star } from "lucide-react";
import Button from "../Button";

interface PropertyCardProps {
  data: SafeProperty;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  averageRating?: number;
  reviewCount?: number;
}

const PropertyCard = ({
  data,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
  averageRating,
  reviewCount,
}: PropertyCardProps) => {
  const router = useRouter();

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

  return (
    <div
      onClick={() => router.push(`/properties/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
            aspect-square
            w-full
            relative
            overflow-hidden
            rounded-xl
          "
        >
          <Image
            fill
            className="
              object-cover
              h-full
              w-full
              group-hover:scale-110
              transition
            "
            src={data.imageSrc}
            alt="Listing"
          />
          <div
            className="
            absolute
            top-3
            right-3
          "
          >
            <Heart size={28} className="fill-white/50 text-white" />
          </div>
        </div>
        <div className="font-semibold text-lg">{data.title || data.locationValue}</div>
        <div className="font-light text-neutral-500">{data.category}</div>
        {averageRating !== undefined && reviewCount !== undefined && reviewCount > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-neutral-500">({reviewCount})</span>
          </div>
        )}
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">₦{(data.price / 100).toLocaleString()}</div>
          <div className="font-light">/ hour</div>
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
