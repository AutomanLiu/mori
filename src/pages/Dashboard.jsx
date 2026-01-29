import { useState } from "react";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { useProfile } from "../contexts/ProfileContext";
import ClassicDashboard from "../components/themes/ClassicDashboard";
import FluidDashboard from "../components/themes/FluidDashboard";
import PixelDashboard from "../components/themes/PixelDashboard";
import NeonDashboard from "../components/themes/NeonDashboard";
import MonoDashboard from "../components/themes/MonoDashboard";
import PastelDashboard from "../components/themes/PastelDashboard";
import TrisolaransDashboard from "../components/themes/TrisolaransDashboard";

export default function Dashboard() {
    const { activeProfile, nextProfile, prevProfile } = useProfile();
    const theme = activeProfile?.theme || "classic";

    const handlers = useSwipeable({
        onSwipedLeft: () => nextProfile(),
        onSwipedRight: () => prevProfile(),
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    const renderDashboard = () => {
        switch (theme) {
            case "classic":
                return <ClassicDashboard />;
            case "pixel":
                return <PixelDashboard />;
            case "neon":
                return <NeonDashboard />;
            case "mono":
                return <MonoDashboard />;
            case "pastel":
                return <PastelDashboard />;
            case "trisolarans":
                return <TrisolaransDashboard />;
            case "fluid":
            default:
                return <FluidDashboard />;
        }
    };

    return (
        <div {...handlers} className="relative h-full w-full overflow-hidden">
            <motion.div className="h-full w-full touch-pan-y">
                {renderDashboard()}
            </motion.div>
        </div>
    );
}
