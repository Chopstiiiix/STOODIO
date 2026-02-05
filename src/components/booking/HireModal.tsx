import { useState } from "react";
import { Calendar, Briefcase } from "lucide-react";
import type { Talent } from "../talent/TalentItem";

interface HireModalProps {
    onClose: () => void;
    talent?: Talent;
}

export function HireModal({ onClose, talent }: HireModalProps) {
    const [date, setDate] = useState("");
    const [projectType, setProjectType] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!talent) return;
        alert(`Request sent to ${talent.name} for ${projectType} on ${date}!`);
        onClose();
    };

    if (!talent) return null;

    return (
        <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
                    {talent.avatar && <img src={talent.avatar} alt={talent.name} className="w-full h-full object-cover" />}
                </div>
                <div>
                    <h3 className="text-2xl font-bold">Hire {talent.name}</h3>
                    <p className="text-blue-400 text-sm">{talent.role} &bull; ${talent.rate}/hr</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Project Date</label>
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

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Project Type</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="e.g. Music Video Shoot"
                            required
                            value={projectType}
                            onChange={(e) => setProjectType(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                        />
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors mt-4">
                    Send Request
                </button>
            </form>
        </div>
    )
}
