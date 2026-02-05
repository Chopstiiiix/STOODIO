import { motion } from "framer-motion";
import { X, Star, Music, Film, Briefcase, Calendar } from "lucide-react";
import type { Talent, PortfolioItem } from "./TalentItem";

interface TalentProfileModalProps {
  talent: Talent;
  onClose: () => void;
  onHire: () => void;
}

function getPortfolioIcon(type: string) {
  switch (type.toLowerCase()) {
    case "song":
    case "album":
      return <Music className="w-4 h-4" />;
    case "film":
    case "video":
      return <Film className="w-4 h-4" />;
    default:
      return <Briefcase className="w-4 h-4" />;
  }
}

export function TalentProfileModal({ talent, onClose, onHire }: TalentProfileModalProps) {
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
        className="relative w-full max-w-2xl bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Profile Image */}
          <div className="md:w-2/5 relative">
            <div className="aspect-square md:h-full">
              <img
                src={talent.avatar}
                alt={talent.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent md:bg-gradient-to-r" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="md:w-3/5 p-6 flex flex-col">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                  {talent.role}
                </span>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400" />
                  5.0
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">{talent.name}</h2>
              <p className="text-zinc-400 text-sm mt-1">
                ${talent.rate}/hr
              </p>
            </div>

            {talent.bio && (
              <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
                {talent.bio}
              </p>
            )}

            {/* Portfolio */}
            {talent.portfolio && talent.portfolio.length > 0 && (
              <div className="flex-1 mb-6">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Featured Work
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {talent.portfolio.map((item: PortfolioItem, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center text-blue-400">
                        {getPortfolioIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">
                          {item.title}
                        </p>
                        <p className="text-zinc-400 text-xs">
                          {item.artist && `${item.artist} • `}
                          {item.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-500 text-xs">
                        <Calendar className="w-3 h-3" />
                        {item.year}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hire Button */}
            <button
              onClick={onHire}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Hire {talent.name.split(' ')[0]}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
