import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, User, LogOut, Moon, Sun, Monitor } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import classNames from 'classnames';

import SearchPanel from './SearchPanel';

export default function GlobalHeader() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { settings, updateSettings } = useSettingsStore();
    const [showProfile, setShowProfile] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    return (
        <>
            <header className="h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-white shadow-lg shadow-primary-light/30">
                        <span className="font-bold text-xl">W</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowSearch(true)}
                        className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                    >
                        <Search size={20} />
                    </button>

                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors relative"
                        title="Notifications & settings"
                    >
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black" />
                    </button>

                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-2"
                    >
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:block">{user?.email?.split('@')[0]}</span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-light to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                    </button>
                </div>
            </header>

            {/* Profile Menu Popover */}
            {showProfile && (
                <div className="fixed top-20 right-6 z-50 w-72 bg-white dark:bg-[#1A1C1E] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-light to-blue-400 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                {user?.email?.[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white truncate">{user?.email?.split('@')[0]}</h3>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <div className="bg-primary-light/10 text-primary-light text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
                            Premium Plan
                        </div>
                    </div>

                    <div className="p-2">
                        <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Appearance</div>
                        <div className="flex gap-1 p-2">
                            {[
                                { key: 'light' as const, icon: Sun },
                                { key: 'dark' as const, icon: Moon },
                                { key: 'system' as const, icon: Monitor }
                            ].map(t => {
                                const Icon = t.icon;
                                return (
                                    <button
                                        key={t.key}
                                        onClick={() => updateSettings({ appearance: { theme: t.key } })}
                                        className={classNames(
                                            "flex-1 flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all",
                                            settings.appearance?.theme === t.key
                                                ? "bg-primary-light text-white shadow-md shadow-primary-light/30"
                                                : "bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        <Icon size={18} />
                                        <span className="text-[10px] font-bold capitalize">{t.key}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-2 pt-0 border-t border-gray-100 dark:border-gray-800 mt-2">
                        <button
                            onClick={() => { setShowProfile(false); navigate('/profile'); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                        >
                            <User size={18} className="text-gray-400" /> My Profile
                        </button>
                        <button
                            onClick={() => { setShowProfile(false); navigate('/settings'); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                        >
                            <Settings size={18} className="text-gray-400" /> Account Settings
                        </button>
                        <button
                            onClick={() => logout()}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm font-semibold"
                        >
                            <LogOut size={18} /> Sign Out
                        </button>
                    </div>
                </div>
            )}

            {showProfile && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowProfile(false)} />}

            <SearchPanel isOpen={showSearch} onClose={() => setShowSearch(false)} />
        </>
    );
}
