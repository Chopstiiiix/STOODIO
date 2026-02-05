import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "../components/layout/Layout";
import { StudioCard } from "../components/studios/StudioCard";
import { GalleryModal } from "../components/studios/GalleryModal";
import { BackButton } from "../components/ui/BackButton";
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
    availableTalent: []
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
    availableTalent: []
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
    availableTalent: []
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
    availableTalent: []
  }
];

export function StudiosPage() {
  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get("type");

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStudioId, setGalleryStudioId] = useState<string | null>(null);

  // Filter studios by type if filter is set
  const filteredStudios = typeFilter
    ? STUDIOS.filter(s => s.type === typeFilter)
    : STUDIOS;

  const handleBook = (id: string) => {
    setSelectedStudioId(id);
    setIsBookingOpen(true);
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
  const galleryStudio = STUDIOS.find(s => s.id === galleryStudioId);

  // Get page title based on filter
  const pageTitle = typeFilter ? `${typeFilter} Studios` : "Browse Studios";
  const pageSubtitle = typeFilter
    ? `Explore our ${typeFilter.toLowerCase()} studio spaces`
    : "Find the perfect space for your creative project";

  return (
    <Layout>
      <section className="container mx-auto px-4 py-20">
        <div className="mb-8">
          <BackButton />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{pageTitle}</h1>
          <p className="text-xl text-zinc-400">{pageSubtitle}</p>
        </div>

        {filteredStudios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredStudios.map((studio, idx) => (
              <BlurFade key={studio.id} delay={0.1 * idx} inView>
                <StudioCard
                  studio={studio}
                  onBook={() => handleBook(studio.id)}
                  onViewGallery={() => handleViewGallery(studio.id)}
                />
              </BlurFade>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg">No {typeFilter?.toLowerCase()} studios available at the moment.</p>
          </div>
        )}
      </section>

      <Modal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)}>
        <BookingFormContent
          onClose={() => setIsBookingOpen(false)}
          studioName={selectedStudio?.name}
          availableTalent={selectedStudio?.availableTalent || []}
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
