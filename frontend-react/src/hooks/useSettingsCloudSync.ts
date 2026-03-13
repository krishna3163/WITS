/**
 * Hydrate settings from cloud on mount when user is logged in.
 * Schedule debounced sync to cloud on every settings change.
 */
import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { useAuthStore } from '../store/authStore';
import { loadSettingsFromCloud, scheduleSyncToCloud } from '../lib/settingsService';

export function useSettingsCloudSync(): void {
    const userId = useAuthStore((s) => s.user?.id ?? null);
    const settings = useSettingsStore((s) => s.settings);
    const updateSettings = useSettingsStore((s) => s.updateSettings);
    const hasHydrated = useRef(false);

    // Hydrate from cloud once when user becomes available
    useEffect(() => {
        if (!userId || hasHydrated.current) return;
        hasHydrated.current = true;
        loadSettingsFromCloud(userId).then((cloud) => {
            if (cloud) updateSettings(cloud);
        });
    }, [userId, updateSettings]);

    // Sync to cloud when settings change (debounced)
    useEffect(() => {
        if (!userId) return;
        scheduleSyncToCloud(userId, () => useSettingsStore.getState().settings);
    }, [userId, settings]);
}
