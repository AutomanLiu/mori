import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen({ onComplete }) {
    const [isExit, setIsExit] = useState(false);

    useEffect(() => {
        // Trigger exit animation after 2.5s
        const timer = setTimeout(() => {
            setIsExit(true);
        }, 2000);

        // Notify parent that splash is done after animation completes
        const cleanup = setTimeout(() => {
            onComplete();
        }, 2800);

        return () => {
            clearTimeout(timer);
            clearTimeout(cleanup);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center font-serif"
            initial={{ opacity: 1 }}
            animate={isExit ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            {/* Logo Container */}
            <div className="relative">
                {/* Abstract Hourglass / M Icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    {/* Placeholder for the real image, using CSS styled 'M' for now if image file isn't physically placed yet. 
                        But we'll simulate the text logo we designed. */}
                    <h1 className="text-8xl font-black tracking-tighter italic bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
                        M
                    </h1>
                </motion.div>

                {/* Glowing Effect */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-amber-500/20 blur-[50px] rounded-full pointer-events-none"
                />
            </div>

            {/* Application Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-8 text-center"
            >
                <h2 className="text-2xl font-bold tracking-[0.2em] uppercase">Mori</h2>
                <p className="text-xs text-neutral-500 mt-2 tracking-widest uppercase">Remember to live</p>
            </motion.div>
        </motion.div>
    );
}
