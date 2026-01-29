import { useState, useEffect } from "react";
import { Settings, CloudSun } from "lucide-react";
import { useProfile } from "../../contexts/ProfileContext";
import UrgencyTimer from "../UrgencyTimer";
import { differenceInWeeks, differenceInDays, differenceInYears, addYears, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "../../hooks/use-translation";

export default function PastelDashboard() {
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

    return (
        <div className="h-full bg-[#fdf2f8] text-[#831843] flex flex-col relative pb-safe-bottom font-sans overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#fbcfe8] var(--tw-gradient-stops) via-[#e0e7ff] to-[#fde68a] opacity-60 animate-gradient-xy" />

            {/* Header */}
            <header className="p-6 pt-safe-top flex justify-between items-center z-[101] pointer-events-none">
                <div className="flex items-center gap-2">
                    <CloudSun className="w-6 h-6 text-[#db2777]" />
                    <span className="font-semibold text-sm tracking-wide text-[#831843]">{activeProfile ? activeProfile.name : "Breath"}</span>
                </div>
                <button
                    onClick={() => navigate("/settings")}
                    className="p-3 rounded-2xl bg-white/50 hover:bg-white/80 transition-colors shadow-sm backdrop-blur-sm pointer-events-auto"
                >
                    <Settings className="w-5 h-5 text-[#831843]" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 z-10">

                {/* Soft Circular Progress */}
                <div className="relative mb-12">
                    <svg className="w-72 h-72 transform -rotate-90">
                        <circle cx="144" cy="144" r="130" stroke="white" strokeWidth="24" fill="transparent" className="opacity-50" />
                        <motion.circle
                            cx="144" cy="144" r="130"
                            stroke="url(#gradient)"
                            strokeWidth="24"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 130}
                            initial={{ strokeDashoffset: 2 * Math.PI * 130 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 130 * (1 - stats.percentage / 100) }}
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#f472b6" />
                                <stop offset="100%" stopColor="#c084fc" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-6xl font-black text-[#831843] tracking-tighter">
                            {Math.round(stats.percentage)}%
                        </span>
                        <span className="text-sm font-medium text-[#be185d]/70 uppercase tracking-widest mt-1">Present Moment</span>
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl w-full max-w-xs shadow-lg shadow-pink-500/5 text-center">
                    <p className="text-xs uppercase tracking-widest text-[#be185d]/60 mb-2">Time Flows</p>
                    {/* Minimal Timer - We need to handle the colors here or accept that it's white/styled */}
                    {/* For Pastel, let's just show text manually or use UrgencyTimer with a wrapper class? */}
                    {/* UrgencyTimer is hardcoded to white/red. Let's wrap it in a filter or rewrite for theme compatibility. 
                        For now, hue-rotate might do the trick or mix-blend-mode. */}
                    <div className="filter invert contrast-150 grayscale mix-blend-multiply opacity-70">
                        <UrgencyTimer dob={dob} lifespan={lifespan} minimal={true} />
                    </div>
                </div>

            </main>
        </div>
    );
}
