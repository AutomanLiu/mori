import { useState, useEffect } from "react";
import { Settings, BatteryMedium } from "lucide-react";
import { useLocalStorage } from "../../hooks/use-local-storage";
import UrgencyTimer from "../UrgencyTimer";
import { differenceInWeeks, differenceInDays, differenceInYears, addYears, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function MonoDashboard() {
    const navigate = useNavigate();
    const [dob] = useLocalStorage("lifebattery_dob", "");
    const [lifespan] = useLocalStorage("lifebattery_lifespan", 80);
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
        <div className="h-full bg-white text-black flex flex-col relative pb-safe-bottom font-sans selection:bg-black selection:text-white">
            {/* Header */}
            <header className="p-6 pt-safe-top flex justify-between items-center z-[101] border-b-2 border-black pointer-events-none">
                <div className="flex items-center gap-2">
                    <div className="bg-black text-white p-1">
                        <BatteryMedium className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm tracking-tight uppercase">Memento Mori</span>
                </div>
                <button
                    onClick={() => navigate("/settings")}
                    className="p-2 hover:bg-neutral-100 transition-colors border-2 border-transparent hover:border-black rounded-lg pointer-events-auto"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6">

                {/* E-ink style display */}
                <div className="w-full max-w-sm border-4 border-black p-8 relative shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] bg-white">
                    <h1 className="text-7xl font-black tracking-tighter mb-2">
                        {stats.percentage.toFixed(1)}%
                    </h1>
                    <div className="w-full h-4 border-2 border-black p-0.5">
                        <div
                            className="h-full bg-black transition-all duration-1000"
                            style={{ width: `${stats.percentage}%` }}
                        />
                    </div>
                    <p className="text-right text-xs font-bold uppercase mt-2 tracking-widest">
                        Life Remaining
                    </p>
                </div>

                {/* Quote */}
                <div className="mt-12 text-center max-w-xs">
                    <p className="text-sm font-serif italic border-l-2 border-black pl-4 text-left">
                        "You could leave life right now. Let that determine what you do and say and think."
                    </p>
                    <p className="text-xs font-bold uppercase mt-2 text-right">— Marcus Aurelius</p>
                </div>

                {/* Minimal Timer - Override styles for Monochrome */}
                <div className="mt-12 w-full max-w-xs grayscale opacity-80">
                    <UrgencyTimer dob={dob} lifespan={lifespan} minimal={true} />
                </div>

            </main>
        </div>
    );
}
