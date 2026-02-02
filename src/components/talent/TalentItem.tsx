import { User, Check } from "lucide-react";

export interface Talent {
    id: string;
    name: string;
    role: string;
    rate: number;
    avatar?: string;
}

interface TalentItemProps {
    talent: Talent;
    isSelected: boolean;
    onToggle: () => void;
}

export function TalentItem({ talent, isSelected, onToggle }: TalentItemProps) {
    return (
        <div
            onClick={onToggle}
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${isSelected
                    ? "bg-blue-600/10 border-blue-600/50"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                }`}
        >
            <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isSelected ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400"}`}>
                    {talent.avatar ? (
                        <img src={talent.avatar} alt={talent.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                        <User className="h-5 w-5" />
                    )}
                </div>
                <div>
                    <h4 className={`text-sm font-semibold ${isSelected ? "text-blue-400" : "text-white"}`}>{talent.name}</h4>
                    <p className="text-xs text-zinc-400">{talent.role} &bull; ${talent.rate}/hr</p>
                </div>
            </div>

            <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-colors ${isSelected
                    ? "bg-blue-600 border-blue-600"
                    : "border-zinc-700"
                }`}>
                {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
            </div>
        </div>
    )
}
