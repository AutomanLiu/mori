import { useNavigate } from "react-router-dom";

import { ArrowLeft, Check, ChevronRight, Globe, Palette, Clock, AlertTriangle, Lock, Sparkles, Star, Users, Plus, X, Headphones, Volume2, VolumeX, Volume1 } from "lucide-react";
import { useLocalStorage } from "../hooks/use-local-storage";
import { useTranslation, availableLanguages } from "../hooks/use-translation";
import { useProfile } from "../contexts/ProfileContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import { useAudio } from "../contexts/AudioContext";
import Paywall from "../components/Paywall";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "../utils/haptics";
import { ImpactStyle } from "@capacitor/haptics";
import { useState, useEffect } from "react";

export default function Settings() {
    const navigate = useNavigate();
    const { t, lang, setLang } = useTranslation();
    const { activeProfile, updateProfile, profiles, addProfile, switchProfile, deleteProfile, activeProfileId } = useProfile();
    const { volume, setVolume, currentTrackId, selectTrack, isMuted, setIsMuted, tracks, enablePlayback } = useAudio();

    useEffect(() => {
        enablePlayback();
    }, []);

    // Use profile data or fallbacks
    const theme = activeProfile?.theme || "classic";
    const dob = activeProfile?.dob || "";
    const lifespan = activeProfile?.lifespan || 80;

    // Pro state is global for the user, not per profile (usually)
    // const [isPro, setIsPro] = useLocalStorage("lifebattery_is_pro", false);
    const { isPro } = useSubscription();
    const [showPaywall, setShowPaywall] = useState(false);
    const [showAddProfile, setShowAddProfile] = useState(false);
    const [newProfileName, setNewProfileName] = useState("");
    const [newProfileType, setNewProfileType] = useState("human");

    const setTheme = (newTheme) => {
        if (activeProfile?.id) {
            updateProfile(activeProfile.id, { theme: newTheme });
        }
    };

    const setDob = (newDob) => {
        if (activeProfile?.id) {
            updateProfile(activeProfile.id, { dob: newDob });
        }
    };

    const setLifespan = (newLifespan) => {
        if (activeProfile?.id) {
            updateProfile(activeProfile.id, { lifespan: newLifespan });
        }
    };

    const themes = [
        { id: "classic", gradient: "from-neutral-800 to-neutral-900", isPremium: false },
        { id: "fluid", gradient: "from-emerald-900 to-black", isPremium: true },
        { id: "pixel", gradient: "from-[#8bac0f] to-[#0f380f]", isPremium: true },
        { id: "neon", gradient: "from-[#d946ef] to-[#050510]", isPremium: true },
        { id: "mono", gradient: "from-white to-neutral-200", isPremium: true },
        { id: "pastel", gradient: "from-[#fbcfe8] to-[#fde68a]", isPremium: true },
        { id: "trisolarans", gradient: "from-black to-[#00FF00]", isPremium: true },
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

            {/* Profiles Section */}
            <section className="mb-8">
                <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-1">Profiles</h2>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {profiles.map((profile, index) => (
                        <div key={profile.id} className="relative group">
                            <button
                                onClick={() => {
                                    switchProfile(profile.id);
                                    triggerHaptic(ImpactStyle.Light);
                                }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all min-w-[140px] ${activeProfileId === profile.id
                                    ? "bg-neutral-800 border-neutral-700 ring-1 ring-white/20"
                                    : "bg-neutral-900 border-neutral-800 opacity-60"
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center text-xs font-bold">
                                    {profile.type === 'pet' ? '🐾' : profile.name[0].toUpperCase()}
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-sm truncate w-20">{profile.name}</div>
                                    <div className="text-[10px] text-neutral-400 capitalize">{t(`settings.${profile.type}`) || profile.type}</div>
                                </div>
                            </button>

                            {/* Delete Button (Skip index 0 / Main) */}
                            {index > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (confirm(t("settings.delete_confirm"))) {
                                            deleteProfile(profile.id);
                                            triggerHaptic(ImpactStyle.Medium);
                                        }
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-2 rounded-full shadow-lg z-50 hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={() => {
                            setNewProfileName("");
                            setNewProfileType("human");
                            setShowAddProfile(true);
                            triggerHaptic(ImpactStyle.Light);
                        }}
                        className="flex items-center justify-center w-12 h-[calc(3rem+24px)] rounded-2xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-colors shrink-0"
                    >
                        <Plus className="w-5 h-5 text-neutral-400" />
                    </button>
                </div>
            </section>

            {/* Add Profile Modal */}
            <AnimatePresence>
                {showAddProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold">{t("settings.profile_add")}</h3>
                                <button
                                    onClick={() => setShowAddProfile(false)}
                                    className="p-1 rounded-full bg-neutral-800 text-neutral-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Name Input */}
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">{t("settings.profile_name")}</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newProfileName}
                                        onChange={(e) => setNewProfileName(e.target.value)}
                                        className="w-full bg-neutral-800 border-none rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                </div>

                                {/* Type Selection */}
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 block">{t("settings.profile_type")}</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setNewProfileType("human")}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${newProfileType === "human"
                                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                                                : "bg-neutral-800 border-neutral-800 text-neutral-400 hover:bg-neutral-700"}`}
                                        >
                                            <Users className="w-6 h-6" />
                                            <span className="text-xs font-bold">{t("settings.human")}</span>
                                        </button>
                                        <button
                                            onClick={() => setNewProfileType("pet")}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${newProfileType === "pet"
                                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                                                : "bg-neutral-800 border-neutral-800 text-neutral-400 hover:bg-neutral-700"}`}
                                        >
                                            {/* Paw Icon Mock using Text or SVGs? Let's use text for now or verify imports */}
                                            <span className="text-2xl">🐾</span>
                                            <span className="text-xs font-bold">{t("settings.pet")}</span>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    disabled={!newProfileName.trim()}
                                    onClick={() => {
                                        if (newProfileName.trim()) {
                                            const lifespan = newProfileType === "pet" ? 15 : 80;
                                            addProfile({ name: newProfileName, type: newProfileType, lifespan, dob: "2024-01-01" });
                                            setShowAddProfile(false);
                                            triggerHaptic(ImpactStyle.Medium);
                                        }
                                    }}
                                    className="w-full py-3 rounded-xl bg-white text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors"
                                >
                                    {t("settings.profile_add")}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                setShowPaywall(true);
                                triggerHaptic(ImpactStyle.Medium);
                            }}
                            className="relative z-10 bg-amber-400 text-black px-4 py-2 rounded-xl font-bold text-sm hover:bg-amber-300 transition-colors shadow-lg shadow-amber-900/20"
                        >
                            {t("settings.upgrade")}
                        </button>
                    </div>
                </div>
            )}

            {/* Sound Settings */}
            <section className="mb-8">
                <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-1">{t("settings.sound", "Sound")}</h2>
                <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Headphones className="w-5 h-5 text-neutral-400" />
                            <span className="font-medium text-sm">{t("settings.bgm", "Background Music")}</span>
                        </div>
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
                        >
                            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-neutral-400" />}
                        </button>
                    </div>

                    {/* Volume Slider */}
                    {!isMuted && (
                        <div className="flex items-center gap-3 px-1">
                            <Volume1 className="w-3 h-3 text-neutral-500" />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="flex-1 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <Volume2 className="w-3 h-3 text-neutral-500" />
                        </div>
                    )}

                    {/* Track Selector */}
                    <div className="grid grid-cols-2 gap-2">
                        {tracks.map((track) => {
                            const isLocked = !track.free && !isPro;
                            const isSelected = currentTrackId === track.id;

                            return (
                                <button
                                    key={track.id}
                                    onClick={() => {
                                        if (isLocked) {
                                            setShowPaywall(true);
                                        } else {
                                            selectTrack(track.id);
                                        }
                                        triggerHaptic(ImpactStyle.Light);
                                    }}
                                    className={`relative p-3 rounded-xl border text-left transition-all ${isSelected
                                        ? "bg-neutral-800 border-neutral-600 ring-1 ring-white/10"
                                        : "bg-neutral-900/50 border-neutral-800 hover:bg-neutral-800"
                                        }`}
                                >
                                    <div className="text-xs font-bold mb-0.5">{t(`track.${track.id}`)}</div>
                                    <div className="text-[10px] text-neutral-500 capitalize">{t(`track.type.${track.type}`)}</div>

                                    {/* Lock Icon */}
                                    {isLocked && (
                                        <div className="absolute top-2 right-2">
                                            <Lock className="w-3 h-3 text-amber-500" />
                                        </div>
                                    )}

                                    {/* Playing Indicator */}
                                    {isSelected && !isMuted && (
                                        <div className="absolute top-3 right-3 flex gap-0.5 items-end h-3">
                                            <div className="w-0.5 bg-green-500 animate-[bounce_1s_infinite] h-2"></div>
                                            <div className="w-0.5 bg-green-500 animate-[bounce_1.2s_infinite] h-3"></div>
                                            <div className="w-0.5 bg-green-500 animate-[bounce_0.8s_infinite] h-1"></div>
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

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
                                        if (isLocked) {
                                            setShowPaywall(true);
                                            triggerHaptic(ImpactStyle.Medium);
                                            return;
                                        }
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
            {/* Paywall Overlay */}
            <AnimatePresence>
                {showPaywall && <Paywall onClose={() => setShowPaywall(false)} />}
            </AnimatePresence>
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
