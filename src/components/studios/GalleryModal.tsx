import { MotionCarousel } from "../ui/motion-carousel";
import { X, MapPin, Star, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { EmblaOptionsType } from 'embla-carousel';

interface Studio {
  id: string;
  name: string;
  type: string;
  images: string[];
  price: number;
  rating: number;
  location: string;
  capacity: number;
}

interface GalleryModalProps {
  studio: Studio;
  onClose: () => void;
  onBook: () => void;
}

const OPTIONS: EmblaOptionsType = { loop: true };

export function GalleryModal({ studio, onClose, onBook }: GalleryModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-3xl bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Carousel */}
        <div className="p-6 pb-0">
          <MotionCarousel slides={studio.images} options={OPTIONS} />
        </div>

        {/* Studio Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="inline-block bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md mb-2">
                {studio.type}
              </span>
              <h2 className="text-2xl font-bold text-white">{studio.name}</h2>
            </div>
            <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
              <Star className="h-4 w-4 fill-yellow-400" />
              {studio.rating}
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-zinc-400 mb-6">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {studio.location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> Up to {studio.capacity} people
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <div className="text-zinc-100">
              <span className="font-bold text-2xl">${studio.price}</span>
              <span className="text-sm text-zinc-500">/hr</span>
            </div>
            <button
              onClick={onBook}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
