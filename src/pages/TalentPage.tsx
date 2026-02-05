import { useState } from "react";
import { Layout } from "../components/layout/Layout";
import { TalentCard } from "../components/talent/TalentCard";
import { BackButton } from "../components/ui/BackButton";
import BlurFade from "../components/ui/blur-fade";
import { Modal } from "../components/ui/modal";
import { HireModal } from "../components/booking/HireModal";
import { TALENT_POOL } from "../data";

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
        <div className="mb-8">
          <BackButton />
        </div>
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
