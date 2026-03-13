import React, { useState } from 'react';
import {
    ChevronLeft, Users, Image as ImageIcon, Link as LinkIcon,
    FileText, Mic, Star, BellOff, Archive,
    Trash2, LogOut, Shield, UserPlus, QrCode,
    Search, Filter, CheckCircle, MoreVertical,
    Lock, Share2, Pin
} from 'lucide-react';
import classNames from 'classnames';

interface ChatSettingsProps {
    chat: any;
    onBack: () => void;
}

export default function ChatSettings({ chat, onBack }: ChatSettingsProps) {
    const [activeTab, setActiveTab] = useState<'info' | 'media' | 'members'>('info');

    const MOCK_MEMBERS = [
        { id: '1', name: 'Alex Rivera', role: 'owner', online: true },
        { id: '2', name: 'Sarah Chen', role: 'admin', online: false },
        { id: '3', name: 'Marco Rossi', role: 'sub-admin', online: true },
        { id: '4', name: 'Yuki Tanaka', role: 'member', online: false },
        { id: '5', name: 'John Doe', role: 'member', online: true },
    ];

    const ROLE_COLORS: Record<string, string> = {
        owner: 'bg-red-500 text-white',
        admin: 'bg-primary-light text-white',
        'sub-admin': 'bg-amber-500 text-white',
        member: 'bg-gray-100 dark:bg-white/10 text-gray-400'
    };

    return (
        <div className="flex flex-col h-full bg-[#f4f6f8] dark:bg-[#0A0A0A] overflow-hidden">
            {/* Header */}
            <div className="bg-white dark:bg-black/40 backdrop-blur-xl px-4 pt-12 pb-4 shrink-0 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-primary-light">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-black dark:text-white uppercase tracking-widest text-[12px]">Group Info</h1>
                </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white dark:bg-[#1A1C1E] px-6 py-8 flex flex-col items-center border-b border-gray-100 dark:border-gray-800">
                <div className="relative group mb-4">
                    <div className="w-32 h-32 rounded-[48px] bg-gradient-to-tr from-primary-light to-blue-400 flex items-center justify-center text-white text-5xl font-black shadow-2xl relative overflow-hidden">
                        {chat.name?.[0]?.toUpperCase() || 'G'}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                            <ImageIcon size={32} />
                        </div>
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center border border-gray-50 flex items-center justify-center">
                        <QrCode size={20} className="text-primary-light" />
                    </button>
                </div>
                <h2 className="text-2xl font-black dark:text-white mb-1">{chat.name || 'WITS Group'}</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Group · {MOCK_MEMBERS.length} Participants</p>

                <div className="flex gap-3">
                    <button className="flex-1 px-8 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl flex flex-col items-center gap-1 group">
                        <UserPlus size={20} className="text-gray-400 group-hover:text-primary-light transition-colors" />
                        <span className="text-[9px] font-black uppercase text-gray-400">Add</span>
                    </button>
                    <button className="flex-1 px-8 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl flex flex-col items-center gap-1 group">
                        <Search size={20} className="text-gray-400 group-hover:text-primary-light transition-colors" />
                        <span className="text-[9px] font-black uppercase text-gray-400">Search</span>
                    </button>
                    <button className="flex-1 px-8 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl flex flex-col items-center gap-1 group">
                        <Share2 size={20} className="text-gray-400 group-hover:text-primary-light transition-colors" />
                        <span className="text-[9px] font-black uppercase text-gray-400">Share</span>
                    </button>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
                {/* Navigation */}
                <div className="flex justify-around border-b border-gray-50 dark:border-gray-800/50 bg-white/50 dark:bg-black/20 backdrop-blur-sm sticky top-0 z-10">
                    {['info', 'media', 'members'].map((t: any) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={classNames(
                                "flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                                activeTab === t ? "text-primary-light" : "text-gray-400"
                            )}
                        >
                            {t}
                            {activeTab === t && <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-primary-light rounded-full" />}
                        </button>
                    ))}
                </div>

                {activeTab === 'info' && (
                    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Description */}
                        <div>
                            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-2">Description</h3>
                            <div className="p-5 bg-white dark:bg-[#1A1C1E] rounded-[32px] border border-gray-100 dark:border-gray-800 text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed">
                                Welcome to the official WITS development group. This is where the magic happens.
                                Rule #1: No spam. Rule #2: Stay Awesome.
                            </div>
                        </div>

                        {/* Settings Groups */}
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-2">Settings</h3>
                            <div className="bg-white dark:bg-[#1A1C1E] rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                                {[
                                    { icon: BellOff, label: 'Mute Notifications', action: true, color: 'text-amber-500 bg-amber-50' },
                                    { icon: Star, label: 'Starred Messages', value: '12', color: 'text-yellow-500 bg-yellow-50' },
                                    { icon: Archive, label: 'Archive Group', action: true, color: 'text-blue-500 bg-blue-50' },
                                    { icon: Lock, label: 'Privacy & Permissions', sub: 'Admin only', color: 'text-indigo-500 bg-indigo-50' },
                                    { icon: Shield, label: 'Encryption Status', sub: 'End-to-end Active', color: 'text-emerald-500 bg-emerald-50' },
                                ].map((item, i, arr) => (
                                    <button key={i} className={classNames(
                                        "w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors",
                                        i !== arr.length - 1 && "border-b border-gray-50 dark:border-gray-800/50"
                                    )}>
                                        <div className="flex items-center gap-4">
                                            <div className={classNames("w-10 h-10 rounded-xl flex items-center justify-center", item.color)}>
                                                <item.icon size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-gray-800 dark:text-gray-100 text-[14px]">{item.label}</p>
                                                {item.sub && <p className="text-[10px] text-gray-400 uppercase font-black">{item.sub}</p>}
                                            </div>
                                        </div>
                                        {item.value ? <span className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-[10px] font-black text-gray-500">{item.value}</span> : <ChevronLeft className="rotate-180 text-gray-300" size={18} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dangerous Actions */}
                        <div className="space-y-3 pt-6">
                            <button className="w-full py-4 bg-white dark:bg-white/5 border border-red-500/20 text-red-500 rounded-[32px] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                <Trash2 size={16} /> Hide Group Content
                            </button>
                            <button className="w-full py-4 bg-red-500 text-white rounded-[32px] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-red-500/20 active:scale-95 transition-all">
                                <LogOut size={16} /> Exit Group
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Filters */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                            {['Images', 'Videos', 'Docs', 'Links', 'Voice'].map(f => (
                                <button key={f} className="px-5 py-2.5 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary-light hover:border-primary-light/30 transition-all shadow-sm">
                                    {f}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl relative overflow-hidden group border border-gray-100 dark:border-gray-800">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                        <span className="text-[8px] font-black text-white uppercase">Dec 2026</span>
                                    </div>
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon size={24} className="text-gray-400 opacity-30" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-[#1A1C1E] rounded-[32px] border border-gray-100 dark:border-gray-800 overflow-hidden divide-y divide-gray-50 dark:divide-gray-800/50">
                            {[
                                { title: 'project_blueprint.pdf', sub: '12 MB', icon: FileText, color: 'text-red-500' },
                                { title: 'https://insforge.com/docs', sub: 'Web Link', icon: LinkIcon, color: 'text-blue-500' },
                                { title: 'voice_memo_001.mp3', sub: '2:45', icon: Mic, color: 'text-emerald-500' }
                            ].map((doc, idx) => (
                                <div key={idx} className="p-5 flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className={classNames("w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-gray-800", doc.color)}>
                                            <doc.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[14px] text-gray-800 dark:text-gray-100 truncate w-40">{doc.title}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{doc.sub}</p>
                                        </div>
                                    </div>
                                    <ChevronLeft className="rotate-180 text-gray-300" size={18} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search members..."
                                className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-light/50 font-medium text-sm"
                            />
                        </div>

                        <div className="space-y-4">
                            {MOCK_MEMBERS.map((m) => (
                                <div key={m.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-black text-gray-500 group-hover:scale-105 transition-transform shadow-sm">
                                                {m.name[0]}
                                            </div>
                                            {m.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-[15px] dark:text-gray-100">{m.name}</p>
                                                {m.role !== 'member' && (
                                                    <span className={classNames("px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm", ROLE_COLORS[m.role])}>
                                                        {m.role}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400">Available at 12:30 PM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-gray-400"><MoreVertical size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="mt-8 w-full py-5 bg-primary-light/10 text-primary-light rounded-[32px] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 border border-primary-light/20 hover:bg-primary-light hover:text-white transition-all">
                            <UserPlus size={18} /> Add More Members
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
