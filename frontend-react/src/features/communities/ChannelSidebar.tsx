import React, { useState, useEffect } from 'react';
import {
    Hash, Volume2, Megaphone, Lock,
    Settings, Plus, ChevronDown, Users,
    Shield, Bell, Pin, Search
} from 'lucide-react';
import classNames from 'classnames';

interface CommunityChannel {
    id: string;
    name: string;
    type: 'text' | 'voice' | 'announcement';
    is_private?: boolean;
}

interface CommunityGroup {
    id: string;
    name: string;
}

interface ChannelSidebarProps {
    community: any;
    activeId: string | null;
    onSelect: (id: string, type: 'channel' | 'group') => void;
    onOpenSettings: () => void;
}

export default function ChannelSidebar({ community, activeId, onSelect, onOpenSettings }: ChannelSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState({
        channels: false,
        groups: false,
        voice: false
    });

    // Mock data for channels/groups within the community
    const channels: CommunityChannel[] = [
        { id: 'c1', name: 'announcements', type: 'announcement' },
        { id: 'c2', name: 'general-chat', type: 'text' },
        { id: 'c3', name: 'help-desk', type: 'text', is_private: true },
        { id: 'v1', name: 'Voice Lounge', type: 'voice' },
    ];

    const groups: CommunityGroup[] = [
        { id: 'g1', name: 'Development' },
        { id: 'g2', name: 'Design Team' },
    ];

    const ChannelItem = ({ item }: { item: CommunityChannel }) => {
        const Icon = item.type === 'voice' ? Volume2 : item.type === 'announcement' ? Megaphone : Hash;
        const isActive = activeId === item.id;

        return (
            <button
                onClick={() => onSelect(item.id, 'channel')}
                className={classNames(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg group transition-all mb-0.5",
                    isActive
                        ? "bg-primary-light/10 text-primary-light font-bold"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-gray-300"
                )}
            >
                <div className="shrink-0">
                    <Icon size={18} className={classNames(isActive ? "text-primary-light" : "text-gray-400 opacity-60")} />
                </div>
                <span className="truncate text-[13.5px] lowercase tracking-tight flex-1 text-left">{item.name}</span>
                {item.is_private && <Lock size={12} className="opacity-40" />}
                {isActive && <div className="w-1 h-4 bg-primary-light rounded-full" />}
            </button>
        );
    };

    return (
        <div className="w-60 h-full bg-[#f8f9fa] dark:bg-[#121417] flex flex-col border-r border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Community Header */}
            <header
                onClick={onOpenSettings}
                className="h-14 px-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
                <h2 className="font-black text-[13px] uppercase tracking-widest text-gray-900 dark:text-white truncate pr-2">
                    {community?.name || 'Community'}
                </h2>
                <ChevronDown size={14} className="text-gray-400" />
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-6">
                {/* Search in Community */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 opacity-40 group-focus-within:text-primary-light transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder="Jump to..."
                        className="w-full bg-white dark:bg-black/20 border border-gray-100 dark:border-gray-800 rounded-lg py-2 pl-9 pr-3 text-[11px] font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-primary-light/20 transition-all"
                    />
                </div>

                {/* Section: Channels */}
                <section>
                    <div className="flex items-center justify-between px-2 mb-2 group/title">
                        <button
                            onClick={() => setIsCollapsed({ ...isCollapsed, channels: !isCollapsed.channels })}
                            className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <ChevronDown size={12} className={classNames("transition-transform", isCollapsed.channels && "-rotate-90")} />
                            Text Channels
                        </button>
                        <Plus size={14} className="text-gray-400 cursor-pointer hover:text-primary-light opacity-0 group-hover/title:opacity-100 transition-opacity" />
                    </div>
                    {!isCollapsed.channels && (
                        <div>
                            {channels.filter(c => c.type !== 'voice').map(c => <ChannelItem key={c.id} item={c} />)}
                        </div>
                    )}
                </section>

                {/* Section: Voice Channels */}
                <section>
                    <div className="flex items-center justify-between px-2 mb-2 group/title">
                        <button
                            onClick={() => setIsCollapsed({ ...isCollapsed, voice: !isCollapsed.voice })}
                            className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <ChevronDown size={12} className={classNames("transition-transform", isCollapsed.voice && "-rotate-90")} />
                            Voice Lounges
                        </button>
                        <Plus size={14} className="text-gray-400 cursor-pointer hover:text-primary-light opacity-0 group-hover/title:opacity-100 transition-opacity" />
                    </div>
                    {!isCollapsed.voice && (
                        <div>
                            {channels.filter(c => c.type === 'voice').map(c => <ChannelItem key={c.id} item={c} />)}
                        </div>
                    )}
                </section>

                {/* Section: Discussion Groups */}
                <section>
                    <div className="flex items-center justify-between px-2 mb-2 group/title">
                        <button
                            onClick={() => setIsCollapsed({ ...isCollapsed, groups: !isCollapsed.groups })}
                            className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <ChevronDown size={12} className={classNames("transition-transform", isCollapsed.groups && "-rotate-90")} />
                            Discussion Groups
                        </button>
                        <Plus size={14} className="text-gray-400 cursor-pointer hover:text-primary-light opacity-0 group-hover/title:opacity-100 transition-opacity" />
                    </div>
                    {!isCollapsed.groups && (
                        <div className="space-y-0.5">
                            {groups.map(g => (
                                <button
                                    key={g.id}
                                    onClick={() => onSelect(g.id, 'group')}
                                    className={classNames(
                                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all",
                                        activeId === g.id ? "bg-emerald-500/10 text-emerald-500 font-bold" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                                    )}
                                >
                                    <Users size={18} className="opacity-40" />
                                    <span className="truncate text-[13.5px] flex-1 text-left">{g.name}</span>
                                    {activeId === g.id && <div className="w-1 h-4 bg-emerald-500 rounded-full" />}
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Bottom Profile / Quick Access */}
            <div className="p-4 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-xl bg-primary-light overflow-hidden shrink-0">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-black dark:text-gray-100 truncate">Alex Rivera</p>
                            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Connected</p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-primary-light hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all"><Settings size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
