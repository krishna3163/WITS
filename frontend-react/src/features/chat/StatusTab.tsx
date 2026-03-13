import React, { useState } from 'react';
import {
    Plus, Camera, Video, MessageSquare,
    ChevronRight, Search, Zap, Flame,
    Globe, Users, Radio, MoreHorizontal,
    Heart, Play
} from 'lucide-react';
import classNames from 'classnames';

interface StatusUpdate {
    id: string;
    userName: string;
    userAvatar: string;
    type: 'photo' | 'video' | 'text';
    timeAgo: string;
    isUnread: boolean;
}

export default function StatusTab() {
    const [search, setSearch] = useState('');

    const statusUpdates: StatusUpdate[] = [
        { id: '1', userName: 'Sarah Jenkins', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', type: 'photo', timeAgo: '2m ago', isUnread: true },
        { id: '2', userName: 'Marcus Bold', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', type: 'video', timeAgo: '15m ago', isUnread: true },
        { id: '3', userName: 'Tech Insights', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech', type: 'text', timeAgo: '1h ago', isUnread: false },
        { id: '4', userName: 'Elena F.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', type: 'photo', timeAgo: '3h ago', isUnread: false },
    ];

    const trendingChannels = [
        { id: 't1', name: 'WITS Official', followers: '1.2M', icon: '⚡' },
        { id: 't2', name: 'Global Tech News', followers: '850K', icon: '🌐' },
        { id: 't3', name: 'Daily Design', followers: '420K', icon: '🎨' },
    ];

    return (
        <div className="h-full bg-[#f4f6f8] dark:bg-[#0A0A0A] overflow-y-auto pb-40 no-scrollbar">
            {/* Header */}
            <header className="px-6 pt-12 pb-6 bg-white dark:bg-black/40 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Updates</h1>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-primary-light transition-all"><Search size={22} /></button>
                        <button className="w-10 h-10 rounded-2xl bg-primary-light text-white flex items-center justify-center shadow-lg shadow-primary-light/20"><Plus size={22} /></button>
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {['All', 'Status', 'Channels', 'Communities'].map((tab, i) => (
                        <button
                            key={tab}
                            className={classNames(
                                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border",
                                i === 0
                                    ? "bg-primary-light text-white border-transparent shadow-lg shadow-primary-light/10"
                                    : "bg-transparent text-gray-400 border-gray-100 dark:border-gray-800 hover:border-primary-light/30"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <div className="px-6 py-8 space-y-10">
                {/* Status Horizontal Scroller (Snapchat Style) */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Status</h3>
                        <button className="text-[10px] font-bold text-primary-light uppercase tracking-widest flex items-center gap-1 group">
                            View More <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {/* My Status Card */}
                        <div className="flex flex-col items-center gap-2 group cursor-pointer shrink-0">
                            <div className="relative">
                                <div className="w-[72px] h-104 bg-white dark:bg-[#1A1C1E] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[28px] p-1 shadow-sm overflow-hidden flex flex-col items-center justify-center text-gray-400 hover:border-primary-light transition-all">
                                    <div className="w-10 h-10 bg-primary-light/10 rounded-2xl flex items-center justify-center text-primary-light">
                                        <Plus size={20} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-tighter mt-2">Add</span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-light text-white flex items-center justify-center border-2 border-white dark:border-black">
                                    <Camera size={12} />
                                </div>
                            </div>
                            <span className="text-[10px] font-bold dark:text-gray-300">My Status</span>
                        </div>

                        {statusUpdates.map(status => (
                            <div key={status.id} className="flex flex-col items-center gap-2 group cursor-pointer shrink-0 animate-in fade-in zoom-in-95 duration-500">
                                <div className={classNames(
                                    "p-[3px] rounded-[30px] border-2 transition-all group-hover:scale-105 active:scale-95",
                                    status.isUnread ? "border-primary-light" : "border-gray-100 dark:border-gray-800"
                                )}>
                                    <div className="w-[68px] h-96 rounded-[26px] bg-gray-200 dark:bg-gray-800 overflow-hidden relative shadow-lg">
                                        <img src={status.userAvatar} alt="" className="w-full h-full object-cover opacity-80" />
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2">
                                            {status.type === 'video' ? <Play size={12} className="text-white fill-white" /> : null}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold dark:text-gray-300 truncate w-16 text-center">{status.userName.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Updates List (WhatsApp Style) */}
                <section>
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Channel Updates</h3>
                    <div className="bg-white dark:bg-[#1A1C1E] rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                        {trendingChannels.map((channel, i) => (
                            <div key={channel.id} className={classNames(
                                "p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer",
                                i !== trendingChannels.length - 1 && "border-b border-gray-50 dark:border-gray-800/50"
                            )}>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                                        {channel.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="font-black text-gray-900 dark:text-white leading-tight">{channel.name}</h4>
                                            <Zap size={14} className="text-amber-500 fill-amber-500" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 tracking-widest mt-0.5 uppercase">{channel.followers} Followers</p>
                                    </div>
                                </div>
                                <button className="px-5 py-2.5 bg-primary-light/10 text-primary-light rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-light hover:text-white transition-all">
                                    Follow
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Trending Posts (Community Feed) */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Flame size={18} className="text-orange-500" />
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Trending Now</h3>
                    </div>
                    <div className="space-y-4">
                        {[1, 2].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#1A1C1E] p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500 overflow-hidden shadow-lg"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=comm${i}`} alt="" /></div>
                                    <div>
                                        <p className="text-xs font-black dark:text-white uppercase tracking-widest">r/WebDevelopers</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">Featured in Community</p>
                                    </div>
                                </div>
                                <h4 className="text-lg font-black text-gray-900 dark:text-white mb-2 leading-snug">The future of WITS Super App is actually coming together!</h4>
                                <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 font-medium">
                                    Check out our latest architectural changes for the communities and hierarchical groups...
                                </p>
                                <div className="mt-4 flex gap-4">
                                    <div className="flex items-center gap-1.5 text-gray-400"><Heart size={16} /> <span className="text-[11px] font-black">1.2K</span></div>
                                    <div className="flex items-center gap-1.5 text-gray-400"><MessageSquare size={16} /> <span className="text-[11px] font-black">245</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
