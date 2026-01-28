import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

export default function Battery({ percentage, compact = false }) {
    // Clamp percentage between 0 and 100
    const level = Math.min(Math.max(percentage, 0), 100);

    // Determine color based on level
    const getColor = (p) => {
        if (p > 60) return "bg-emerald-500 shadow-emerald-500/50";
        if (p > 20) return "bg-amber-400 shadow-amber-400/50";
        return "bg-rose-500 shadow-rose-500/50";
    };

    const colorClass = getColor(level);
    const textColorClass = level > 60 ? "text-emerald-400" : level > 20 ? "text-amber-400" : "text-rose-500";

    // Dimensions based on compact mode
    const widthClass = compact ? "w-48" : "w-64";
    const heightClass = compact ? "h-72" : "h-96";
    const nippleClass = compact ? "w-12 h-4" : "w-16 h-6";
    const reflectionClass = compact ? "w-32" : "w-56";
    const textSizeClass = compact ? "text-4xl" : "text-6xl"; // Reduced text size for compact mode

    return (
        <div className="relative flex flex-col items-center justify-center py-4">
            {/* Battery Nipple */}
            <div className={`${nippleClass} bg-neutral-800 rounded-t-lg mb-1 border-t border-x border-neutral-700 mx-auto`} />

            {/* Battery Body */}
            <div className={`relative ${widthClass} ${heightClass} bg-neutral-900/50 rounded-3xl border-4 border-neutral-800 overflow-hidden backdrop-blur-sm shadow-2xl`}>

                {/* Background Grid/Lines for measurement */}
                <div className="absolute inset-0 z-0 opacity-10 flex flex-col justify-between py-4 px-2 pointer-events-none">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-full h-px bg-white/50" />
                    ))}
                </div>

                {/* Liquid Fill */}
                <motion.div
                    className={cn("absolute bottom-0 left-0 right-0 z-10 transition-colors duration-1000", colorClass)}
                    initial={{ height: 0 }}
                    animate={{ height: `${level}%` }}
                    transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 60,
                        duration: 2
                    }}
                >
                    {/* Bubbles effect (simple Overlay) */}
                    <div className="absolute inset-0 w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent" />

                    {/* Wave Top (optional, keeping simple for now or using SVG if needed for "liquid" feel) */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 blur-md" />
                </motion.div>

                {/* Percentage Text (Centered) */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none mix-blend-difference">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`${textSizeClass} font-black text-white slashed-zero tracking-tighter`}
                    >
                        {level.toFixed(1)}%
                    </motion.span>
                    <span className="text-xs font-medium text-white/50 uppercase tracking-widest mt-2">
                        Remaining
                    </span>
                </div>
            </div>

            {/* Reflection under battery */}
            <div className={cn(`${reflectionClass} h-4 mx-auto mt-6 rounded-[100%] blur-xl opacity-20 transition-colors duration-1000`, colorClass.split(" ")[0])} />

        </div>
    );
}
