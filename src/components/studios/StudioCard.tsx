import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react";

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
    const images = studio.images && studio.images.length > 0 ? studio.images : [studio.image];
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleDotClick = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setCurrentIndex(index);
    };

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
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={studio.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="object-cover w-full h-full absolute inset-0"
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-none" />

                {/* Navigation Arrows - show on hover when multiple images */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </>
                )}

                {/* Photo Indicator Dots */}
                {images.length > 1 && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => handleDotClick(e, index)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    index === currentIndex
                                        ? 'bg-white w-3'
                                        : 'bg-white/50 hover:bg-white/75'
                                }`}
                            />
                        ))}
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
