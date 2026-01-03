import {
  Music,
  Mic,
  Camera,
  Sparkles,
  LucideIcon
} from "lucide-react";

export interface Category {
  label: string;
  icon: LucideIcon;
  description: string;
}

export const categories: Category[] = [
  {
    label: "Music",
    icon: Music,
    description: "Music studios and recording spaces!",
  },
  {
    label: "Podcast",
    icon: Mic,
    description: "Podcast studios and audio production spaces!",
  },
  {
    label: "Photo",
    icon: Camera,
    description: "Photo studios and photography spaces!",
  },
  {
    label: "Make up",
    icon: Sparkles,
    description: "Professional makeup and beauty studios!",
  },
];
