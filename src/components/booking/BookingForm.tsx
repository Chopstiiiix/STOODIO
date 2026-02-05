import { useState } from "react";
import { Calendar } from "lucide-react";
import { TalentItem, type Talent } from "../talent/TalentItem";
import { useNotifications } from "../../context/NotificationContext";

interface BookingFormProps {
    onClose: () => void;
    studioName?: string;
    availableTalent?: Talent[];
}

export function BookingForm({ onClose, studioName, availableTalent = [] }: BookingFormProps) {
    const [date, setDate] = useState("");
    const [selectedTalent, setSelectedTalent] = useState<string[]>([]);
    const { addNotification } = useNotifications();

    const toggleTalent = (id: string) => {
        setSelectedTalent(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simulate booking (90% success rate for demo)
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
            const talentNames = availableTalent
                .filter(t => selectedTalent.includes(t.id))
                .map(t => t.name)
                .join(", ");

            addNotification({
                type: "success",
                title: "Booking Confirmed!",
                message: `${studioName} booked for ${new Date(date).toLocaleDateString()}${talentNames ? `. Talent: ${talentNames}` : ""}`
            });
        } else {
            addNotification({
                type: "error",
                title: "Booking Failed",
                message: `Unable to book ${studioName}. Please try again later.`
            });
        }

        onClose();
    };

    return (
        <div className="p-8 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-1">Book {studioName || "Studio"}</h3>
            <p className="text-zinc-400 text-sm mb-6">Select your date and add professionals.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                        />
                    </div>
                </div>

                {availableTalent.length > 0 && (
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-zinc-300">Hire Professionals</label>
                        <div className="grid grid-cols-1 gap-2">
                            {availableTalent.map(talent => (
                                <TalentItem
                                    key={talent.id}
                                    talent={talent}
                                    isSelected={selectedTalent.includes(talent.id)}
                                    onToggle={() => toggleTalent(talent.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors mt-4">
                    Confirm Booking
                </button>
            </form>
        </div>
    )
}
