import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export default function FluidBackground({ percentage, children }) {
    // Ensure percentage is clamped
    const level = Math.min(Math.max(percentage, 0), 100);

    // Determine color based on level (Green -> Yellow -> Red)
    const getColor = (p) => {
        if (p > 60) return ["#10b981", "#059669", "#047857"]; // Emerald
        if (p > 20) return ["#f59e0b", "#d97706", "#b45309"]; // Amber
        return ["#ef4444", "#dc2626", "#b91c1c"]; // Red
    };

    const [light, medium, dark] = getColor(level);

    return (
        <div className="relative w-full h-full overflow-hidden bg-black">
            {/* Background Liquid Layer */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 z-0"
                initial={{ height: 0 }}
                animate={{ height: `${level}%` }}
                transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 40,
                    duration: 2
                }}
                style={{
                    background: `linear-gradient(to top, ${dark} 0%, ${medium} 50%, ${light} 100%)`,
                    boxShadow: `0 0 100px ${light}40` // Glow effect
                }}
            >
                {/* Wave Surface (Animated SVG/CSS) */}
                <div className="absolute top-0 left-0 w-full transform -translate-y-[99%]">
                    <Waves color={light} />
                </div>

                {/* Inner glow bubbles / texture */}
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
            </motion.div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full flex flex-col">
                {children}
            </div>
        </div>
    );
}

// Simple CSS/SVG Wave
function Waves({ color }) {
    return (
        <div className="w-full h-12 md:h-24 relative overflow-hidden">
            {/* We simulate a wave with CSS border-radius or SVG. For simplicity/performance in React, SVG is best. */}
            <svg viewBox="0 0 1440 320" className="w-full h-full block" preserveAspectRatio="none">
                <motion.path
                    fill={color}
                    fillOpacity="1"
                    d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    animate={{
                        d: [
                            "M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                            "M0,192L48,186.7C96,181,192,171,288,176C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,176C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                            "M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 5,
                        ease: "easeInOut"
                    }}
                />
            </svg>
        </div>
    )
}
