import { motion } from "framer-motion";
import { User, Star } from "lucide-react";
import type { Talent } from "./TalentItem";

interface TalentCardProps {
    talent: Talent;
    onHire: () => void;
    compact?: boolean;
}

export function TalentCard({ talent, onHire, compact = false }: TalentCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] transition-all duration-300 flex flex-col ${compact ? 'w-[260px] flex-shrink-0' : ''}`}
        >
            <div className="aspect-square relative overflow-hidden bg-zinc-800">
                {talent.avatar ? (
                    <img
                        src={talent.avatar}
                        alt={talent.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <User className="h-20 w-20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{talent.name}</h3>
                    <p className="text-blue-400 font-medium text-sm">{talent.role}</p>
                </div>
            </div>

            <div className="p-4 flex flex-col gap-4 flex-1">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-yellow-500" />
                        <span className="font-semibold">5.0</span>
                    </div>
                    <div className="text-zinc-300">
                        <span className="font-bold text-white text-lg">${talent.rate}</span>/hr
                    </div>
                </div>

                <button
                    onClick={onHire}
                    className="mt-auto w-full bg-zinc-800 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-all duration-300 group-hover:bg-blue-600"
                >
                    Hire Now
                </button>
            </div>
        </motion.div>
    )
}
