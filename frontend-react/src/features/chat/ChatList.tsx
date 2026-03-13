import React, { useState } from 'react';
import {
    Search, Plus, Filter, Pin,
    VolumeX, Trash2, CheckCircle2,
    Users, Radio, MessageSquare, ChevronDown
} from 'lucide-react';
import classNames from 'classnames';
import { useChatStore } from '../../store/chatStore';

interface ChatListProps {
    conversations: any[];
    onSelect: (chat: any) => void;
    activeChatId?: number | string;
}

export default function ChatList({ conversations, onSelect, activeChatId }: ChatListProps) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'groups' | 'channels'>('all');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { typingUsers } = useChatStore();

    const filtered = conversations.filter((c: any) => {
        const matchesSearch = (c.name || '').toLowerCase().includes(search.toLowerCase());
        if (filter === 'all') return matchesSearch;
        if (filter === 'groups') return matchesSearch && c.is_group;
        if (filter === 'channels') return matchesSearch && c.is_channel;
        return matchesSearch;
    });

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black overflow-hidden relative">
            {/* Header */}
            <header className="px-6 pt-12 pb-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <h1 className="text-[32px] font-black tracking-tight text-gray-900 dark:text-white">Chats</h1>
                        <div className="px-2 py-0.5 rounded-lg bg-red-400/10 text-red-500 text-[10px] font-black">
                            {conversations.length} TOTAL
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-primary-light transition-all active:scale-95"
                        >
                            <Plus size={22} className={classNames("transition-transform", isMenuOpen && "rotate-45")} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1A1C1E] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 py-2 animate-in zoom-in-95 duration-200">
                                <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <MessageSquare size={18} className="text-primary-light" />
                                    <span className="text-xs font-bold dark:text-gray-200">New Private Chat</span>
                                </button>
                                <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <Users size={18} className="text-emerald-500" />
                                    <span className="text-xs font-bold dark:text-gray-200">Create New Group</span>
                                </button>
                                <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <Radio size={18} className="text-red-500" />
                                    <span className="text-xs font-bold dark:text-gray-200">Create Channel</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 group-focus-within:text-primary-light transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search chats, groups..."
                            className="w-full bg-gray-100 dark:bg-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-light/30 transition-all font-medium text-sm dark:text-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 mt-4">
                    {[
                        { id: 'all', label: 'All', icon: MessageSquare },
                        { id: 'groups', label: 'Groups', icon: Users },
                        { id: 'channels', label: 'Channels', icon: Radio },
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setFilter(btn.id as any)}
                            className={classNames(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border",
                                filter === btn.id
                                    ? "bg-primary-light text-white border-transparent shadow-lg shadow-primary-light/20"
                                    : "bg-transparent text-gray-400 border-gray-100 dark:border-gray-800 hover:border-primary-light/30 hover:text-primary-light"
                            )}
                        >
                            <btn.icon size={12} />
                            {btn.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* List */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                {filtered.map((chat: any, i: number) => {
                    const isActive = chat.id === activeChatId;
                    const isPinned = i < 2;
                    const unread = i === 1 ? 5 : (i === 3 ? 12 : 0);
                    const isChannel = chat.is_channel || i === 3;
                    const isTyping = (typingUsers[chat.id] || []).length > 0;

                    return (
                        <div
                            key={chat.id}
                            onClick={() => onSelect(chat)}
                            className={classNames(
                                "group relative px-6 py-4 cursor-pointer transition-all active:scale-[0.98]",
                                isActive ? "bg-primary-light/5 dark:bg-primary-light/10" : "hover:bg-gray-50 dark:hover:bg-white/5"
                            )}
                        >
                            <div className="relative flex items-center gap-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className={classNames(
                                        "w-14 h-14 rounded-2xl bg-gradient-to-tr overflow-hidden shadow-sm flex items-center justify-center font-black text-xl transition-transform group-hover:scale-105",
                                        isChannel
                                            ? "from-red-500 to-orange-500 text-white"
                                            : "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-500"
                                    )}>
                                        {isChannel ? <Radio size={24} /> : chat.name?.[0]?.toUpperCase() || 'P'}
                                    </div>
                                    {unread > 0 && (
                                        <div className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-black shadow-lg shadow-red-500/30">
                                            {unread}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 truncate flex items-center gap-1.5">
                                            {isChannel ? "WITS News Official" : (chat.name || 'Conversation')}
                                            {isPinned && <Pin size={10} className="text-primary-light rotate-45" fill="currentColor" />}
                                            {isChannel && <CheckCircle2 size={12} className="text-blue-500" fill="currentColor" />}
                                        </h3>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                            {i === 0 ? 'Just Now' : '2:30 PM'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        {isTyping ? (
                                            <p className="text-sm text-primary-light truncate font-black animate-pulse uppercase tracking-widest text-[9px]">
                                                Typing...
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate font-medium pr-4">
                                                {isChannel ? "New Super App update available!" : "Hey, check out the new design!"}
                                            </p>
                                        )}
                                        {i === 1 && <VolumeX size={12} className="text-gray-300" />}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="absolute top-0 right-0 h-full flex opacity-0 group-hover:opacity-100 transition-all translate-x-12 group-hover:translate-x-0">
                                <button className="bg-gray-100 dark:bg-gray-800 px-6 h-full flex items-center justify-center text-gray-500 hover:text-red-500"><Trash2 size={20} /></button>
                                <button className="bg-primary-light px-6 h-full flex items-center justify-center text-white"><Pin size={20} /></button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                <button className="w-full py-4 bg-primary-light text-white rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-primary-light/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                    <Plus size={18} /> New Conversation
                </button>
            </div>
        </div>
    );
}
