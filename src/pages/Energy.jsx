import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CloudSun, Sun, Moon, ChevronDown } from "lucide-react";
import { useTranslation } from "../hooks/use-translation";
import { getDailyQuote } from "../data/quotes";

export default function Energy() {
    const { t, lang } = useTranslation();
    const [time, setTime] = useState(new Date());
    const [quote, setQuote] = useState(getDailyQuote());

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Refresh quote logic could go here if needed, keeping it simple for now

    // Determine greeting
    const hour = time.getHours();
    let greeting = "Hello";
    let Icon = Sun;

    if (hour < 12) {
        greeting = t("drawer.greeting.morning");
        Icon = CloudSun;
    } else if (hour < 18) {
        greeting = t("drawer.greeting.afternoon");
        Icon = Sun;
    } else {
        greeting = t("drawer.greeting.evening");
        Icon = Moon;
    }

    const displayQuote = quote[lang] || quote.en;
    const showSecondary = lang !== "en" && quote.en;

    return (
        <div className="h-full w-full flex flex-col items-center justify-between pt-safe-top pb-safe-bottom relative overflow-hidden bg-black text-white">
            {/* Background Ambient Gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-indigo-900/40 to-black/90 pointer-events-none" />
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120vw] h-[50vh] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-8 z-10 space-y-12">

                {/* Weather / Greeting */}
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.2)]"
                    >
                        <Icon className="w-10 h-10" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-2">{greeting}</h2>
                    <p className="text-white/40 text-base">Beijing • Sunny • 25°C</p>
                </div>

                {/* Clock */}
                <div className="text-center">
                    <div className="text-7xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-white/30 font-medium tracking-widest uppercase mt-2">
                        {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Quote Card */}
                <div className="w-full bg-white/5 border border-white/5 p-8 rounded-3xl relative backdrop-blur-md">
                    <p className="text-xl text-white/90 font-medium mb-3 leading-relaxed text-center font-serif italic">
                        "{displayQuote}"
                    </p>
                    {showSecondary && (
                        <p className="text-sm text-white/30 text-center font-sans">{quote.en}</p>
                    )}
                </div>
            </div>

            {/* Bottom Hint */}
            <div className="pb-8 opacity-50 flex flex-col items-center animate-pulse">
                <span className="text-[10px] uppercase tracking-widest font-bold mb-1">{t("layout.dashboard")}</span>
                <ChevronDown className="w-6 h-6" />
            </div>
        </div>
    );
}
