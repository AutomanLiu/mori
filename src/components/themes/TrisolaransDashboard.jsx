import { useState, useEffect } from "react";
import { useProfile } from "../../contexts/ProfileContext";
import { Settings, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/use-translation";

export default function TrisolaransDashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { activeProfile } = useProfile();

    // Fallback defaults if profile is loading or missing
    const dob = activeProfile?.dob || "2000-01-01";
    const lifespan = activeProfile?.lifespan || 80;

    const [timeLeft, setTimeLeft] = useState({
        hours: "000000",
        minutes: "00",
        seconds: "00",
        milliseconds: "000"
    });

    useEffect(() => {
        const updateTimer = () => {
            const birthDate = new Date(dob);
            const deathDate = new Date(birthDate);
            deathDate.setFullYear(birthDate.getFullYear() + parseInt(lifespan));

            const now = new Date();
            const diff = deathDate - now;

            if (diff <= 0) {
                setTimeLeft({ hours: "000000", minutes: "00", seconds: "00", milliseconds: "000" });
                return;
            }

            const totalHours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            const milliseconds = diff % 1000;

            setTimeLeft({
                hours: totalHours.toString().padStart(6, '0'),
                minutes: minutes.toString().padStart(2, '0'),
                seconds: seconds.toString().padStart(2, '0'),
                milliseconds: milliseconds.toString().padStart(3, '0')
            });
        };

        const timer = setInterval(updateTimer, 37); // Update frequently for milliseconds
        updateTimer();

        return () => clearInterval(timer);
    }, [dob, lifespan]);

    return (
        <div className="h-full w-full bg-black text-[#00FF00] font-mono flex flex-col relative overflow-hidden">
            {/* Header */}
            <header className="p-6 pt-safe-top flex justify-between items-center z-[101] pointer-events-none">
                <div className="flex items-center gap-2 text-[#00FF00]">
                    <Settings className="w-5 h-5 animate-spin-slow" />
                    <span className="font-bold text-xs tracking-[0.5em] uppercase text-[#00FF00] shadow-[0_0_10px_#00FF00]">{activeProfile ? activeProfile.name : "TRISOLARIS"}</span>
                </div>
                <button
                    onClick={() => navigate("/settings")}
                    className="p-2 border border-[#00FF00]/30 hover:bg-[#00FF00]/10 transition-colors pointer-events-auto"
                >
                    <Settings className="w-5 h-5 text-[#00FF00]" />
                </button>
            </header>

            {/* Countdown */}
            <main className="flex-1 flex flex-col items-center justify-center select-none z-0">
                <div className="flex flex-col items-center gap-4 text-center">

                    {/* Hours */}
                    <div className="flex flex-col items-center">
                        <span className="text-[15vw] leading-none font-black tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,0,0.8)] animate-pulse">
                            {timeLeft.hours}
                        </span>
                        <span className="text-xs uppercase tracking-[0.5em] opacity-50 mt-2">Hours</span>
                    </div>

                    <div className="w-full h-[1px] bg-[#00FF00]/20 my-4" />

                    {/* M:S:MS */}
                    <div className="flex items-end gap-2 sm:gap-4 px-4 w-full justify-center">
                        <div className="flex flex-col items-center">
                            <span className="text-[8vw] leading-none font-bold tabular-nums drop-shadow-[0_0_10px_rgba(0,255,0,0.6)]">
                                {timeLeft.minutes}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Min</span>
                        </div>
                        <span className="text-[6vw] font-bold text-[#00FF00]/50 pb-[2vw]">:</span>
                        <div className="flex flex-col items-center">
                            <span className="text-[8vw] leading-none font-bold tabular-nums drop-shadow-[0_0_10px_rgba(0,255,0,0.6)]">
                                {timeLeft.seconds}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Sec</span>
                        </div>
                        <span className="text-[6vw] font-bold text-[#00FF00]/50 pb-[2vw]">:</span>
                        <div className="flex flex-col items-center">
                            <span className="text-[6vw] leading-none font-bold tabular-nums text-[#00FF00]/80 drop-shadow-[0_0_5px_rgba(0,255,0,0.4)]">
                                {timeLeft.milliseconds}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Ms</span>
                        </div>
                    </div>

                </div>
            </main>

            {/* Background elements for atmosphere */}
            <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#00FF00]/5 to-transparent pointer-events-none"></div>
        </div>
    );
}
