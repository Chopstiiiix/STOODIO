import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "./components/layout/Layout";
import { Hero } from "./components/home/Hero";
import { StudioCard } from "./components/studios/StudioCard";
import { GalleryModal } from "./components/studios/GalleryModal";
import { MediaScroller } from "./components/ui/MediaScroller";
import { NotificationList } from "./components/ui/NotificationList";
import BlurFade from "./components/ui/blur-fade";
import { Modal } from "./components/ui/modal";
import { BookingForm as BookingFormContent } from "./components/booking/BookingForm";
import { HireModal } from "./components/booking/HireModal";
import { TalentCard } from "./components/talent/TalentCard";
import { TalentProfileModal } from "./components/talent/TalentProfileModal";
import { StudiosPage } from "./pages/StudiosPage";
import { TalentPage } from "./pages/TalentPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { STUDIOS, TALENT_POOL } from "./data";

function HomePage() {
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStudioId, setGalleryStudioId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTalentId, setProfileTalentId] = useState<string | null>(null);

  const handleBook = (id: string) => {
    setSelectedStudioId(id);
    setIsBookingOpen(true);
  };

  const handleHire = (id: string) => {
    setSelectedTalentId(id);
    setIsHireModalOpen(true);
  };

  const handleViewProfile = (id: string) => {
    setProfileTalentId(id);
    setIsProfileOpen(true);
  };

  const handleHireFromProfile = () => {
    if (profileTalentId) {
      setIsProfileOpen(false);
      setSelectedTalentId(profileTalentId);
      setIsHireModalOpen(true);
    }
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
  const profileTalent = TALENT_POOL.find(t => t.id === profileTalentId);

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
                onViewProfile={() => handleViewProfile(talent.id)}
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

      <AnimatePresence>
        {isProfileOpen && profileTalent && (
          <TalentProfileModal
            talent={profileTalent}
            onClose={() => setIsProfileOpen(false)}
            onHire={handleHireFromProfile}
          />
        )}
      </AnimatePresence>
    </Layout>
  )
}

function App() {
  return (
    <>
      <NotificationList />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/studios" element={<StudiosPage />} />
        <Route path="/talent" element={<TalentPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
      </Routes>
    </>
  )
}

export default App;
