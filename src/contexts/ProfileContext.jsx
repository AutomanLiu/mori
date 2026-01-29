import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/use-local-storage";
import { v4 as uuidv4 } from 'uuid';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
    // Helper to read storage safely
    const readStorage = (key, initial) => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initial;
        } catch (error) {
            console.error("Storage Read Error", error);
            return initial;
        }
    };

    const [profiles, setProfiles] = useState(() => readStorage("lifebattery_profiles", []));
    const [activeProfileId, setActiveProfileId] = useState(() => readStorage("lifebattery_active_profile_id", null));

    // Persist changes
    useEffect(() => {
        window.localStorage.setItem("lifebattery_profiles", JSON.stringify(profiles));
    }, [profiles]);

    useEffect(() => {
        window.localStorage.setItem("lifebattery_active_profile_id", JSON.stringify(activeProfileId));
    }, [activeProfileId]);

    // Legacy data hooks (for migration) - keep using useLocalStorage or read manually
    // Since we only read them once, manual read is fine or keep hook if imports exist
    const [legacyDob] = useLocalStorage("lifebattery_dob", null);
    const [legacyLifespan] = useLocalStorage("lifebattery_lifespan", null);
    const [legacyTheme] = useLocalStorage("lifebattery_theme", null);
    const [legacyWishes] = useLocalStorage("lifebattery_wishes", null);

    useEffect(() => {
        // Migration Logic: If no profiles exist but legacy data does
        if (profiles.length === 0 && legacyDob) {
            console.log("Migrating legacy data to default profile...");

            const defaultProfile = {
                id: uuidv4(),
                name: "Me", // Default name
                type: "human",
                dob: legacyDob,
                lifespan: legacyLifespan || 80,
                theme: legacyTheme || "classic",
                wishes: legacyWishes || [],
                createdAt: new Date().toISOString()
            };

            setProfiles([defaultProfile]);
            setActiveProfileId(defaultProfile.id);

            // Optional: Clear legacy keys to avoid confusion? 
            // For safety, we keep them for now or verify migration success first.
        } else if (profiles.length === 0 && !legacyDob) {
            // Fresh install state - initialized in Onboarding
        }
    }, []);

    // Ensure we always have an active profile if profiles exist
    // activeProfileId cleanup: If activeID is not in profiles, reset to first.
    useEffect(() => {
        if (profiles.length > 0) {
            const exists = profiles.some(p => p.id === activeProfileId);
            if (!exists) {
                setActiveProfileId(profiles[0].id);
            }
        }
    }, [profiles, activeProfileId, setActiveProfileId]);

    const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

    const addProfile = (profileData) => {
        const newProfile = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            wishes: [],
            theme: "classic",
            ...profileData
        };
        setProfiles(prev => [...prev, newProfile]);
        setActiveProfileId(newProfile.id); // Immediate switch okay
        return newProfile;
    };

    const updateProfile = (id, updates) => {
        setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteProfile = (id) => {
        setProfiles(prev => prev.filter(p => p.id !== id));
        // Active ID cleanup handled by useEffect
    };

    const switchProfile = (id) => {
        if (profiles.find(p => p.id === id)) {
            setActiveProfileId(id);
        }
    };

    const nextProfile = () => {
        if (profiles.length <= 1) return;
        const currentIndex = profiles.findIndex(p => p.id === activeProfileId);
        const nextIndex = (currentIndex + 1) % profiles.length;
        setActiveProfileId(profiles[nextIndex].id);
    };

    const prevProfile = () => {
        if (profiles.length <= 1) return;
        const currentIndex = profiles.findIndex(p => p.id === activeProfileId);
        const prevIndex = (currentIndex - 1 + profiles.length) % profiles.length;
        setActiveProfileId(profiles[prevIndex].id);
    };

    return (
        <ProfileContext.Provider value={{
            profiles,
            activeProfile,
            activeProfileId,
            addProfile,
            updateProfile,
            deleteProfile,
            switchProfile,
            nextProfile,
            prevProfile
        }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    return useContext(ProfileContext);
}
