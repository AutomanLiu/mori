import { createContext, useContext, useEffect, useState } from "react";
import { Purchases } from "@revenuecat/purchases-capacitor";
import { Capacitor } from "@capacitor/core";

const SubscriptionContext = createContext();

// REPLACE WITH YOUR KEYS
const API_KEYS = {
    ios: "appl_REPLACE_WITH_YOUR_KEY",
    android: "goog_REPLACE_WITH_YOUR_KEY"
};

export function SubscriptionProvider({ children }) {
    const [isPro, setIsPro] = useState(false);
    const [offerings, setOfferings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                if (Capacitor.getPlatform() === 'web') {
                    setLoading(false);
                    return;
                }

                const apiKey = Capacitor.getPlatform() === 'ios' ? API_KEYS.ios : API_KEYS.android;
                await Purchases.configure({ apiKey });

                const customerInfo = await Purchases.getCustomerInfo();
                checkEntitlements(customerInfo);

                const offerings = await Purchases.getOfferings();
                if (offerings.current) {
                    setOfferings(offerings.current);
                }
            } catch (error) {
                console.error("RevenueCat Init Error:", error);
            } finally {
                setLoading(false);
            }
        };

        const checkEntitlements = (customerInfo) => {
            if (customerInfo.entitlements.active["pro_access"]) {
                setIsPro(true);
            } else {
                setIsPro(false);
            }
        };

        // Listen for updates (restores, purchases made outside app, etc.)
        Purchases.addCustomerInfoUpdateListener((info) => {
            checkEntitlements(info);
        });

        init();
    }, []);

    const purchasePackage = async (packageToPurchase) => {
        try {
            const { customerInfo } = await Purchases.purchasePackage({ aPackage: packageToPurchase });
            checkEntitlements(customerInfo);
            return true;
        } catch (error) {
            if (error.userCancelled) {
                return false;
            }
            console.error("Purchase Error:", error);
            throw error;
        }
    };

    const restorePurchases = async () => {
        try {
            const customerInfo = await Purchases.restorePurchases();
            checkEntitlements(customerInfo);
            return customerInfo;
        } catch (error) {
            console.error("Restore Error:", error);
            throw error;
        }
    };

    return (
        <SubscriptionContext.Provider value={{
            isPro,
            offerings,
            loading,
            purchasePackage,
            restorePurchases
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    return useContext(SubscriptionContext);
}
