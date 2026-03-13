import React, { useState } from 'react';
import {
    ChevronLeft, MessageSquare, Phone, Video,
    MoreHorizontal, Shield, Star, Users,
    Radio, Image as ImageIcon, Search,
    UserPlus, Heart, AlertCircle
} from 'lucide-react';
import classNames from 'classnames';

interface FriendProfileProps {
    user: any;
    onBack: () => void;
    onStartChat: () => void;
}

export default function FriendProfile({ user, onBack, onStartChat }: FriendProfileProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'media' | 'mutual'>('overview');

    const MOCK_MUTUAL_GROUPS = [
        { id: '1', name: 'Design Team', members: 12 },
        { id: '2', name: 'WITS Early Adopters', members: 156 },
    ];

    const MOCK_MUTUAL_CHANNELS = [
        { id: '3', name: 'WITS Official News', followers: '12K' },
    ];

    return (
        <div className="flex flex-col h-full bg-[#f4f6f8] dark:bg-[#0A0A0A] overflow-hidden">
            {/* Header / Cover */}
            <div className="relative h-48 bg-gradient-to-br from-primary-light to-blue-600 shrink-0">
                <button
                    onClick={onBack}
                    className="absolute top-12 left-6 p-2 rounded-2xl bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-all z-10"
                >
                    <ChevronLeft size={24} />
                </button>
                <button className="absolute top-12 right-6 p-2 rounded-2xl bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-all z-10">
                    <MoreHorizontal size={24} />
                </button>

                {/* Profile Pic Overlap */}
                <div className="absolute -bottom-12 left-8">
                    <div className="w-24 h-24 rounded-[32px] border-4 border-[#f4f6f8] dark:border-[#0A0A0A] bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Friend'}`}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#f4f6f8] dark:border-[#0A0A0A]" />
                </div>
            </div>

            {/* Basic Info */}
            <div className="px-8 pt-16 pb-6 bg-white dark:bg-[#1A1C1E] border-b border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-black dark:text-white leading-tight">{user?.name || 'Alex Rivera'}</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">@alex_dev · Software Architect</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-primary-light border border-gray-100 dark:border-gray-800"><Heart size={20} /></button>
                        <button className="w-10 h-10 rounded-xl bg-primary-light text-white flex items-center justify-center shadow-lg shadow-primary-light/20"><UserPlus size={20} /></button>
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <button onClick={onStartChat} className="flex-1 py-4 bg-primary-light text-white rounded-[20px] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary-light/20 active:scale-95 transition-all">
                        <MessageSquare size={16} /> Message
                    </button>
                    <div className="flex gap-2">
                        <button className="w-14 h-14 rounded-[20px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30 active:scale-95 transition-all">
                            <Phone size={22} />
                        </button>
                        <button className="w-14 h-14 rounded-[20px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-900/30 active:scale-95 transition-all">
                            <Video size={22} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="sticky top-0 bg-white/80 dark:bg-[#1A1C1E]/80 backdrop-blur-xl flex justify-around border-b border-gray-50 dark:border-gray-800/50 z-20">
                    {['overview', 'media', 'mutual'].map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t as any)}
                            className={classNames(
                                "flex-1 py-4 text-[9px] font-black uppercase tracking-[0.3em] transition-all relative",
                                activeTab === t ? "text-primary-light" : "text-gray-400"
                            )}
                        >
                            {t}
                            {activeTab === t && <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-primary-light rounded-full" />}
                        </button>
                    ))}
                </div>

                {activeTab === 'overview' && (
                    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="p-5 bg-white dark:bg-[#1A1C1E] rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">About</h3>
                            <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                Building the future of messaging at WITS. Love coffee, clean code, and group hiking! 🏔️☕
                            </p>
                        </div>

                        <div className="bg-white dark:bg-[#1A1C1E] rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800">
                            {[
                                { icon: Shield, label: 'Encryption Status', value: 'Verified', color: 'text-emerald-500' },
                                { icon: Star, label: 'Star Rating', value: '4.9/5', color: 'text-amber-500' },
                                { icon: AlertCircle, label: 'Report User', color: 'text-red-500' },
                            ].map((item, i, arr) => (
                                <button key={i} className={classNames(
                                    "w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors",
                                    i !== arr.length - 1 && "border-b border-gray-50 dark:border-gray-800/50"
                                )}>
                                    <div className="flex items-center gap-4">
                                        <item.icon size={20} className={item.color} />
                                        <span className="font-bold text-[14px] dark:text-gray-200">{item.label}</span>
                                    </div>
                                    {item.value ? <span className="text-[10px] font-black text-gray-400 uppercase">{item.value}</span> : <ChevronLeft className="rotate-180 text-gray-300" size={18} />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'mutual' && (
                    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <section>
                            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 ml-2">Mutual Groups</h3>
                            <div className="space-y-3">
                                {MOCK_MUTUAL_GROUPS.map(g => (
                                    <div key={g.id} className="p-4 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary-light/10 text-primary-light flex items-center justify-center font-black">
                                                <Users size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm dark:text-white">{g.name}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase">{g.members} Members</p>
                                            </div>
                                        </div>
                                        <button className="text-[10px] font-black uppercase text-primary-light">View</button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 ml-2">Mutual Channels</h3>
                            <div className="space-y-3">
                                {MOCK_MUTUAL_CHANNELS.map(c => (
                                    <div key={c.id} className="p-4 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-red-400/10 text-red-500 flex items-center justify-center font-black">
                                                <Radio size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm dark:text-white">{c.name}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase">{c.followers} Followers</p>
                                            </div>
                                        </div>
                                        <button className="text-[10px] font-black uppercase text-primary-light">Join</button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                                <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800/50 rounded-2xl border border-gray-50 dark:border-gray-800 flex items-center justify-center">
                                    <ImageIcon size={20} className="text-gray-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
