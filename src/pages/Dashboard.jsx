import { useState } from "react";
import { motion } from "framer-motion";
import { useLocalStorage } from "../hooks/use-local-storage";
import ClassicDashboard from "../components/themes/ClassicDashboard";
import FluidDashboard from "../components/themes/FluidDashboard";
import PixelDashboard from "../components/themes/PixelDashboard";
import NeonDashboard from "../components/themes/NeonDashboard";
import MonoDashboard from "../components/themes/MonoDashboard";
import PastelDashboard from "../components/themes/PastelDashboard";
import TopDrawer from "../components/TopDrawer";

export default function Dashboard() {
    const [theme] = useLocalStorage("lifebattery_theme", "classic");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
            case "fluid":
            default:
                return <FluidDashboard />;
        }
    };

    return (
        <div className="relative h-full w-full overflow-hidden">
            <motion.div
                className="h-full w-full touch-pan-y"
                onPanEnd={(e, info) => {
                    // Detect downward swipe (Drag/Touch)
                    if (info.offset.y > 50 && info.velocity.y > 0) {
                        setIsDrawerOpen(true);
                    }
                }}
                onWheel={(e) => {
                    // Detect upward scroll / pull down (Trackpad/MouseWheel)
                    // -deltaY means scrolling UP (pulling down content)
                    if (e.deltaY < -30 && !isDrawerOpen) {
                        setIsDrawerOpen(true);
                    }
                }}
            >
                {renderDashboard()}
            </motion.div>

            <TopDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
        </div>
    );
}
