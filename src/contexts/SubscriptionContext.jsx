import { createContext, useContext, useEffect, useState } from "react";
import { Purchases } from "@revenuecat/purchases-capacitor";
import { Capacitor } from "@capacitor/core";

const SubscriptionContext = createContext();


const API_KEYS = {
    ios: "appl_JNykmdTOgwDRdNrqcBNqnclECrt",
    android: "goog_REPLACE_WITH_YOUR_KEY"
};

export function SubscriptionProvider({ children }) {
    const [isPro, setIsPro] = useState(false);
    const [offerings, setOfferings] = useState(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const checkEntitlements = (customerInfo) => {
        if (!customerInfo?.entitlements?.active) {
            setIsPro(false);
            return;
        }

        const activeEntitlements = Object.keys(customerInfo.entitlements.active);

        const hasProAccess = activeEntitlements.some(id =>
            id.toLowerCase() === "pro_access" ||
            id.toLowerCase() === "mori pro" ||
            id.toLowerCase() === "pro"
        );

        if (hasProAccess) {
            setIsPro(true);
        } else {
            setIsPro(false);
        }
    };

    const init = async () => {
        try {
            setLoading(true);
            setError(null);

            if (Capacitor.getPlatform() === 'web') {
                setLoading(false);
                return;
            }

            const apiKey = Capacitor.getPlatform() === 'ios' ? API_KEYS.ios : API_KEYS.android;

            await Purchases.setLogLevel({ level: "ERROR" });
            await Purchases.configure({ apiKey });

            const customerInfo = await Purchases.getCustomerInfo();
            checkEntitlements(customerInfo);

            try {
                const offerings = await Purchases.getOfferings();

                if (offerings.current && offerings.current.availablePackages.length > 0) {
                    setOfferings(offerings.current);
                } else if (offerings.all && Object.keys(offerings.all).length > 0) {
                    const firstOfferingId = Object.keys(offerings.all)[0];
                    setOfferings(offerings.all[firstOfferingId]);
                } else {
                    // No offerings available
                }
            } catch (offeringError) {
                // Don't block app initialization on offerings error
            }

        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        init();

        // Listen for updates
        Purchases.addCustomerInfoUpdateListener((info) => {
            checkEntitlements(info);
        });
    }, []);

    const purchasePackage = async (packageToPurchase) => {
        try {
            const { customerInfo } = await Purchases.purchasePackage({ aPackage: packageToPurchase });
            checkEntitlements(customerInfo);
            return true;
        } catch (error) {
            if (error.userCancelled || String(error.code) === "1" || (error.message && error.message.includes("cancelled"))) {
                return false;
            }

            throw error;
        }
    };

    const restorePurchases = async () => {
        try {
            const customerInfo = await Purchases.restorePurchases();
            checkEntitlements(customerInfo);
            return customerInfo;
        } catch (error) {

            throw error;
        }
    };

    return (
        <SubscriptionContext.Provider value={{
            isPro,
            offerings,
            loading,
            error,
            retryLoad: init,
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
