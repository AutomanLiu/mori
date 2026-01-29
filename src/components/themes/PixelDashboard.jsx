
import { useState, useEffect } from "react";
import { useProfile } from "../../contexts/ProfileContext";
import { Settings, Gamepad2, Trophy } from "lucide-react";
import UrgencyTimer from "../UrgencyTimer";
import { addYears, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/use-translation";

export default function PixelDashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { activeProfile } = useProfile();
    const dob = activeProfile?.dob || "2000-01-01";
    const lifespan = activeProfile?.lifespan || 80;
    const [stats, setStats] = useState({ percentage: 100 });

    useEffect(() => {
        if (!dob || !lifespan) return;
        const birthDate = parseISO(dob);
        const deathDate = addYears(birthDate, lifespan);
        const now = new Date();
        const totalDuration = deathDate.getTime() - birthDate.getTime();
        const elapsedDuration = now.getTime() - birthDate.getTime();
        setStats({ percentage: 100 - (elapsedDuration / totalDuration) * 100 });
    }, [dob, lifespan]);

    // Pixelated font needed, but we simulate with sans-serif + tracking for MVP or use a Google Font later
    // Visual style: Green/Black monochrome or Gameboy palette
    return (
        <div className="h-full bg-[#9bbc0f] text-[#0f380f] flex flex-col relative pb-safe-bottom font-mono">
            {/* Header */}
            <header className="p-6 pt-safe-top flex justify-between items-center z-[101] pointer-events-none">
                <div className="flex items-center gap-2">
                    <Gamepad2 className="w-6 h-6 text-[#8bac0f]" />
                    <span className="font-bold text-xl tracking-tighter text-[#0f380f] uppercase">{activeProfile ? activeProfile.name : "PLAYER 1"}</span>
                </div>
                <button
                    onClick={() => navigate("/settings")}
                    className="p-2 hover:bg-[#8bac0f] border-2 border-transparent hover:border-[#0f380f] transition-all pointer-events-auto"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6">

                {/* 8-bit Battery container */}
                <div className="w-64 h-32 border-4 border-[#0f380f] p-2 relative mb-12 bg-[#8bac0f] shadow-[8px_8px_0px_0px_rgba(15,56,15,1)]">
                    {/* Battery Nipple */}
                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-12 border-4 border-[#0f380f] bg-[#8bac0f]" />

                    {/* Progress Bars (discrete blocks) */}
                    <div className="w-full h-full flex gap-1">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className={`flex - 1 ${stats.percentage > (i * 10) ? "bg-[#0f380f]" : "opacity-10 border border-[#0f380f]"} `}
                            />
                        ))}
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-6xl font-black tracking-tight">{Math.floor(stats.percentage)}</span>
                        <span className="text-3xl font-bold tracking-normal">.{Math.floor((stats.percentage % 1) * 10)}</span>
                        <span className="text-2xl font-bold ml-6">%</span>
                    </div>
                    <div className="bg-[#0f380f] text-[#9bbc0f] px-4 py-2 inline-block font-bold uppercase text-sm">
                        High Score: {lifespan} Years
                    </div>
                </div>

                {/* Pixelated Urgency Timer Placeholder */}
                <div className="mt-12 w-full max-w-xs border-2 border-[#0f380f] p-4 bg-[#8bac0f] text-center">
                    <p className="text-xs uppercase mb-2 border-b-2 border-[#0f380f] inline-block pb-1">Time Remaining</p>
                    <UrgencyTimer dob={dob} lifespan={lifespan} minimal={true} />
                    {/* Note: UrgencyTimer uses white text, might need override CSS or a wrapper to force color */}
                </div>

            </main>

            {/* Scanlines / Grid overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(15,56,15,1)_1px,transparent_1px)] bg-[size:100%_4px]" />
        </div>
    );
}
