import React, { useState, useEffect } from 'react';
import CommunitySidebar from './CommunitySidebar';
import ChannelSidebar from './ChannelSidebar';
import ChatDetail from '../chat/ChatDetail';
import { insforge } from '../../lib/insforge';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import {
    LayoutDashboard, Users, Megaphone,
    Shield, Globe, Plus, Search, HelpCircle,
    ArrowRight
} from 'lucide-react';
import classNames from 'classnames';

export default function Communities() {
    const { user } = useAuthStore();
    const {
        activeCommunityId, activeChannelId, setCommunity, setChannel,
        communities, setCommunities
    } = useChatStore();

    const [viewType, setViewType] = useState<'dashboard' | 'chat' | 'settings'>('dashboard');
    const [activeChat, setActiveChat] = useState<any>(null);

    useEffect(() => {
        const fetchCommunities = async () => {
            const { data } = await insforge.database
                .from('communities')
                .select('*')
                .order('created_at');
            if (data) setCommunities(data);
        };
        fetchCommunities();
    }, [setCommunities]);

    const activeCommunity = communities.find(c => c.id === activeCommunityId);

    const handleSelectCommunity = (id: string | null) => {
        setCommunity(id);
        setChannel(null);
        setViewType('dashboard');
    };

    const handleSelectChannel = (id: string, type: 'channel' | 'group') => {
        setChannel(id);
        setViewType('chat');
        // Mock channel object for ChatDetail
        setActiveChat({
            id: id,
            name: id.startsWith('c') ? `Channel: ${id}` : `Group: ${id}`,
            is_group: type === 'group'
        });
    };

    const DiscoveryDashboard = () => (
        <div className="flex-1 bg-white dark:bg-[#0A0A0A] overflow-y-auto no-scrollbar">
            {/* Hero Section */}
            <div className="relative h-64 bg-gradient-to-br from-indigo-600 to-primary-light flex items-center px-12 overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl font-black text-white mb-4 leading-tight">Find your place in the WITS Ecosystem.</h1>
                    <p className="text-white/80 font-bold uppercase tracking-widest text-xs mb-6">From gaming to development, there's a community for everyone.</p>
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                        <input
                            type="text"
                            placeholder="Explore communities, groups, and more..."
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-white/30 transition-all font-medium"
                        />
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute right-20 top-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl" />
            </div>

            <div className="p-12 space-y-12 max-w-6xl">
                {/* Popular Communities */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <Globe className="text-primary-light" />
                            <h3 className="text-xl font-black dark:text-white uppercase tracking-widest">Featured Communities</h3>
                        </div>
                        <button className="text-[10px] font-black uppercase text-primary-light tracking-widest flex items-center gap-2 group">
                            Explore All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {communities.map(c => (
                            <div key={c.id} onClick={() => handleSelectCommunity(c.id)} className="bg-white dark:bg-[#1A1C1E] rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                                <div className="h-32 bg-gray-100 dark:bg-gray-800 relative">
                                    <img src={`https://picsum.photos/seed/${c.id}/600/300`} className="w-full h-full object-cover opacity-60" alt="" />
                                    <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-[20px] bg-primary-light border-4 border-white dark:border-[#1A1C1E] flex items-center justify-center text-white font-black text-2xl shadow-lg">
                                        {c.name[0]}
                                    </div>
                                </div>
                                <div className="p-6 pt-10">
                                    <h4 className="text-lg font-black dark:text-white group-hover:text-primary-light transition-colors">{c.name}</h4>
                                    <p className="text-xs text-gray-500 font-medium mt-2 line-clamp-2 leading-relaxed">
                                        {c.description || "The official hub for discussions, networking and real-time collaboration within WITS."}
                                    </p>
                                    <div className="mt-4 flex items-center gap-4 border-t border-gray-50 dark:border-gray-800 pt-4">
                                        <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Users size={14} /> 1.2K</div>
                                        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 42 Online</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Categories */}
                <section>
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Trending Categories</h3>
                    <div className="flex flex-wrap gap-4">
                        {[
                            { id: 1, name: 'Gaming', icon: '🎮', color: 'bg-emerald-500/10 text-emerald-600' },
                            { id: 2, name: 'Technology', icon: '💻', color: 'bg-blue-500/10 text-blue-600' },
                            { id: 3, name: 'Art & Design', icon: '🎨', color: 'bg-pink-500/10 text-pink-600' },
                            { id: 4, name: 'Music', icon: '🎵', color: 'bg-amber-500/10 text-amber-600' },
                            { id: 5, name: 'Education', icon: '📚', color: 'bg-indigo-500/10 text-indigo-600' },
                        ].map(cat => (
                            <button key={cat.id} className={classNames("px-6 py-3 rounded-2xl flex items-center gap-3 font-bold transition-all hover:scale-105 active:scale-95 shadow-sm border border-transparent hover:border-white/20", cat.color)}>
                                <span>{cat.icon}</span>
                                <span className="text-sm">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );

    const CommunityDashboard = () => (
        <div className="flex-1 bg-[#f4f6f8] dark:bg-[#0A0A0A] overflow-y-auto no-scrollbar">
            <div className="h-48 bg-gray-200 dark:bg-gray-800 relative">
                <img src={`https://picsum.photos/seed/${activeCommunity.id}/1200/400`} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
                <div className="absolute bottom-6 left-12 flex items-end gap-6">
                    <div className="w-24 h-24 rounded-[32px] bg-primary-light border-4 border-white dark:border-[#0A0A0A] shadow-2xl flex items-center justify-center text-white font-black text-4xl">
                        {activeCommunity.name[0]}
                    </div>
                    <div className="pb-2">
                        <h1 className="text-3xl font-black text-white">{activeCommunity.name}</h1>
                        <p className="text-white/80 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Community Hub · Official Home</p>
                    </div>
                </div>
            </div>

            <div className="p-12 max-w-6xl grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    {/* Welcome Card */}
                    <div className="bg-white dark:bg-[#1A1C1E] p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h2 className="text-2xl font-black dark:text-white mb-2">Welcome to the family! 👋</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                            {activeCommunity.description || "You've successfully joined. Check out the rules channel to get verified and start chatting in the general rooms."}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/20">
                                <Shield className="text-emerald-500 mb-2" size={24} />
                                <h4 className="font-black text-[12px] uppercase tracking-widest dark:text-white">Community Rules</h4>
                                <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500/70 font-bold mt-1">12 Rules Active</p>
                            </div>
                            <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-900/20">
                                <Megaphone className="text-blue-500 mb-2" size={24} />
                                <h4 className="font-black text-[12px] uppercase tracking-widest dark:text-white">Announcements</h4>
                                <p className="text-[10px] text-blue-600/70 dark:text-blue-500/70 font-bold mt-1">3 New Updates</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-6">
                        {[
                            { label: 'Total Members', value: '1,248', icon: Users, color: 'text-primary-light' },
                            { label: 'Active Now', value: '156', icon: Globe, color: 'text-emerald-500' },
                            { label: 'Resources', value: '42', icon: HelpCircle, color: 'text-amber-500' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-[#1A1C1E] p-6 rounded-[32px] border border-gray-100 dark:border-gray-800">
                                <stat.icon size={20} className={classNames(stat.color, "mb-3")} />
                                <p className="text-2xl font-black dark:text-white tracking-tight">{stat.value}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-4 space-y-6">
                    <div className="bg-white dark:bg-[#1A1C1E] p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Top Members</h3>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-black text-[13px] dark:text-gray-100 truncate">Member_{i}</p>
                                        <p className="text-[9px] font-bold text-primary-light uppercase">Supporter</p>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 border border-gray-100 dark:border-gray-800 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary-light hover:border-primary-light/30 transition-all">
                            View All Members
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-full w-full bg-[#f4f6f8] dark:bg-[#0A0A0A] overflow-hidden">
            {/* Sidebar 1: Global Community Switcher */}
            <CommunitySidebar
                communities={communities}
                activeId={activeCommunityId}
                onSelect={handleSelectCommunity}
                onAdd={() => { }}
            />

            {/* Sidebar 2: Channel/Group Hierarchy (Only if community selected) */}
            {activeCommunityId ? (
                <ChannelSidebar
                    community={activeCommunity}
                    activeId={activeChannelId}
                    onSelect={handleSelectChannel}
                    onOpenSettings={() => setViewType('settings')}
                />
            ) : null}

            {/* Main Content Area */}
            <div className="flex-1 h-full min-w-0">
                {!activeCommunityId ? (
                    <DiscoveryDashboard />
                ) : (
                    <>
                        {viewType === 'dashboard' && <CommunityDashboard />}
                        {viewType === 'chat' && activeChat && (
                            <div className="h-full animate-in fade-in duration-500">
                                <ChatDetail
                                    chat={activeChat}
                                    onBack={() => setViewType('dashboard')}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
