import { useState, useEffect } from "react";
import { useProfile } from "../../contexts/ProfileContext";
import { Settings, Share2, Battery as BatteryIcon, BatteryCharging, BatteryWarning, Info, Heart } from "lucide-react";
import Battery from "../Battery";
import UrgencyTimer from "../UrgencyTimer";
import { differenceInWeeks, differenceInDays, differenceInYears, addYears, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/use-translation";

export default function ClassicDashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { activeProfile } = useProfile();

    const dob = activeProfile?.dob || "2000-01-01";
    const lifespan = activeProfile?.lifespan || 80;

    const [stats, setStats] = useState({
        yearsPassed: 0,
        weeksPassed: 0,
        percentage: 0,
        weeksTotal: 0,
        weeksRemaining: 0,
        yearsLeft: 0,
        weeksLeft: 0,
        daysLeft: 0
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
        <div className="h-full bg-neutral-950 text-white flex flex-col relative pb-safe-bottom">
            {/* Header */}
            <header className="p-6 pt-safe-top flex justify-between items-center z-[101] pointer-events-none">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight font-serif italic">{activeProfile ? activeProfile.name : "Mori"}</span>
                </div>
                <button
                    onClick={() => navigate("/settings")}
                    className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 transition-colors pointer-events-auto"
                >
                    <Settings className="w-5 h-5 text-neutral-400" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-start pt-10 p-4 pb-32 space-y-6">
                <Battery percentage={stats.percentage} compact={true} />

                <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
                    <StatCard label="Years" value={stats.yearsLeft} />
                    <StatCard label="Weeks" value={stats.weeksLeft} active />
                    <StatCard label="Days" value={stats.daysLeft} />
                </div>

                <div className="w-full max-w-sm">
                    <UrgencyTimer dob={dob} lifespan={lifespan} />
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, active }) {
    return (
        <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-colors ${active ? "bg-white/10 border-white/20" : "bg-neutral-900/50 border-neutral-800"}`}>
            <span className="text-2xl font-bold font-mono">{value.toLocaleString()}</span>
            <span className="text-xs text-neutral-500 uppercase tracking-wider mt-1">{label}</span>
        </div>
    )
}
