import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { useSubscription } from "../contexts/SubscriptionContext";
import { triggerHaptic } from "../utils/haptics";
import { ImpactStyle } from "@capacitor/haptics";
import { useState } from "react";

export default function Paywall({ onClose }) {
    const { offerings, purchasePackage, restorePurchases, loading, error, retryLoad } = useSubscription();
    const [isPurchasing, setIsPurchasing] = useState(false);

    const handlePurchase = async () => {
        if (!offerings?.availablePackages?.length) {
            return;
        }

        setIsPurchasing(true);
        try {
            const pkg = offerings.availablePackages[0];

            const success = await purchasePackage(pkg);
            if (success) {
                triggerHaptic(ImpactStyle.Heavy);
                // DEBUG: Verify Entitlement ID match
                // Logic is inside SubscriptionContext, but we can't see it here easily without Context exposing it.
                // Rely on Context to handle state, but checking if it worked:
                if (onClose) onClose();
            }
        } catch (error) {
            // Ignore user cancellation errors (including string matching for safety)
            const errorMessage = error.message || "";
            if (error.code === 1 || error.userCancelled || errorMessage.includes("cancelled")) {
                console.log("User cancelled purchase");
                return;
            }

            // Only alert for real errors
            alert("Purchase Failed: " + errorMessage);
            console.error("Purchase failed:", error);
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleRestore = async () => {
        setIsPurchasing(true);
        try {
            const customerInfo = await restorePurchases();
            const activeEntitlements = Object.keys(customerInfo?.customerInfo?.entitlements?.active || customerInfo?.entitlements?.active || {});
            if (activeEntitlements.length > 0) {
                alert("Purchases restored successfully!");
                if (onClose) onClose();
            } else {
                alert("No active subscription found. Please subscribe first.");
            }
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
                    <h2 className="text-2xl font-bold text-white mb-2">Unlock Mori Pro</h2>
                    <p className="text-neutral-400 text-sm">Get access to all premium themes and support development.</p>
                </div>

                <div className="space-y-4 mb-8">
                    <FeatureItem text="Unlock All Themes (Neon, Pixel...)" />
                    <FeatureItem text="Future Pro Features" />
                    <FeatureItem text="Support Indie Developer" />
                </div>

                {/* Action Button Area */}
                <div className="space-y-3">
                    {loading ? (
                        <button disabled className="w-full py-4 rounded-xl bg-neutral-800 text-neutral-400 font-bold flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
                            Loading...
                        </button>
                    ) : error ? (
                        <div className="space-y-2">
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
                                {error.message || "Failed to load products"}
                            </div>
                            <button
                                onClick={() => retryLoad && retryLoad()}
                                className="w-full py-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold transition-all"
                            >
                                Retry
                            </button>
                        </div>
                    ) : !currentPkg ? (
                        <div className="space-y-2">
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500 text-xs text-center">
                                No products found. Check configuration.
                            </div>
                            <button
                                onClick={() => retryLoad && retryLoad()}
                                className="w-full py-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold transition-all"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handlePurchase}
                            disabled={isPurchasing}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-bold text-white shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            {isPurchasing ? "Processing..." : `Subscribe for ${priceString} / Month`}
                        </button>
                    )}
                </div>

                <button
                    onClick={handleRestore}
                    className="w-full mt-4 text-xs text-neutral-500 underline"
                >
                    Restore Purchases
                </button>

                {/* Legal Footer */}
                <div className="mt-6 pt-4 border-t border-neutral-800">
                    <p className="text-[10px] text-neutral-600 text-center leading-relaxed">
                        Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
                        Your account will be charged for renewal within 24-hours prior to the end of the current period.
                    </p>

                    <div className="flex justify-center gap-4 mt-3 text-[10px] text-neutral-500">
                        <a
                            href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                        >
                            Terms of Use (EULA)
                        </a>
                        <span>•</span>
                        <a
                            href="https://github.com/AutomanLiu/mori/blob/main/PRIVACY.md"
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                        >
                            Privacy Policy
                        </a>
                    </div>
                </div>
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
