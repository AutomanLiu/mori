import { useState, useEffect } from "react";
import { Settings, Heart } from "lucide-react";
import { useLocalStorage } from "../../hooks/use-local-storage";
import FluidBackground from "../FluidBackground";
import UrgencyTimer from "../UrgencyTimer";
import { differenceInWeeks, differenceInDays, differenceInYears, addYears, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/use-translation";

export default function FluidDashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [dob] = useLocalStorage("lifebattery_dob", "");
    const [lifespan] = useLocalStorage("lifebattery_lifespan", 80);

    const [stats, setStats] = useState({
        percentage: 100,
        weeksLeft: 0,
        daysLeft: 0,
        yearsLeft: 0
    });

    useEffect(() => {
        if (!dob || !lifespan) return;

        const birthDate = parseISO(dob);
        const deathDate = addYears(birthDate, lifespan);
        const now = new Date();

        const totalDuration = deathDate.getTime() - birthDate.getTime();
        const elapsedDuration = now.getTime() - birthDate.getTime();

        const percentageLeft = 100 - (elapsedDuration / totalDuration) * 100;

        // Time remaining
        const weeks = differenceInWeeks(deathDate, now);
        const days = differenceInDays(deathDate, now);
        const years = differenceInYears(deathDate, now);

        setStats({
            percentage: percentageLeft,
            weeksLeft: weeks,
            daysLeft: days,
            yearsLeft: years
        });

    }, [dob, lifespan]);


    return (
        <FluidBackground percentage={stats.percentage}>
            {/* Header - Minimalist */}
            <header className="absolute top-0 left-0 right-0 p-6 pt-safe-top flex justify-between items-center z-[101] pointer-events-none mix-blend-overlay">
                <span className="font-bold text-sm tracking-widest uppercase opacity-80 text-white font-serif italic">Mori</span>
                <button
                    onClick={() => navigate("/settings")}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-white pointer-events-auto"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </header>

            {/* Main Content - Centered Typography */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-20">

                {/* Massive Percentage */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[15vw] font-bold text-white leading-none tracking-tighter drop-shadow-2xl"
                    >
                        {stats.percentage.toFixed(1)}%
                    </motion.h1>
                    <p className="text-lg text-white/70 font-medium tracking-widest uppercase mt-2">
                        {t("common.remaining")}
                    </p>
                </div>

                {/* Minimalist Stats Row */}
                <div className="grid grid-cols-3 gap-8 w-full max-w-xs mb-10">
                    <MinimalStat label={t("common.years")} value={stats.yearsLeft} />
                    <MinimalStat label={t("common.weeks")} value={stats.weeksLeft} />
                    <MinimalStat label={t("common.days")} value={stats.daysLeft} />
                </div>

                {/* Floating Timer */}
                <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-2xl p-4 w-full max-w-xs">
                    <UrgencyTimer dob={dob} lifespan={lifespan} minimal={true} />
                </div>

            </main>
        </FluidBackground>
    );
}

function MinimalStat({ label, value }) {
    return (
        <div className="flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono text-white drop-shadow-md">{value.toLocaleString()}</span>
            <span className="text-[10px] text-white/60 uppercase tracking-widest mt-1">{label}</span>
        </div>
    )
}
