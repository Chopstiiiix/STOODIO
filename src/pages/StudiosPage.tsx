import { useState } from "react";
import { Layout } from "../components/layout/Layout";
import { StudioCard } from "../components/studios/StudioCard";
import BlurFade from "../components/ui/blur-fade";
import { Modal } from "../components/ui/modal";
import { BookingForm as BookingFormContent } from "../components/booking/BookingForm";

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
    availableTalent: []
  },
  {
    id: "2",
    name: "Lumina Daylight Loft",
    type: "Photo",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop",
    price: 85,
    rating: 5.0,
    location: "Arts District",
    capacity: 12,
    availableTalent: []
  },
  {
    id: "3",
    name: "The Safe House Podcast",
    type: "Podcast",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop",
    price: 95,
    rating: 4.8,
    location: "Westside",
    capacity: 4,
    availableTalent: []
  },
  {
    id: "4",
    name: "Glow Up Vanity",
    type: "Make Up",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1000&auto=format&fit=crop",
    price: 55,
    rating: 4.9,
    location: "North Hills",
    capacity: 2,
    availableTalent: []
  }
];

export function StudiosPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);

  const handleBook = (id: string) => {
    setSelectedStudioId(id);
    setIsBookingOpen(true);
  };

  const selectedStudio = STUDIOS.find(s => s.id === selectedStudioId);

  return (
    <Layout>
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Browse Studios</h1>
          <p className="text-xl text-zinc-400">Find the perfect space for your creative project</p>
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