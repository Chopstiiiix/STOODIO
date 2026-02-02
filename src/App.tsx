import { useState } from "react";
import { Layout } from "./components/layout/Layout";
import { Hero } from "./components/home/Hero";
import { StudioCard } from "./components/studios/StudioCard";
import BlurFade from "./components/ui/blur-fade";
import { Modal } from "./components/ui/modal";
import { BookingForm as BookingFormContent } from "./components/booking/BookingForm";
import type { Talent } from "./components/talent/TalentItem";

// Mock Talent Data
const TALENT_POOL: Talent[] = [
  { id: "t1", name: "Sarah Jenkins", role: "Sound Engineer", rate: 50, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150" },
  { id: "t2", name: "Mike Ross", role: "Videographer", rate: 75, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150" },
  { id: "t3", name: "Jessica Pearson", role: "Creative Director", rate: 120, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150" },
  { id: "t4", name: "Harvey Specter", role: "Producer", rate: 100, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150" },
];

// Mock Data
const STUDIOS = [
  {
    id: "1",
    name: "Neon Horizon Sound",
    type: "Music",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop",
    price: 65,
    rating: 4.9,
    location: "Downtown",
    capacity: 5,
    availableTalent: [TALENT_POOL[0], TALENT_POOL[3]]
  },
  {
    id: "2",
    name: "Lumina Daylight Loft",
    type: "Photo",
    image: "https://images.unsplash.com/photo-1596230489240-de2442cd3b2a?q=80&w=1000&auto=format&fit=crop",
    price: 85,
    rating: 5.0,
    location: "Arts District",
    capacity: 12,
    availableTalent: [TALENT_POOL[1], TALENT_POOL[2]]
  },
  {
    id: "3",
    name: "Chroma Key Giant",
    type: "Video",
    image: "https://images.unsplash.com/photo-1534190239940-9ba8944ea261?q=80&w=1000&auto=format&fit=crop",
    price: 120,
    rating: 4.8,
    location: "Westside",
    capacity: 20
  },
  {
    id: "4",
    name: "Edit Suite Alpha",
    type: "Editing",
    image: "https://images.unsplash.com/photo-1574717024453-354056aef981?q=80&w=1000&auto=format&fit=crop",
    price: 45,
    rating: 4.7,
    location: "North Hills",
    capacity: 3
  }
];

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);

  const handleBook = (id: string) => {
    setSelectedStudioId(id);
    setIsBookingOpen(true);
  };

  const selectedStudio = STUDIOS.find(s => s.id === selectedStudioId);

  return (
    <Layout>
      <Hero />

      <section className="container mx-auto px-4 py-20" id="studios">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-2xl font-bold">Featured Spaces</h3>
          <button className="text-sm text-zinc-400 hover:text-white transition-colors">View All</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STUDIOS.map((studio, idx) => (
            <BlurFade key={studio.id} delay={0.1 * idx} inView>
              <StudioCard
                studio={studio}
                onBook={() => handleBook(studio.id)}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      <Modal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)}>
        <BookingFormContent
          onClose={() => setIsBookingOpen(false)}
          studioName={selectedStudio?.name}
          availableTalent={selectedStudio?.availableTalent || []}
        />
      </Modal>
    </Layout>
  )
}

export default App;
