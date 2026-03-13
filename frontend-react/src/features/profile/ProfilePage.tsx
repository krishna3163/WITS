import React, { useState } from 'react';
import {
    ChevronRight, Shield, Bell, Key,
    HelpCircle, LogOut, Settings as SettingsIcon,
    Wallet, Heart, Globe, Image,
    QrCode, Grid, Star, MessageSquare,
    EyeOff, UserMinus, ToggleLeft, ToggleRight,
    Search, Volume2, Lock, ChevronLeft,
    PhoneOff, VideoOff, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useResponsive } from '../../hooks/useResponsive';
import classNames from 'classnames';

type ProfileSection = 'main' | 'privacy' | 'notifications' | 'security' | 'calls';

interface SettingToggleProps {
    label: string;
    sub?: string;
    enabled: boolean;
    onToggle: () => void;
}

const SettingToggle = ({ label, sub, enabled, onToggle }: SettingToggleProps) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-gray-800/50">
        <div>
            <p className="font-bold text-[14px] text-gray-800 dark:text-gray-100">{label}</p>
            {sub && <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{sub}</p>}
        </div>
        <button onClick={onToggle} className="transition-all active:scale-90">
            {enabled ? (
                <div className="w-12 h-6 bg-primary-light rounded-full p-1 flex justify-end">
                    <div className="w-4 h-4 bg-white rounded-full shadow-lg transition-all" />
                </div>
            ) : (
                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-800 rounded-full p-1 flex justify-start">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
            )}
        </button>
    </div>
);

