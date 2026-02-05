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
import { STUDIOS } from "../data";

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
