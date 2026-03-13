import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MiniApp {
    id: string;
    name: string;
    url: string;
    icon_url?: string;
    category?: string;
    description?: string;
}

interface MiniAppState {
    openApps: MiniApp[];
    activeAppId: string | null;
    isMaximized: boolean;
    recentlyUsed: MiniApp[];
    favorites: MiniApp[];
    launchApp: (app: MiniApp) => void;
    closeApp: (id: string) => void;
    setActiveApp: (id: string) => void;
    setIsMaximized: (max: boolean) => void;
    toggleFavorite: (app: MiniApp) => void;
    removeFromRecent: (id: string) => void;
}

export const useMiniAppStore = create<MiniAppState>()(
    persist(
        (set) => ({
            openApps: [],
            activeAppId: null,
            isMaximized: false,
            recentlyUsed: [],
            favorites: [],

            launchApp: (app) => set((state) => {
                // Add to recently used
                const filteredRecent = state.recentlyUsed.filter(a => a.id !== app.id);
                const newRecent = [app, ...filteredRecent].slice(0, 12);

                const exists = state.openApps.find(a => a.id === app.id);
                if (exists) return { activeAppId: app.id, isMaximized: true, recentlyUsed: newRecent };

                return {
                    openApps: [...state.openApps, app],
                    activeAppId: app.id,
                    isMaximized: true,
                    recentlyUsed: newRecent
                };
            }),

            closeApp: (id) => set((state) => {
                const openApps = state.openApps.filter(a => a.id !== id);
                let activeAppId = state.activeAppId;
                if (activeAppId === id) {
                    activeAppId = openApps.length > 0 ? openApps[openApps.length - 1].id : null;
                }
                return {
                    openApps,
                    activeAppId,
                    isMaximized: openApps.length > 0
                };
            }),

            setActiveApp: (id) => set({ activeAppId: id, isMaximized: true }),

            setIsMaximized: (max) => set({ isMaximized: max }),

            toggleFavorite: (app) => set((state) => {
                const isFav = state.favorites.find(a => a.id === app.id);
                if (isFav) {
                    return { favorites: state.favorites.filter(a => a.id !== app.id) };
                }
                return { favorites: [...state.favorites, app] };
            }),

            removeFromRecent: (id) => set((state) => ({
                recentlyUsed: state.recentlyUsed.filter(a => a.id !== id)
            })),
        }),
        {
            name: 'wits-miniapp-store',
            partialize: (state) => ({
                recentlyUsed: state.recentlyUsed,
                favorites: state.favorites
            }),
        }
    )
);
