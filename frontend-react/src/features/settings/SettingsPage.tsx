import React, { useState, useMemo } from 'react';
import {
    Bell, Shield, Link2, Settings, Palette, Type, Home, Droplets,
    MessageSquare, Radio, MessageCircle, Zap, UserCircle, HardDrive,
    BellRing, Image, Users, Activity, Monitor, Gauge, Lock, Code2,
    Search, ChevronLeft, RotateCcw, X, Check
} from 'lucide-react';
import NotificationSettings from './components/NotificationSettings';
import PrivacySettings from './components/PrivacySettings';
import LinkSettings from './components/LinkSettings';
import GeneralSettings from './components/GeneralSettings';
import ColorSettings from './components/ColorSettings';
import FontSettings from './components/FontSettings';
import HomeScreenSettings from './components/HomeScreenSettings';
import LiquidGlassSettings from './components/LiquidGlassSettings';
import ChatSettings from './components/ChatSettings';
import StatusSettings from './components/StatusSettings';
import ConversationSettings from './components/ConversationSettings';
import MessagingSettings from './components/MessagingSettings';
import AccountSettings from './components/AccountSettings';
import StorageSettings from './components/StorageSettings';
import MediaSettings from './components/MediaSettings';
import GroupSettings from './components/GroupSettings';
import StatusFeatureSettings from './components/StatusFeatureSettings';
import AppearanceSettings from './components/AppearanceSettings';
import PerformanceSettings from './components/PerformanceSettings';
import SecuritySettings from './components/SecuritySettings';
import DeveloperSettings from './components/DeveloperSettings';
import { useSettingsStore } from '../../store/settingsStore';

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS CATEGORIES REGISTRY — 22 sections in order (MBWhatsApp-style)
// ─────────────────────────────────────────────────────────────────────────────

interface SettingsCategoryDef {
    id: string;
    label: string;
    icon: React.FC<{ size?: number }>;
    color: string;
    bgColor: string;
    description: string;
    badge?: string;
    component: React.FC;
}

