import { useState } from "react";
import { Layout } from "../components/layout/Layout";
import { TalentCard } from "../components/talent/TalentCard";
import BlurFade from "../components/ui/blur-fade";
import { Modal } from "../components/ui/modal";
import { HireModal } from "../components/booking/HireModal";
import type { Talent } from "../components/talent/TalentItem";

// Talent Images
import sarahImg from "../assets/talent/sarah_jenkins.jpg";
import mikeImg from "../assets/talent/mike_ross.jpg";
import jessicaImg from "../assets/talent/jessica_pearson.jpg";
import harveyImg from "../assets/talent/harvey_specter.jpg";

// Mock Talent Data
const TALENT_POOL: Talent[] = [
  { id: "t1", name: "Sarah Jenkins", role: "Sound Engineer", rate: 50, avatar: sarahImg },
  { id: "t2", name: "Mike Ross", role: "Videographer", rate: 75, avatar: mikeImg },
  { id: "t3", name: "Jessica Pearson", role: "Creative Director", rate: 120, avatar: jessicaImg },
  { id: "t4", name: "Harvey Specter", role: "Producer", rate: 100, avatar: harveyImg },
];

export function TalentPage() {
  const [selectedTalentId, setSelectedTalentId] = useState<string | null>(null);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  const handleHire = (id: string) => {
    setSelectedTalentId(id);
    setIsHireModalOpen(true);
  };

  const selectedTalent = TALENT_POOL.find(t => t.id === selectedTalentId);

  return (
    <Layout>
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Browse Talent</h1>
          <p className="text-xl text-zinc-400">Connect with creative professionals for your project</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TALENT_POOL.map((talent, idx) => (
            <BlurFade key={talent.id} delay={0.1 * idx} inView>
              <TalentCard
                talent={talent}
                onHire={() => handleHire(talent.id)}
              />
            </BlurFade>
          ))}
        </div>
      </section>

      <Modal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)}>
        <HireModal
          onClose={() => setIsHireModalOpen(false)}
          talent={selectedTalent}
        />
      </Modal>
    </Layout>
  )
}