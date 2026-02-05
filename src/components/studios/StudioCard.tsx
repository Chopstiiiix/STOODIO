import { motion } from "framer-motion";
import { Star, MapPin, Users } from "lucide-react";

interface StudioProps {
    id: string;
    name: string;
    type: string;
    image: string;
    images?: string[];
    price: number;
    rating: number;
    location: string;
    capacity: number;
}

export function StudioCard({ studio, onBook, onViewGallery, compact = false }: { studio: StudioProps; onBook: () => void; onViewGallery?: () => void; compact?: boolean }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] transition-all duration-300 ${compact ? 'w-[280px] flex-shrink-0' : ''}`}
        >
            {/* Image */}
            <div
                className="aspect-[4/3] relative overflow-hidden cursor-pointer"
                onClick={onViewGallery}
            >
                <img
                    src={studio.image}
                    alt={studio.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                {studio.images && studio.images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md">
                        +{studio.images.length - 1} photos
                    </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                        {studio.type}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-medium">
                        <Star className="h-3 w-3 fill-yellow-400" />
                        {studio.rating}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{studio.name}</h3>
                <div className="flex items-center gap-4 text-xs text-zinc-400 mb-4">
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {studio.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {studio.capacity} People
                    </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                    <div className="text-zinc-100">
                        <span className="font-bold text-lg">${studio.price}</span>
                        <span className="text-xs text-zinc-500">/hr</span>
                    </div>
                    <button onClick={onBook} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Book Now &rarr;
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