const CATEGORIES: SettingsCategoryDef[] = [
    {
        id: 'notifications', label: 'Notification Preferences', icon: Bell,
        color: 'text-amber-400', bgColor: 'bg-amber-500/15',
        description: 'Alerts, bubbles, event tracking, suppression',
        component: NotificationSettings,
    },
    {
        id: 'privacy', label: 'Privacy and Security', icon: Shield,
        color: 'text-green-400', bgColor: 'bg-green-500/15',
        description: 'Online status, read receipts, anti-delete, calls',
        component: PrivacySettings,
    },
    {
        id: 'links', label: 'Links and Browser', icon: Link2,
        color: 'text-teal-400', bgColor: 'bg-teal-500/15',
        description: 'In-app browser, TikTok viewer, media downloader',
        component: LinkSettings,
    },
    {
        id: 'general', label: 'General Configuration', icon: Settings,
        color: 'text-slate-400', bgColor: 'bg-slate-500/15',
        description: 'Text size, DPI, language, animations, beta',
        component: GeneralSettings,
    },
    {
        id: 'colors', label: 'Color Customization', icon: Palette,
        color: 'text-pink-400', bgColor: 'bg-pink-500/15',
        description: 'Primary, gradients, wallpaper',
        component: ColorSettings,
    },
    {
        id: 'fonts', label: 'Fonts and Icons', icon: Type,
        color: 'text-purple-400', bgColor: 'bg-purple-500/15',
        description: 'Typography, app name, launcher icon',
        component: FontSettings,
    },
    {
        id: 'homescreen', label: 'Home Screen Settings', icon: Home,
        color: 'text-rose-400', bgColor: 'bg-rose-500/15',
        description: 'Header, tabs order, archived, floating buttons',
        component: HomeScreenSettings,
    },
    {
        id: 'liquidglass', label: 'Liquid Glass UI', icon: Droplets,
        color: 'text-sky-400', bgColor: 'bg-sky-500/15',
        description: 'iOS-style frosted glass, blur intensity', badge: 'iOS',
        component: LiquidGlassSettings,
    },
    {
        id: 'chat', label: 'Chat Interface', icon: MessageSquare,
        color: 'text-violet-400', bgColor: 'bg-violet-500/15',
        description: 'Groups separate, indicators, pinned chats (60)',
        component: ChatSettings,
    },
    {
        id: 'status', label: 'Status and Updates', icon: Radio,
        color: 'text-emerald-400', bgColor: 'bg-emerald-500/15',
        description: 'Blur, reactions, story jumping, sound, channels',
        component: StatusSettings,
    },
    {
        id: 'conversation', label: 'Conversation Screen', icon: MessageSquare,
        color: 'text-indigo-400', bgColor: 'bg-indigo-500/15',
        description: 'Bubble styles, font size, reactions',
        component: ConversationSettings,
    },
    {
        id: 'messaging', label: 'Advanced Messaging', icon: MessageCircle,
        color: 'text-blue-400', bgColor: 'bg-blue-500/15',
        description: 'Schedule, auto-reply, broadcast, templates', badge: 'PRO',
        component: MessagingSettings,
    },
    {
        id: 'account', label: 'Account Settings', icon: UserCircle,
        color: 'text-yellow-400', bgColor: 'bg-yellow-500/15',
        description: 'Biometrics, passkeys, multi-account, export data',
        component: AccountSettings,
    },
    {
        id: 'storage', label: 'Storage and Data', icon: HardDrive,
        color: 'text-orange-400', bgColor: 'bg-orange-500/15',
        description: 'Storage analyzer, proxy, upload quality',
        component: StorageSettings,
    },
    {
        id: 'notifcontrols', label: 'Notification Controls', icon: BellRing,
        color: 'text-amber-400', bgColor: 'bg-amber-500/15',
        description: 'Master notification toggles and rules',
        component: NotificationSettings,
    },
    {
        id: 'media', label: 'Media Features', icon: Image,
        color: 'text-rose-400', bgColor: 'bg-rose-500/15',
        description: '700MB uploads, HD images, view-once, status save',
        component: MediaSettings,
    },
    {
        id: 'groups', label: 'Group Management', icon: Users,
        color: 'text-cyan-400', bgColor: 'bg-cyan-500/15',
        description: 'Admin tools, auto welcome/rules, spam removal',
        component: GroupSettings,
    },
    {
        id: 'statusfeatures', label: 'Status Features', icon: Activity,
        color: 'text-emerald-400', bgColor: 'bg-emerald-500/15',
        description: 'HD statuses, download, deleted status viewer',
        component: StatusFeatureSettings,
    },
    {
        id: 'appearance', label: 'App Appearance', icon: Monitor,
        color: 'text-indigo-400', bgColor: 'bg-indigo-500/15',
        description: 'Themes, navigation bar, header and footer',
        component: AppearanceSettings,
    },
    {
        id: 'performance', label: 'Performance Optimization', icon: Gauge,
        color: 'text-lime-400', bgColor: 'bg-lime-500/15',
        description: 'Cache cleaner, lightweight mode, fast loading',
        component: PerformanceSettings,
    },
    {
        id: 'security', label: 'Security System', icon: Lock,
        color: 'text-red-400', bgColor: 'bg-red-500/15',
        description: 'App lock, spam detection, device protection',
        component: SecuritySettings,
    },
    {
        id: 'developer', label: 'Developer Tools', icon: Code2,
        color: 'text-gray-400', bgColor: 'bg-gray-500/15',
        description: 'Feature flags, debug mode, API override', badge: 'DEV',
        component: DeveloperSettings,
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SETTINGS PAGE
// ─────────────────────────────────────────────────────────────────────────────

const SettingsPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const { resetAll } = useSettingsStore();

    const activeConfig = useMemo(
        () => CATEGORIES.find((c) => c.id === activeCategory),
        [activeCategory]
    );

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return CATEGORIES;
        const q = searchQuery.toLowerCase();
        return CATEGORIES.filter(
            (c) => c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    const ActiveComponent = activeConfig?.component;

    // ── Detail View ─────────────────────────────────────────────────────────
    if (activeCategory && ActiveComponent) {
        const Icon = activeConfig!.icon;
        return (
            <div className="h-full flex flex-col bg-[#0a0a14]">
                <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-white/8 flex-shrink-0">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className="w-9 h-9 rounded-xl bg-white/8 text-white/60 hover:text-white hover:bg-white/12 flex items-center justify-center transition-all duration-200 flex-shrink-0"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${activeConfig!.bgColor} ${activeConfig!.color}`}>
                        <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-base font-bold text-white truncate">{activeConfig!.label}</h2>
                        <p className="text-xs text-white/40 truncate">{activeConfig!.description}</p>
                    </div>
                    {activeConfig!.badge && (
                        <span className="text-[9px] font-black uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded-full tracking-widest">
                            {activeConfig!.badge}
                        </span>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar pt-4 pb-8 px-4">
                    <ActiveComponent />
                </div>
            </div>
        );
    }

    // ── Category List View ───────────────────────────────────────────────────
    return (
        <div className="h-full flex flex-col bg-[#0a0a14]">
            <div className="flex-shrink-0 px-4 pt-5 pb-4">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
                        <p className="text-xs text-white/40 mt-0.5">{CATEGORIES.length} configuration modules</p>
                    </div>
                    <button
                        onClick={() => setShowResetConfirm(true)}
                        className="w-9 h-9 rounded-xl bg-white/8 text-white/40 hover:text-white flex items-center justify-center transition-all"
                        title="Reset all settings"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
                <div className="relative mt-3">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search settings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/8 border border-white/10 text-white rounded-2xl pl-9 pr-4 py-2.5 text-sm placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8">
                {filteredCategories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="text-4xl mb-3">🔍</div>
                        <p className="text-white/60 font-medium">No results for "{searchQuery}"</p>
                        <p className="text-white/30 text-sm mt-1">Try a different keyword</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2">
                        {filteredCategories.map((cat, idx) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/8 hover:border-white/15 transition-all duration-200 text-left active:scale-[0.98]"
                                    style={{ animationDelay: `${idx * 30}ms` }}
                                >
                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${cat.bgColor} ${cat.color}`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-white truncate">{cat.label}</p>
                                            {cat.badge && (
                                                <span className="text-[9px] font-black uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-full tracking-wider flex-shrink-0">
                                                    {cat.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-white/40 mt-0.5 truncate">{cat.description}</p>
                                    </div>
                                    <ChevronLeft size={16} className="text-white/20 group-hover:text-white/40 rotate-180 transition-colors flex-shrink-0" />
                                </button>
                            );
                        })}
                    </div>
                )}
                <div className="mt-8 text-center">
                    <p className="text-[11px] text-white/20 font-medium">WITS Super-App · Settings Engine v3.0</p>
                    <p className="text-[10px] text-white/10 mt-1">All settings stored locally & synced to cloud</p>
                </div>
            </div>
            {showResetConfirm && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50 px-4 pb-8">
                    <div className="w-full max-w-sm bg-[#1a1a2e] border border-white/10 rounded-3xl p-5 shadow-2xl">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center mx-auto mb-4">
                            <RotateCcw size={22} />
                        </div>
                        <h3 className="text-lg font-bold text-white text-center">Reset All Settings?</h3>
                        <p className="text-sm text-white/50 text-center mt-2">
                            This will restore all 22 settings categories to their default values. This cannot be undone.
                        </p>
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 py-3 rounded-2xl bg-white/8 text-white font-semibold text-sm hover:bg-white/12 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { resetAll(); setShowResetConfirm(false); }}
                                className="flex-1 py-3 rounded-2xl bg-red-500/80 text-white font-semibold text-sm hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={14} />
                                Reset All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
