"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { SafeProperty, SafeUser } from "@/types";
import { Heart } from "lucide-react";
import Button from "../Button";

interface PropertyCardProps {
  data: SafeProperty;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}

const PropertyCard = ({
  data,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
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
        <div className="font-semibold text-lg">{data.locationValue}</div>
        <div className="font-light text-neutral-500">{data.category}</div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">${data.price}</div>
          <div className="font-light">night</div>
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
