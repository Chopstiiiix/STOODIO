import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BackButtonProps {
  label?: string;
}

export function BackButton({ label = "Back" }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.95 }}
    >
      <ArrowLeft className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
}
