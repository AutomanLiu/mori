import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Calendar, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/use-local-storage";
import { useTranslation } from "../hooks/use-translation";
import { cn } from "../lib/utils";

export default function Onboarding() {
    const [step, setStep] = useState(1);
    const [dob, setDob] = useLocalStorage("lifebattery_dob", "");
    const [lifespan, setLifespan] = useLocalStorage("lifebattery_lifespan", 80);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleNext = () => {
        if (step === 1 && dob) {
            setStep(2);
        } else if (step === 2 && lifespan) {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 pt-safe-top pb-safe-bottom relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[100px]" />

            <motion.div
                layout
                className="max-w-md w-full z-10"
            >
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="space-y-2 text-center">
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neutral-800"
                                >
                                    <Calendar className="w-8 h-8 text-neutral-400" />
                                </motion.div>
                                <h1 className="text-4xl font-black tracking-tighter text-white mb-2 font-serif italic">
                                    Mori
                                </h1>
                                <p className="text-neutral-400">
                                    Remember to live.
                                    <br />
                                    <span className="text-xs opacity-50">{t("onboarding.data_local")}</span>
                                </p>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-neutral-500 uppercase tracking-wider">
                                    出生日期
                                </label>
                                <input
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="appearance-none w-full max-w-full bg-neutral-900/50 border border-neutral-800 focus:border-neutral-600 rounded-xl px-4 py-4 text-lg outline-none transition-colors text-center text-white color-scheme-dark m-0"
                                />
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!dob}
                                className="w-full bg-white text-black font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t("onboarding.next")} <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="space-y-2 text-center">
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neutral-800"
                                >
                                    <Heart className="w-8 h-8 text-red-500/80" />
                                </motion.div>
                                <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
                                    {t("onboarding.endpoint_title")}
                                </h1>
                                <p className="text-neutral-400">
                                    {t("onboarding.endpoint_desc")}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4 flex justify-between">
                                        <span>预期寿命</span>
                                        <span className="text-white">{lifespan} 岁</span>
                                    </label>

                                    <input
                                        type="range"
                                        min="1"
                                        max="120"
                                        value={lifespan}
                                        onChange={(e) => setLifespan(parseInt(e.target.value))}
                                        className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
                                    />
                                    <div className="flex justify-between text-xs text-neutral-600 mt-2">
                                        <span>1</span>
                                        <span>60</span>
                                        <span>120</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                className="w-full bg-white text-black font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
                            >
                                {t("onboarding.start")} <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
