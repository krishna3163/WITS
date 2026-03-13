/**
 * WITS Super-App Centralized Settings Service
 * Handles: local device cache (via zustand persist), cloud database sync (InsForge).
 * All settings reads go through the store; writes update store then sync to cloud.
 */

import { insforge } from './insforge';
import type { WitsSettings } from '../store/settingsStore';
import { DEFAULT_SETTINGS } from '../store/settingsStore';

const CLOUD_TABLE = 'wits_user_settings';
const SYNC_DEBOUNCE_MS = 800;

let syncTimeout: ReturnType<typeof setTimeout> | null = null;

export interface SettingsSyncResult {
    success: boolean;
    fromCloud: boolean;
    error?: string;
}

/**
 * Load user settings from InsForge. Returns null if not logged in or no row.
 */
export async function loadSettingsFromCloud(userId: string): Promise<WitsSettings | null> {
    try {
        const { data, error } = await insforge.database
            .from(CLOUD_TABLE)
            .select('settings')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            console.warn('[SettingsService] Cloud load error:', error.message);
            return null;
        }
        if (!data?.settings) return null;
        return mergeWithDefaults(data.settings as Record<string, unknown>) as WitsSettings;
    } catch (e) {
        console.warn('[SettingsService] Cloud load failed:', e);
        return null;
    }
}

/**
 * Persist current settings to InsForge. Upserts by user_id.
 */
export async function saveSettingsToCloud(userId: string, settings: WitsSettings): Promise<SettingsSyncResult> {
    try {
        const payload = {
            user_id: userId,
            settings: settings as unknown as Record<string, unknown>,
            updated_at: new Date().toISOString(),
        };

        const { data: existing } = await insforge.database
            .from(CLOUD_TABLE)
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

        if (existing) {
            const { error } = await insforge.database
                .from(CLOUD_TABLE)
                .update({ settings: payload.settings, updated_at: payload.updated_at })
                .eq('user_id', userId);
            if (error) {
                return { success: false, fromCloud: false, error: error.message };
            }
        } else {
            const { error } = await insforge.database
                .from(CLOUD_TABLE)
                .insert([{ user_id: userId, settings: payload.settings, updated_at: payload.updated_at }]);
            if (error) {
                return { success: false, fromCloud: false, error: error.message };
            }
        }
        return { success: true, fromCloud: false };
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return { success: false, fromCloud: false, error: message };
    }
}

/**
 * Debounced sync: call this after any setting change when user is logged in.
 */
export function scheduleSyncToCloud(userId: string | null, getSettings: () => WitsSettings): void {
    if (!userId) return;
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(async () => {
        syncTimeout = null;
        await saveSettingsToCloud(userId, getSettings());
    }, SYNC_DEBOUNCE_MS);
}

/**
 * Merge partial cloud payload with defaults (for forward compatibility).
 */
function mergeWithDefaults(partial: Record<string, unknown>): Record<string, unknown> {
    const defaults = DEFAULT_SETTINGS as unknown as Record<string, unknown>;
    const result = { ...defaults };
    for (const category of Object.keys(defaults)) {
        if (partial[category] && typeof partial[category] === 'object' && !Array.isArray(partial[category])) {
            result[category] = {
                ...(defaults[category] as Record<string, unknown>),
                ...(partial[category] as Record<string, unknown>),
            };
        }
    }
    return result;
}
