import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "./components/layout/Layout";
import { Hero } from "./components/home/Hero";
import { StudioCard } from "./components/studios/StudioCard";
import { GalleryModal } from "./components/studios/GalleryModal";
import { MediaScroller } from "./components/ui/MediaScroller";
import BlurFade from "./components/ui/blur-fade";
import { Modal } from "./components/ui/modal";
import { BookingForm as BookingFormContent } from "./components/booking/BookingForm";
import { HireModal } from "./components/booking/HireModal";
import { TalentCard } from "./components/talent/TalentCard";
import type { Talent } from "./components/talent/TalentItem";
import { StudiosPage } from "./pages/StudiosPage";
import { TalentPage } from "./pages/TalentPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";

// Talent Images
import sarahImg from "./assets/talent/sarah_jenkins.jpg";
import mikeImg from "./assets/talent/mike_ross.jpg";
import jessicaImg from "./assets/talent/jessica_pearson.jpg";
import harveyImg from "./assets/talent/harvey_specter.jpg";

// Mock Talent Data
const TALENT_POOL: Talent[] = [
  { id: "t1", name: "Sarah Jenkins", role: "Sound Engineer", rate: 50, avatar: sarahImg },
  { id: "t2", name: "Mike Ross", role: "Videographer", rate: 75, avatar: mikeImg },
  { id: "t3", name: "Jessica Pearson", role: "Creative Director", rate: 120, avatar: jessicaImg },
  { id: "t4", name: "Harvey Specter", role: "Producer", rate: 100, avatar: harveyImg },
  { id: "t5", name: "Rachel Zane", role: "Photographer", rate: 85, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: "t6", name: "Louis Litt", role: "Audio Mixer", rate: 65, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: "t7", name: "Donna Paulsen", role: "Makeup Artist", rate: 90, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=300" },
  { id: "t8", name: "Alex Williams", role: "Video Editor", rate: 70, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300" },
];

// Mock Data
const STUDIOS = [
  {
    id: "1",
    name: "Neon Horizon Sound",
    type: "Music",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000&auto=format&fit=crop"
    ],
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
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1000&auto=format&fit=crop"
    ],
    price: 85,
    rating: 5.0,
    location: "Arts District",
    capacity: 12,
    availableTalent: [TALENT_POOL[1], TALENT_POOL[2]]
  },
  {
    id: "3",
    name: "The Safe House Podcast",
    type: "Podcast",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=1000&auto=format&fit=crop"
    ],
    price: 95,
    rating: 4.8,
    location: "Westside",
    capacity: 4,
    availableTalent: [TALENT_POOL[0], TALENT_POOL[3]]
  },
  {
    id: "4",
    name: "Glow Up Vanity",
    type: "Make Up",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop"
    ],
    price: 55,
    rating: 4.9,
    location: "North Hills",
    capacity: 2,
    availableTalent: [
      { id: "t5", name: "Elena Gilbert", role: "MUA", rate: 80, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150&h=150" }
    ]
  },
  {
    id: "5",
    name: "Skyline Recording Studio",
    type: "Music",
    image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=1000&auto=format&fit=crop"
    ],
    price: 90,
    rating: 4.7,
    location: "Midtown",
    capacity: 8,
    availableTalent: [TALENT_POOL[0], TALENT_POOL[3]]
  },
  {
    id: "6",
    name: "Urban Lens Studio",
    type: "Photo",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop"
    ],
    price: 70,
    rating: 4.8,
    location: "East Village",
    capacity: 6,
    availableTalent: [TALENT_POOL[1]]
  },
  {
    id: "7",
    name: "The Voice Box",
    type: "Podcast",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop"
    ],
    price: 60,
    rating: 4.6,
    location: "Soho",
    capacity: 3,
    availableTalent: [TALENT_POOL[0]]
  },
  {
    id: "8",
    name: "Glamour Suite",
    type: "Make Up",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1000&auto=format&fit=crop"
    ],
    price: 45,
    rating: 4.9,
    location: "Chelsea",
    capacity: 3,
    availableTalent: []
  }
];

function HomePage() {
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStudioId, setGalleryStudioId] = useState<string | null>(null);

  const handleBook = (id: string) => {
    setSelectedStudioId(id);
    setIsBookingOpen(true);
  };

  const handleHire = (id: string) => {
    setSelectedTalentId(id);
    setIsHireModalOpen(true);
  };

  const handleViewGallery = (id: string) => {
    setGalleryStudioId(id);
    setIsGalleryOpen(true);
  };

  const handleBookFromGallery = () => {
    if (galleryStudioId) {
      setIsGalleryOpen(false);
      setSelectedStudioId(galleryStudioId);
      setIsBookingOpen(true);
    }
  };

  const selectedStudio = STUDIOS.find(s => s.id === selectedStudioId);
  const selectedTalent = TALENT_POOL.find(t => t.id === selectedTalentId);
  const galleryStudio = STUDIOS.find(s => s.id === galleryStudioId);

  return (
    <Layout>
      <Hero />

      <section className="container mx-auto px-4 py-20" id="studios">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-2xl font-bold">Featured Spaces</h3>
          <button 
            onClick={() => navigate('/studios')}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            View All
          </button>
        </div>

        <MediaScroller>
          {STUDIOS.map((studio, idx) => (
            <BlurFade key={studio.id} delay={0.05 * idx} inView>
              <StudioCard
                studio={studio}
                onBook={() => handleBook(studio.id)}
                onViewGallery={() => handleViewGallery(studio.id)}
                compact
              />
            </BlurFade>
          ))}
        </MediaScroller>
      </section>

      <section className="container mx-auto px-4 py-20 border-t border-zinc-900" id="talent">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-2xl font-bold">Creative Talent</h3>
          <button 
            onClick={() => navigate('/talent')}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            View All
          </button>
        </div>

        <MediaScroller>
          {TALENT_POOL.map((talent, idx) => (
            <BlurFade key={talent.id} delay={0.05 * idx} inView>
              <TalentCard
                talent={talent}
                onHire={() => handleHire(talent.id)}
                compact
              />
            </BlurFade>
          ))}
        </MediaScroller>
      </section>

      <Modal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)}>
        <BookingFormContent
          onClose={() => setIsBookingOpen(false)}
          studioName={selectedStudio?.name}
          availableTalent={selectedStudio?.availableTalent || []}
        />
      </Modal>

      <Modal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)}>
        <HireModal
          onClose={() => setIsHireModalOpen(false)}
          talent={selectedTalent}
        />
      </Modal>

      <AnimatePresence>
        {isGalleryOpen && galleryStudio && (
          <GalleryModal
            studio={galleryStudio}
            onClose={() => setIsGalleryOpen(false)}
            onBook={handleBookFromGallery}
          />
        )}
      </AnimatePresence>
    </Layout>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/studios" element={<StudiosPage />} />
      <Route path="/talent" element={<TalentPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
    </Routes>
  )
}

export default App;
