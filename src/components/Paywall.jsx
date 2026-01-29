import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { useSubscription } from "../contexts/SubscriptionContext";
import { triggerHaptic } from "../utils/haptics";
import { ImpactStyle } from "@capacitor/haptics";
import { useState } from "react";

export default function Paywall({ onClose }) {
    const { offerings, purchasePackage, restorePurchases } = useSubscription();
    const [isPurchasing, setIsPurchasing] = useState(false);

    const handlePurchase = async () => {
        if (!offerings?.availablePackages?.length) return;

        setIsPurchasing(true);
        try {
            const pkg = offerings.availablePackages[0]; // Usually we select the first one (Monthly/Yearly)
            const success = await purchasePackage(pkg);
            if (success) {
                triggerHaptic(ImpactStyle.Heavy);
                if (onClose) onClose();
            }
        } catch (error) {
            alert("Purchase failed: " + error.message);
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleRestore = async () => {
        setIsPurchasing(true);
        try {
            await restorePurchases();
            alert("Purchases restored!");
            if (onClose) onClose();
        } catch (error) {
            alert("Restore failed: " + error.message);
        } finally {
            setIsPurchasing(false);
        }
    };

    const currentPkg = offerings?.availablePackages?.[0];
    const priceString = currentPkg?.product?.priceString || "$0.99";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
        >
            <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="text-center mt-4 mb-8">
                    <div className="text-4xl mb-2">💎</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Unlock Pro</h2>
                    <p className="text-neutral-400 text-sm">Get access to all premium themes and support development.</p>
                </div>

                <div className="space-y-4 mb-8">
                    <FeatureItem text="Unlock All Themes (Neon, Pixel...)" />
                    <FeatureItem text="Future Pro Features" />
                    <FeatureItem text="Support Indie Developer" />
                </div>

                <button
                    onClick={handlePurchase}
                    disabled={isPurchasing || !currentPkg}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-bold text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                    {isPurchasing ? "Processing..." : `Subscribe for ${priceString} / Month`}
                </button>

                <button
                    onClick={handleRestore}
                    className="w-full mt-4 text-xs text-neutral-500 underline"
                >
                    Restore Purchases
                </button>

                <p className="text-[10px] text-neutral-600 text-center mt-4">
                    Recurring billing. Cancel anytime.
                </p>
            </div>
        </motion.div>
    );
}

function FeatureItem({ text }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-green-500" />
            </div>
            <span className="text-sm text-neutral-300">{text}</span>
        </div>
    );
}
