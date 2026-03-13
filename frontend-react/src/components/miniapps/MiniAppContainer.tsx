import React, { useState } from 'react';
import {
    X, Minus, ChevronLeft, ChevronRight,
    RefreshCw, ExternalLink, Star,
    MoreVertical, Share2, Globe, Bookmark
} from 'lucide-react';
import { useMiniAppStore } from '../../store/miniAppStore';
import classNames from 'classnames';

export default function MiniAppContainer() {
    const {
        openApps, activeAppId, closeApp, setActiveApp,
        isMaximized, setIsMaximized, favorites, toggleFavorite
    } = useMiniAppStore();

    const [reloading, setReloading] = useState<Record<string, boolean>>({});

    if (openApps.length === 0) return null;

    const activeApp = openApps.find(a => a.id === activeAppId) || openApps[0];
    const isFav = favorites.some(a => a.id === activeApp.id);

    const handleReload = (id: string) => {
        setReloading(prev => ({ ...prev, [id]: true }));
        setTimeout(() => setReloading(prev => ({ ...prev, [id]: false })), 600);
    };

    return (
        <div className={classNames(
            "fixed inset-0 z-[100] transition-all duration-500 flex flex-col bg-black/40 backdrop-blur-md",
            isMaximized ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
        )}>
            {/* Super App Shell */}
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#0A0A0A] overflow-hidden m-0 md:m-6 md:rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/10 relative">

                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-light via-blue-400 to-indigo-500" />

                {/* Header / Navigation Bar */}
                <div className="bg-white/95 dark:bg-[#1A1C1E]/95 backdrop-blur-md px-4 pt-10 pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 shrink-0 z-20">
                    <button
                        onClick={() => setIsMaximized(false)}
                        className="p-2.5 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:scale-105 transition-transform"
                        title="Minimize"
                    >
                        <Minus size={20} />
                    </button>

                    {/* App Tabs Scrollable */}
                    <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1">
                        {openApps.map(app => (
                            <button
                                key={app.id}
                                onClick={() => setActiveApp(app.id)}
                                className={classNames(
                                    "flex items-center gap-2.5 px-4 py-2 rounded-2xl text-[13px] font-bold whitespace-nowrap transition-all border shrink-0",
                                    activeAppId === app.id
                                        ? "bg-primary-light text-white border-transparent shadow-lg shadow-primary-light/30"
                                        : "bg-gray-50 dark:bg-white/5 border-transparent text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10"
                                )}
                            >
                                <div className={classNames(
                                    "w-5 h-5 rounded-lg flex items-center justify-center text-[10px]",
                                    activeAppId === app.id ? "bg-white/20" : "bg-primary-light text-white"
                                )}>
                                    {app.name[0]}
                                </div>
                                {app.name}
                                <span
                                    onClick={(e) => { e.stopPropagation(); closeApp(app.id); }}
                                    className="hover:bg-black/10 dark:hover:bg-white/10 p-1 rounded-lg ml-1 transition-colors"
                                >
                                    <X size={14} />
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1.5 pl-2 border-l border-gray-100 dark:border-gray-800 ml-2">
                        <button
                            onClick={() => toggleFavorite(activeApp)}
                            className={classNames(
                                "p-2.5 rounded-2xl transition-all",
                                isFav ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                            )}
                        >
                            <Star size={20} fill={isFav ? "currentColor" : "none"} strokeWidth={2.5} />
                        </button>
                        <button className="p-2.5 rounded-2xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5">
                            <Share2 size={20} />
                        </button>
                        <button className="hidden sm:block p-2.5 rounded-2xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>

                {/* Address/Status Bar */}
                <div className="bg-white dark:bg-[#1A1C1E] px-4 py-2 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 text-[11px] font-medium text-gray-400">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-full flex-1 min-w-0">
                        <Globe size={12} className="shrink-0" />
                        <span className="truncate opacity-60 font-mono tracking-tight">{activeApp.url}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold uppercase tracking-widest text-[9px]">
                        Secure
                    </div>
                </div>

                {/* Content Viewport */}
                <div className="flex-1 relative bg-white">
                    {openApps.map(app => (
                        <div
                            key={app.id}
                            className={classNames(
                                "absolute inset-0 transition-opacity duration-300",
                                activeAppId === app.id ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                            )}
                        >
                            {!reloading[app.id] && (
                                <iframe
                                    src={app.url}
                                    className="w-full h-full border-none"
                                    title={app.name}
                                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                                />
                            )}
                            {reloading[app.id] && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#121212] z-20">
                                    <div className="w-16 h-16 relative">
                                        <div className="absolute inset-0 border-4 border-primary-light/20 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-primary-light border-t-transparent rounded-full animate-spin" />
                                    </div>
                                    <p className="mt-6 text-gray-500 font-black uppercase tracking-widest text-[10px]">Refreshing {app.name}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom Browser Controls */}
                <div className="h-16 bg-white/95 dark:bg-[#1A1C1E]/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 flex items-center justify-between px-10 shrink-0">
                    <div className="flex items-center gap-8">
                        <button className="p-2 text-gray-400 hover:text-primary-light transition-colors" title="Back">
                            <ChevronLeft size={28} strokeWidth={2.5} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-primary-light transition-colors" title="Forward">
                            <ChevronRight size={28} strokeWidth={2.5} />
                        </button>
                    </div>

                    <button
                        onClick={() => handleReload(activeApp.id)}
                        className={classNames(
                            "w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:bg-primary-light hover:text-white transition-all shadow-sm",
                            reloading[activeApp.id] && "animate-spin"
                        )}
                    >
                        <RefreshCw size={22} />
                    </button>

                    <div className="flex items-center gap-8 text-gray-400">
                        <button
                            onClick={() => window.open(activeApp.url, '_blank')}
                            className="p-2 hover:text-primary-light transition-colors"
                            title="Open in Browser"
                        >
                            <ExternalLink size={24} />
                        </button>
                        <button
                            onClick={() => toggleFavorite(activeApp)}
                            className={classNames("p-2 transition-colors", isFav ? "text-yellow-500" : "hover:text-primary-light")}
                        >
                            <Bookmark size={24} fill={isFav ? "currentColor" : "none"} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Global Actions Overlay Close (Mobile Only) */}
            <div className="md:hidden fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 animate-in slide-in-from-bottom-8">
                <button
                    onClick={() => closeApp(activeApp.id)}
                    className="h-14 px-8 rounded-full bg-red-500 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-red-500/40 flex items-center gap-2"
                >
                    <X size={20} /> Close App
                </button>
            </div>
        </div>
    );
}
