import { useState, useEffect } from "react";
import { differenceInMilliseconds, parseISO, addYears } from "date-fns";
import { cn } from "../lib/utils";
import { useTranslation } from "../hooks/use-translation";

export default function UrgencyTimer({ dob, lifespan, minimal = false }) {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!dob || !lifespan) return;

        const birthDate = parseISO(dob);
        const deathDate = addYears(birthDate, lifespan);

        const interval = setInterval(() => {
            const now = new Date();
            const diff = deathDate.getTime() - now.getTime();
            setTimeLeft(Math.max(0, diff));
        }, 43); // 23fps approx, prime number to look organic

        return () => clearInterval(interval);
    }, [dob, lifespan]);

    // Format milliseconds to Seconds:Milliseconds
    const seconds = Math.floor(timeLeft / 1000);
    const milliseconds = timeLeft % 1000;

    if (minimal) {
        return (
            <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold mb-1">
                    {t("common.time_remaining")}
                </span>
                <div className="flex items-baseline gap-1 text-white font-mono tabular-nums">
                    <span className="text-2xl font-bold tracking-tight">
                        {seconds.toLocaleString()}
                    </span>
                    <span className="text-lg opacity-50">.</span>
                    <span className="text-lg w-[3ch] opacity-80">
                        {milliseconds.toString().padStart(3, '0')}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full mt-1 p-2 rounded-xl bg-gradient-to-br from-red-900/20 to-neutral-900 border border-red-900/30 flex flex-col items-center justify-center relative overflow-hidden group">
            {/* Background Pulse */}
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse" />

            <span className="text-[9px] uppercase tracking-[0.2em] text-red-500/80 font-bold mb-0.5">
                {t("common.time_remaining")}
            </span>

            <div className="flex items-baseline gap-1 text-red-100 font-mono tabular-nums">
                <span className="text-xl font-bold tracking-tighter">
                    {seconds.toLocaleString()}
                </span>
                <span className="text-base opacity-50">.</span>
                <span className="text-base w-[3ch] opacity-80">
                    {milliseconds.toString().padStart(3, '0')}
                </span>
                <span className="text-[9px] text-red-500/50 ml-1 font-sans font-medium">s</span>
            </div>
        </div>
    );
}
