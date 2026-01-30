import { createContext, useContext, useEffect, useState, useRef, useMemo } from "react";
import { Howl, Howler } from "howler";
import { AUDIO_TRACKS } from "../data/audioTracks";
import { useSubscription } from "./SubscriptionContext";

const AudioContext = createContext();

export function AudioProvider({ children }) {
    const { isPro } = useSubscription();

    // Persistent State
    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem("lifebattery_audio_volume");
        return saved ? parseFloat(saved) : 0.5;
    });

    const [currentTrackId, setCurrentTrackId] = useState(() => {
        return localStorage.getItem("lifebattery_audio_track") || "none";
    });

    const [isMuted, setIsMuted] = useState(() => {
        return localStorage.getItem("lifebattery_audio_muted") === "true";
    });

    const [isPlaybackAllowed, setIsPlaybackAllowed] = useState(false);

    const enablePlayback = () => {
        if (!isPlaybackAllowed) {
            setIsPlaybackAllowed(true);
        }
    };

    const soundRef = useRef(null);
    const activeIdRef = useRef(currentTrackId); // Ref to track active ID in effects without dep loops

    // Persist Settings
    useEffect(() => {
        localStorage.setItem("lifebattery_audio_volume", volume);
        Howler.volume(isMuted ? 0 : volume);
    }, [volume, isMuted]);

    useEffect(() => {
        localStorage.setItem("lifebattery_audio_track", currentTrackId);
    }, [currentTrackId]);

    useEffect(() => {
        localStorage.setItem("lifebattery_audio_muted", isMuted);
        Howler.volume(isMuted ? 0 : volume);
    }, [isMuted]);

    // Track Switching Logic
    useEffect(() => {
        // If playback is not yet allowed (user hasn't entered dashboard), do nothing.
        // Unless we want to prepare it? No, explicit request was "play after entering".
        if (!isPlaybackAllowed) {
            return;
        }

        const track = AUDIO_TRACKS.find(t => t.id === currentTrackId);

        // Stop previous sound (Cross-fade)
        const prevSound = soundRef.current;
        if (prevSound) {
            prevSound.fade(volume, 0, 1000); // Fade out old
            setTimeout(() => {
                prevSound.stop();
                prevSound.unload(); // Good practice to unload
            }, 1000);
        }

        if (!track || track.id === 'none' || !track.src) {
            soundRef.current = null;
            return;
        }

        // Pro Check (Double check mainly for UI, functionality just stops if forced)
        if (!track.free && !isPro) {
            // Fallback or just stop? Let's reset to none if they lose pro status? 
            // Or just pause. For now, we assume UI handles gating, but here we enforce.
            // If strictly enforcing:
            // setCurrentTrackId('none'); 
            // return;
            // Let's allow "preview" or handle strictly.
            // Strict:
            if (!isPro) {
                setCurrentTrackId('none');
                return;
            }
        }

        const sound = new Howl({
            src: [track.src],
            loop: true,
            volume: 0, // Start silent for fade in
            html5: true, // Use streaming for larger files
            preload: true,
            onloaderror: (id, err) => console.warn("Audio load error:", err),
            onplayerror: (id, err) => {
                sound.once('unlock', () => {
                    sound.play();
                });
            }
        });

        soundRef.current = sound;
        sound.play();
        sound.fade(0, volume, 2000); // Fade in

        return () => {
            // Cleanup if component unmounts or effect re-runs?
            // If we stop here, we kill the crossfade if we re-run.
            // But we are handling "previous sound" logic at the start of the effect.
            // So valid to leave empty or minimal.
        };
    }, [currentTrackId, isPro, isPlaybackAllowed]); // Re-run if Track changes or Pro status changes (re-validate) or playback is enabled

    // Dynamic Volume Adjustment (without restarting track)
    useEffect(() => {
        if (soundRef.current && !isMuted) {
            soundRef.current.volume(volume);
        }
    }, [volume]);

    const selectTrack = (id) => {
        const track = AUDIO_TRACKS.find(t => t.id === id);
        if (track) {
            if (!track.free && !isPro) {
                // Return false to indicate failure/paywall needed
                return false;
            }
            setCurrentTrackId(id);
            return true;
        }
        return false;
    };

    const value = useMemo(() => ({
        volume,
        setVolume,
        currentTrackId,
        selectTrack,
        isMuted,
        setIsMuted,
        tracks: AUDIO_TRACKS,
        enablePlayback
    }), [volume, currentTrackId, isMuted, isPro, isPlaybackAllowed]);

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    return useContext(AudioContext);
}