export default function ProfilePage() {
    const navigate = useNavigate();
    const { isExpanded } = useResponsive();
    const { user, logout } = useAuthStore();
    const [section, setSection] = useState<ProfileSection>('main');

    // UI Mock States
    const [privacy, setPrivacy] = useState({
        hideLastSeen: true,
        hideOnline: false,
        hideReadReceipts: true,
        hideProfilePhoto: false,
        restrictMessaging: true
    });

    const [notifs, setNotifs] = useState({
        mentions: true,
        keywords: false,
        previews: true,
        silent: false
    });

    const [calls, setCalls] = useState({
        voiceEnabled: true,
        videoEnabled: true
    });

    const renderHeader = (title: string) => (
        <div className="bg-white dark:bg-black/40 backdrop-blur-xl px-6 pt-12 pb-4 shrink-0 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
                <button onClick={() => setSection('main')} className="p-2 -ml-2 text-gray-400 hover:text-primary-light">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-black dark:text-white uppercase tracking-widest text-[12px]">{title}</h1>
            </div>
        </div>
    );

    if (section === 'privacy') return (
        <div className="h-full bg-[#f4f6f8] dark:bg-[#0A0A0A] overflow-hidden flex flex-col">
            {renderHeader('Privacy Settings')}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-white dark:bg-[#1A1C1E] rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Visibility</h3>
                    <SettingToggle
                        label="Hide Last Seen"
                        sub="Who can see your last online time"
                        enabled={privacy.hideLastSeen}
                        onToggle={() => setPrivacy({ ...privacy, hideLastSeen: !privacy.hideLastSeen })}
                    />
                    <SettingToggle
                        label="Hide Online Status"
                        sub="Hide currently active indicator"
                        enabled={privacy.hideOnline}
                        onToggle={() => setPrivacy({ ...privacy, hideOnline: !privacy.hideOnline })}
                    />
                    <SettingToggle
                        label="Read Receipts"
                        sub="Other users won't see blue checks"
                        enabled={privacy.hideReadReceipts}
                        onToggle={() => setPrivacy({ ...privacy, hideReadReceipts: !privacy.hideReadReceipts })}
                    />
                </div>

                <div className="bg-white dark:bg-[#1A1C1E] rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Connections</h3>
                    <SettingToggle
                        label="Restrict Messaging"
                        sub="Only contacts can message you"
                        enabled={privacy.restrictMessaging}
                        onToggle={() => setPrivacy({ ...privacy, restrictMessaging: !privacy.restrictMessaging })}
                    />
                    <button className="w-full mt-4 flex items-center justify-between py-2 text-red-500 hover:opacity-80 transition-opacity">
                        <div className="flex items-center gap-3">
                            <UserMinus size={18} />
                            <span className="font-bold text-[14px]">Blocked Contacts</span>
                        </div>
                        <span className="bg-red-100 dark:bg-red-900/20 px-2 py-0.5 rounded-lg text-[10px] font-black">12</span>
                    </button>
                </div>
            </div>
        </div>
    );

    if (section === 'notifications') return (
        <div className="h-full bg-[#f4f6f8] dark:bg-[#0A0A0A] overflow-hidden flex flex-col">
            {renderHeader('Notifications')}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-white dark:bg-[#1A1C1E] rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <SettingToggle
                        label="Mention Highlights"
                        sub="Always notify when @mentioned"
                        enabled={notifs.mentions}
                        onToggle={() => setNotifs({ ...notifs, mentions: !notifs.mentions })}
                    />
                    <SettingToggle
                        label="Message Previews"
                        sub="Show content in banner"
                        enabled={notifs.previews}
                        onToggle={() => setNotifs({ ...notifs, previews: !notifs.previews })}
                    />
                    <SettingToggle
                        label="Silent Notifications"
                        sub="No sound or vibration"
                        enabled={notifs.silent}
                        onToggle={() => setNotifs({ ...notifs, silent: !notifs.silent })}
                    />
                </div>
                <div className="bg-white dark:bg-[#1A1C1E] rounded-[32px] p-6 overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                    <button className="w-full flex items-center justify-between py-2 hover:opacity-80 transition-opacity">
                        <div className="flex items-center gap-3">
                            <Volume2 size={18} className="text-primary-light" />
                            <span className="font-bold text-[14px] dark:text-white">Custom Keyword Alerts</span>
                        </div>
                        <ChevronRight className="text-gray-300" size={18} />
                    </button>
                </div>
            </div>
        </div>
    );

    if (section === 'calls') return (
        <div className="h-full bg-[#f4f6f8] dark:bg-[#0A0A0A] overflow-hidden flex flex-col">
            {renderHeader('Call Settings')}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-white dark:bg-[#1A1C1E] rounded-[32px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                    <SettingToggle
                        label="Voice Calls"
                        sub="Enable incoming voice calls"
                        enabled={calls.voiceEnabled}
                        onToggle={() => setCalls({ ...calls, voiceEnabled: !calls.voiceEnabled })}
                    />
                    <SettingToggle
                        label="Video Calls"
                        sub="Enable incoming video calls"
                        enabled={calls.videoEnabled}
                        onToggle={() => setCalls({ ...calls, videoEnabled: !calls.videoEnabled })}
                    />
                </div>
                <p className="px-6 text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest text-center">
                    Toggling these off will prevent users from calling you directly. Group calls will still remain visible.
                </p>
            </div>
        </div>
    );

    return (
        <div className="h-full w-full bg-[#f4f6f8] dark:bg-[#0A0A0A] overflow-y-auto pb-24 scroll-smooth no-scrollbar">
            {/* ID Card */}
            <div className="bg-white dark:bg-[#1A1C1E] px-6 pt-20 pb-10 border-b border-gray-100 dark:border-gray-800">
                <div className={classNames("flex items-center gap-6", isExpanded && "max-w-3xl mx-auto")}>
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-[32px] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 group-hover:scale-105 transition-transform duration-500">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                                alt="Profile"
                                className="w-full h-full object-cover bg-primary-light/10"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center border border-gray-100 dark:border-gray-700">
                            <QrCode size={16} className="text-gray-500" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                            {user?.email?.split('@')[0] || 'Member'}
                        </h1>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
                            WITS ID: {user?.id?.slice(0, 8) || '2026_USER'}
                        </p>
                        <div className="mt-4 flex gap-2">
                            <span className="bg-emerald-400/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Verified</span>
                            <span className="bg-primary-light text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Pro Member</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={classNames("px-4 mt-6 space-y-6", isExpanded && "max-w-3xl mx-auto")}>
                {/* Tools */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'bg-emerald-500' },
                        { id: 'favorites', label: 'Favorites', icon: Star, color: 'bg-amber-500' },
                        { id: 'moments', label: 'My Moments', icon: Image, color: 'bg-blue-500' },
                        { id: 'stickers', label: 'Stickers', icon: Grid, color: 'bg-orange-500' },
                    ].map(tool => (
                        <button key={tool.id} className="flex flex-col items-center gap-2 group">
                            <div className={classNames("w-full aspect-square rounded-[24px] flex items-center justify-center text-white shadow-lg transition-all active:scale-90", tool.color)}>
                                <tool.icon size={24} />
                            </div>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{tool.label}</span>
                        </button>
                    ))}
                </div>

                {/* Settings Menus */}
                <div className="bg-white dark:bg-[#1A1C1E] rounded-[32px] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                    {[
                        { id: 'privacy', label: 'Privacy & Security', icon: Lock, color: 'bg-blue-100 text-blue-600' },
                        { id: 'notifications', label: 'Notifications', icon: Bell, color: 'bg-green-100 text-green-600' },
                        { id: 'calls', label: 'Call Settings', icon: PhoneOff, color: 'bg-orange-100 text-orange-600' },
                        { id: 'security', label: 'Account Security', icon: Key, color: 'bg-purple-100 text-purple-600' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSection(item.id as any)}
                            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b last:border-0 border-gray-50 dark:border-gray-800/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className={classNames("w-10 h-10 rounded-xl flex items-center justify-center", item.color)}>
                                    <item.icon size={20} />
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-200">{item.label}</span>
                            </div>
                            <ChevronRight size={18} className="text-gray-300" />
                        </button>
                    ))}
                </div>

                <div className="pt-4 pb-12 space-y-3">
                    <button onClick={logout} className="w-full h-16 bg-red-500 text-white rounded-[32px] font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-red-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                        <LogOut size={18} /> Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
