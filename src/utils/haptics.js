import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

export const triggerHaptic = async (style = ImpactStyle.Light) => {
    if (!isNative) return;
    try {
        await Haptics.impact({ style });
    } catch (e) {
        console.warn('Haptics not supported', e);
    }
};

export const triggerSelectionChange = async () => {
    if (!isNative) return;
    try {
        await Haptics.selectionStart();
        await Haptics.selectionChanged();
        await Haptics.selectionEnd();
    } catch (e) {
        // Ignore
    }
}
