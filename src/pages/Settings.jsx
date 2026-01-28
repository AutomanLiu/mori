import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronRight, Globe, Palette, Clock, AlertTriangle, Lock, Sparkles, Star } from "lucide-react";
import { useLocalStorage } from "../hooks/use-local-storage";
import { useTranslation, availableLanguages } from "../hooks/use-translation";
import { motion } from "framer-motion";
import { triggerHaptic } from "../utils/haptics";
import { ImpactStyle } from "@capacitor/haptics";

export default function Settings() {
    const navigate = useNavigate();
    const { t, lang, setLang } = useTranslation();

    const [theme, setTheme] = useLocalStorage("lifebattery_theme", "classic");
    const [dob, setDob] = useLocalStorage("lifebattery_dob", "");
    const [lifespan, setLifespan] = useLocalStorage("lifebattery_lifespan", 80);
    const [isPro, setIsPro] = useLocalStorage("lifebattery_is_pro", false);

    const themes = [
        { id: "classic", gradient: "from-neutral-800 to-neutral-900", isPremium: false },
        { id: "fluid", gradient: "from-emerald-900 to-black", isPremium: true },
        { id: "pixel", gradient: "from-[#8bac0f] to-[#0f380f]", isPremium: true },
        { id: "neon", gradient: "from-[#d946ef] to-[#050510]", isPremium: true },
        { id: "mono", gradient: "from-white to-neutral-200", isPremium: true },
        { id: "pastel", gradient: "from-[#fbcfe8] to-[#fde68a]", isPremium: true },
    ];

    const handleReset = () => {
        if (confirm(t("settings.reset_confirm"))) {
            localStorage.clear();
            navigate("/onboarding");
        }
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-6 pt-safe-top pb-20 overflow-y-auto font-sans">
            <header className="mb-8 flex items-center gap-4 sticky top-0 bg-neutral-950/80 backdrop-blur-md py-4 z-20 -mx-6 px-6 border-b border-neutral-900">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold">{t("settings.title")}</h1>
            </header>

            {/* 1. Appearance Section (Themes) & Pro Banner */}
            {!isPro && (
                <div className="mb-8 p-[1px] rounded-2xl bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200">
                    <div className="bg-neutral-900 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -mr-16 -mt-16" />

                        <div className="relative z-10 flex-1">
                            <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                {t("settings.unlock_all")}
                            </h3>
                            <p className="text-sm text-neutral-400 mt-1">{t("settings.premium_promo")}</p>
                        </div>

                        <button
                            onClick={() => {
                                if (confirm("Mock Payment: Unlock Pro for $1.00?")) {
                                    setIsPro(true);
                                    alert("Welcome to Pro! All themes unlocked.");
                                }
                            }}
                            className="relative z-10 bg-amber-400 text-black px-4 py-2 rounded-xl font-bold text-sm hover:bg-amber-300 transition-colors shadow-lg shadow-amber-900/20"
                        >
                            {t("settings.upgrade")}
                        </button>
                    </div>
                </div>
            )}

            <section className="mb-8">
                <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-1">{t("settings.appearance")}</h2>
                <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <Palette className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{t("settings.theme")}</span>
                        {isPro && <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold ml-auto">{t("settings.pro_active")}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {themes.map((themeOption) => {
                            const isLocked = themeOption.isPremium && !isPro;

                            return (
                                <button
                                    key={themeOption.id}
                                    disabled={isLocked}
                                    onClick={() => {
                                        if (isLocked) return;
                                        setTheme(themeOption.id);
                                        triggerHaptic(ImpactStyle.Medium);
                                    }}
                                    className={`relative group rounded-xl p-3 text-left border transition-all overflow-hidden ${theme === themeOption.id
                                        ? "border-emerald-500 ring-1 ring-emerald-500/50 bg-neutral-800"
                                        : isLocked
                                            ? "border-neutral-800 bg-neutral-950/30 opacity-60 grayscale cursor-not-allowed"
                                            : "border-neutral-800 bg-neutral-950/50 hover:border-neutral-700 cursor-pointer"
                                        }`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${themeOption.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />

                                    {/* Lock Overlay */}
                                    {isLocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                                            <div className="bg-neutral-900/80 p-1.5 rounded-full backdrop-blur-sm border border-white/10">
                                                <Lock className="w-4 h-4 text-white/70" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className={`w-3 h-3 rounded-full ${theme === themeOption.id ? "bg-emerald-500" : "bg-neutral-700"}`} />
                                            {themeOption.isPremium && !isLocked && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                                        </div>
                                        <h3 className="font-bold text-sm leading-tight mb-0.5 flex items-center gap-1">
                                            {t(`theme.${themeOption.id}`)}
                                        </h3>
                                        <p className="text-[10px] text-neutral-400 line-clamp-1">{t(`theme.desc.${themeOption.id}`)}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 2. Data Section (Time Data) */}
            <section className="mb-8">
                <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-1">{t("settings.data")}</h2>
                <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 divide-y divide-neutral-800">

                    {/* DOB */}
                    <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Clock className="w-5 h-5" />
                            </div>
                            <label className="font-medium">{t("settings.dob")}</label>
                        </div>
                        <div className="relative w-full min-w-0">
                            <input
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                style={{ width: '100%', boxSizing: 'border-box' }}
                                className="block w-full min-w-0 appearance-none bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-center text-white outline-none focus:border-emerald-500/50 transition-colors box-border"
                            />
                        </div>
                    </div>

                    {/* Lifespan */}
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <label className="font-medium">{t("settings.lifespan")}</label>
                            </div>
                            <span className="text-xl font-bold tabular-nums text-emerald-400">{lifespan}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="120"
                            value={lifespan}
                            onChange={(e) => setLifespan(e.target.value)}
                            className="w-full h-2 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <div className="flex justify-between text-xs text-neutral-500 mt-2 font-mono">
                            <span>1</span>
                            <span>60</span>
                            <span>120</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. General Section (Language & Others) */}
            <section className="mb-8">
                <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-1">{t("settings.general")}</h2>
                <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800">
                    {/* Language Selector (Compact Horizontal Scroll) */}
                    <div className="p-4 border-b border-neutral-800 last:border-0">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Globe className="w-5 h-5" />
                            </div>
                            <span className="font-medium">{t("settings.language")}</span>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {availableLanguages.map((l) => (
                                <button
                                    key={l.code}
                                    onClick={() => {
                                        setLang(l.code);
                                        triggerHaptic(ImpactStyle.Light);
                                    }}
                                    className={`px-2 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${lang === l.code
                                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                                        : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200"
                                        }`}
                                >
                                    {l.shortName}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Reset Section */}
            <section>
                <button
                    onClick={handleReset}
                    className="w-full py-4 rounded-xl border border-red-900/30 text-red-500 hover:bg-red-950/30 transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <AlertTriangle className="w-4 h-4" />
                    {t("settings.reset")}
                </button>
                <div className="text-center mt-6 text-xs text-neutral-600 font-mono">
                    {t("settings.version")}
                </div>
            </section>
        </div>
    );
}

// Icons import helper if missing
function Heart(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    )
}
