import { useState } from "react";
import { Plus, Check, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "../hooks/use-local-storage";
import { useTranslation } from "../hooks/use-translation";
import { triggerHaptic } from "../utils/haptics";
import { ImpactStyle } from "@capacitor/haptics";
import { cn } from "../lib/utils";

export default function Wishes() {
    const { t } = useTranslation();
    const [wishes, setWishes] = useLocalStorage("lifebattery_wishes", []);
    const [newWish, setNewWish] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const addWish = (e) => {
        e.preventDefault();
        if (newWish.trim()) {
            setWishes([{ id: Date.now(), text: newWish, completed: false }, ...wishes]);
            setNewWish("");
            triggerHaptic(ImpactStyle.Medium);
        } setIsAdding(false);
    };

    const toggleWish = (id) => {
        setWishes(wishes.map(w => w.id === id ? { ...w, completed: !w.completed } : w));
    };

    const deleteWish = (id) => {
        setWishes(wishes.filter(w => w.id !== id));
    };

    const activeWishes = wishes.filter(w => !w.completed);
    const completedWishes = wishes.filter(w => w.completed);

    return (
        <div className="p-6 h-full flex flex-col">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                        {t("wishes.title")}
                    </h1>
                    <p className="text-neutral-400 text-sm mt-1">
                        {completedWishes.length} {t("wishes.fulfilled")}
                    </p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-white text-black p-3 rounded-full hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
                >
                    {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
            </header>

            {/* Add Input */}
            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={addWish}
                        className="mb-6 overflow-hidden"
                    >
                        <div className="flex gap-2">
                            <input
                                autoFocus
                                type="text"
                                value={newWish}
                                onChange={(e) => setNewWish(e.target.value)}
                                placeholder={t("wishes.placeholder")}
                                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-colors"
                            />
                            <button type="submit" className="bg-emerald-500 text-black px-4 rounded-xl font-bold">
                                {t("wishes.add")}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="space-y-6">
                {/* Active List */}
                <div className="space-y-3">
                    {activeWishes.length === 0 && completedWishes.length === 0 && !isAdding && (
                        <div className="text-center py-20 text-neutral-600 italic">
                            {t("wishes.empty_state")}
                        </div>
                    )}

                    <AnimatePresence mode="popLayout">
                        {activeWishes.map(wish => (
                            <WishItem key={wish.id} wish={wish} onToggle={toggleWish} onDelete={deleteWish} />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Completed List */}
                {completedWishes.length > 0 && (
                    <div className="pt-8 border-t border-neutral-900">
                        <h3 className="text-sm uppercase tracking-wider text-neutral-600 mb-4 font-bold">{t("wishes.memories")}</h3>
                        <div className="space-y-3 opacity-60">
                            {completedWishes.map(wish => (
                                <WishItem key={wish.id} wish={wish} onToggle={toggleWish} onDelete={deleteWish} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function WishItem({ wish, onToggle, onDelete }) {
    return (
        <motion.div
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={cn(
                "bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex items-center gap-4 group",
                wish.completed && "bg-neutral-900/20 border-neutral-900"
            )}
        >
            <button
                onClick={() => {
                    onToggle(wish.id);
                    triggerHaptic(ImpactStyle.Light);
                }}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${wish.completed
                    ? "bg-emerald-500 border-emerald-500 text-black"
                    : "border-emerald-500/50 hover:border-emerald-500 text-transparent"
                    }`}
            >
                <Check className="w-3.5 h-3.5" />
            </button>
            <span className={`flex-1 text-sm ${wish.completed ? "text-emerald-400 font-medium" : "text-neutral-200"}`}>
                {wish.text} {wish.completed && " 😊"}
            </span>
            <button
                onClick={() => {
                    onDelete(wish.id);
                    triggerHaptic(ImpactStyle.Medium);
                }} className="text-neutral-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 className="w-4 h-4" />
            </button>
        </motion.div>
    )
}
