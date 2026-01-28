import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Dashboard from "../pages/Dashboard";
import Wishes from "../pages/Wishes";
import { useTranslation } from "../hooks/use-translation";
import { cn } from "../lib/utils";
import { triggerHaptic } from "../utils/haptics";

export default function Layout() {
    const { t } = useTranslation();
    return (
        <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">

            {/* Page 1: Dashboard */}
            <section className="h-screen w-full snap-start relative bg-neutral-950 flex flex-col pt-safe-top">
                <Dashboard />

                {/* Scroll Indicator (Breathing Light Style) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none pb-safe-bottom z-10"
                >
                    <div className="flex flex-col items-center gap-1 text-white/40 animate-pulse">
                        <span className="text-[10px] uppercase tracking-widest font-bold">{t("layout.wishes")}</span>
                        <ChevronUp className="w-6 h-6" />
                    </div>
                </motion.div>
            </section>

            {/* Page 2: Wishes */}
            <section className="h-screen w-full snap-start bg-neutral-950 pt-safe-top pb-safe-bottom">
                <Wishes />
            </section>

        </div>
    );
}
