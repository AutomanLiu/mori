import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation, useDragControls } from "framer-motion";
import { X, CloudSun, Sun, Moon, CloudRain, Wind, ChevronUp, ChevronDown } from "lucide-react";
import { useTranslation } from "../hooks/use-translation";

import { getDailyQuote } from "../data/quotes";

export default function TopDrawer({ isOpen, setIsOpen }) {
    const { t, lang } = useTranslation();
    const [time, setTime] = useState(new Date());
    const [quote, setQuote] = useState(getDailyQuote());
    const controls = useAnimation();

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Update effect on open
    // We use getDailyQuote() to ensure the Date Recommendation logic is applied.
    // If you want pure random on every open, use getRandomQuote() instead.
    useEffect(() => {
        if (isOpen) {
            setQuote(getDailyQuote());
            controls.start({ y: "0%" });
        } else {
            controls.start({ y: "-100%" });
        }
    }, [isOpen, controls]);

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

    const handleDragEnd = (event, info) => {
        const offset = info.offset.y;
        const velocity = info.velocity.y;

        if (isOpen) {
            // If open, drag up (-y) to close
            if (offset < -100 || velocity < -500) {
                setIsOpen(false);
            } else {
                // Snap back to open
                controls.start({ y: "0%" });
            }
        } else {
            // If closed, drag down (+y) to open
            if (offset > 100 || velocity > 500) {
                setIsOpen(true);
            } else {
                // Snap back to closed
                controls.start({ y: "-100%" });
            }
        }
    };

    return (
        <>
            {/* 
        Gesture Trigger Area 
        Invisible area at the top 15% of the screen to catch 'pull down' gestures 
        when the drawer is closed.
      */}
            {/* Trigger Handle - Visual Hint (Breathing Light Style) */}
            {/* Trigger Handle - Active Touch Zone */}
            {!isOpen && (
                <motion.div
                    className="absolute top-0 left-24 right-24 h-[15vh] z-[100] flex justify-center items-start pt-safe-top cursor-grab touch-none"
                    onPanEnd={(e, info) => {
                        if (info.offset.y > 50) {
                            setIsOpen(true);
                        }
                    }}
                    whileHover={{ scale: 1.0 }}
                >
                    <div className="flex flex-col items-center gap-1 text-white/40 animate-pulse pointer-events-none mt-2">
                        <ChevronDown className="w-6 h-6" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">{t("drawer.energy")}</span>
                    </div>
                </motion.div>
            )}

            {/* The Full Screen Energy Space */}
            <motion.div
                initial={{ y: "-100%" }}
                animate={controls}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-between pt-safe-top pb-safe-bottom overflow-hidden touch-none"
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }} // Use raw drag for custom snap logic
                dragElastic={{ top: 0, bottom: 0.5 }} // Allow elastic pull at bottom, strict at top
                onDragEnd={handleDragEnd}
                onWheel={(e) => {
                    // Detect downward scroll "swipe up" (Trackpad/MouseWheel)
                    // +deltaY means scrolling DOWN (pushing content up)
                    if (e.deltaY > 30 && isOpen) {
                        setIsOpen(false);
                    }
                }}
            >
                {/* Background Ambient Gradient */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-indigo-900/40 to-black/90 pointer-events-none" />
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120vw] h-[50vh] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Close Button (Visual only, drag handles interaction) */}
                <div className="w-full flex justify-end p-6 z-10 relative pointer-events-none">
                    <div className="p-3 bg-white/5 rounded-full text-white/50 pointer-events-auto cursor-pointer" onClick={() => setIsOpen(false)}>
                        <X className="w-6 h-6" />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-8 z-10 space-y-12 pointer-events-none">

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

                {/* Bottom Trigger Hint */}
                <div
                    className="w-full h-16 z-20 flex flex-col items-center justify-end pb-4 cursor-pointer text-white/30 hover:text-white transition-colors gap-1 opacity-50"
                    onClick={() => setIsOpen(false)}
                >
                    <ChevronUp className="w-6 h-6 animate-bounce" />
                    <span className="text-xs uppercase tracking-widest font-bold">{t("drawer.close_hint")}</span>
                </div>

            </motion.div>
        </>
    );
}
