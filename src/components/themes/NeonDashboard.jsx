
import { useState, useEffect } from "react";
import { Settings, Zap, BatteryCharging } from "lucide-react";
import { useProfile } from "../../contexts/ProfileContext";
import UrgencyTimer from "../UrgencyTimer";
import { addYears, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "../../hooks/use-translation";

export default function NeonDashboard() {
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
        <div className="h-full bg-[#050510] text-[#00f3ff] flex flex-col relative pb-safe-bottom font-sans overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    perspective: '500px'
                }}
            />
            {/* Glows */}
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d946ef]/20 rounded-full blur-[100px]" />

            {/* Header */}
            <header className="p-6 pt-safe-top flex justify-between items-center z-[101] pointer-events-none">
                <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#d946ef]" />
                    <span className="font-bold text-sm tracking-[0.3em] uppercase text-white shadow-[0_0_10px_#d946ef]">{activeProfile ? activeProfile.name : "CyberLife"}</span>
                </div>
                <button
                    onClick={() => navigate("/settings")}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors border border-[#00f3ff]/30 shadow-[0_0_15px_#00f3ff50] pointer-events-auto"
                >
                    <Settings className="w-5 h-5 text-[#00f3ff]" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 z-10">

                {/* Circular Neon Battery */}
                <div className="relative mb-12">
                    <svg className="w-64 h-64 transform -rotate-90">
                        {/* Track */}
                        <circle cx="128" cy="128" r="120" stroke="#1f2937" strokeWidth="8" fill="transparent" />
                        {/* Indicator */}
                        <motion.circle
                            cx="128" cy="128" r="120"
                            stroke="#d946ef"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 120}
                            initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - stats.percentage / 100) }}
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_20px_#d946ef]"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-5xl font-black text-white drop-shadow-[0_0_15px_white] italic">
                            {stats.percentage.toFixed(1)}%
                        </span>
                        <span className="text-xs uppercase tracking-widest text-[#00f3ff] mt-2">Energy Level</span>
                    </div>
                </div>

                <div className="w-full max-w-sm border border-[#00f3ff]/30 bg-[#00f3ff]/5 p-6 rounded-lg backdrop-blur-sm relative">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00f3ff]" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00f3ff]" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00f3ff]" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00f3ff]" />

                    <UrgencyTimer dob={dob} lifespan={lifespan} minimal={true} />
                </div>

            </main>
        </div>
    );
}
