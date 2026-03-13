import React, { useState, useEffect } from 'react';
import {
    Zap, Rocket, Star, Clock, Flame, ChevronRight,
    Video, ShoppingBag, Share2, Code, BookOpen, Newspaper,
    Music, Film, MapPin, Briefcase, Plus, ExternalLink, Trash2
} from 'lucide-react';
import { useMiniAppStore } from '../../store/miniAppStore';
import type { MiniApp } from '../../store/miniAppStore';
import { insforge } from '../../lib/insforge';
import classNames from 'classnames';

const PINNED_APPS: MiniApp[] = [
    { id: 'youtube', name: 'YouTube', url: 'https://m.youtube.com', category: 'Video', description: 'Watch videos and music' },
    { id: 'amazon', name: 'Amazon', url: 'https://www.amazon.com', category: 'Shopping', description: 'Shop millions of products' },
    { id: 'spotify', name: 'Spotify', url: 'https://open.spotify.com', category: 'Music', description: 'Listen to your favorite music' },
    { id: 'netflix', name: 'Netflix', url: 'https://www.netflix.com', category: 'Entertainment', description: 'Movies and TV shows' },
    { id: 'x', name: 'X / Twitter', url: 'https://x.com', category: 'Social', description: 'What\'s happening now' },
    { id: 'github', name: 'GitHub', url: 'https://github.com', category: 'Developer', description: 'Build and collaborate' },
    { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com', category: 'AI', description: 'Advanced AI assistant' },
    { id: 'reddit', name: 'Reddit', url: 'https://www.reddit.com', category: 'Social', description: 'Communities for everything' }
];

const CATEGORIES = [
    { name: 'Video', icon: Video, color: 'bg-red-500' },
    { name: 'Shopping', icon: ShoppingBag, color: 'bg-orange-500' },
    { name: 'Social', icon: Share2, color: 'bg-blue-500' },
    { name: 'Developer', icon: Code, color: 'bg-gray-800' },
    { name: 'Education', icon: BookOpen, color: 'bg-emerald-500' },
    { name: 'News', icon: Newspaper, color: 'bg-indigo-500' },
    { name: 'Music', icon: Music, color: 'bg-purple-500' },
    { name: 'Entertainment', icon: Film, color: 'bg-pink-500' },
    { name: 'Travel', icon: MapPin, color: 'bg-cyan-500' },
    { name: 'Business', icon: Briefcase, color: 'bg-slate-700' },
];

const HomeDashboard = () => {
    const { launchApp, recentlyUsed, removeFromRecent, favorites, toggleFavorite } = useMiniAppStore();
    const [trendingApps, setTrendingApps] = useState<MiniApp[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newAppUrl, setNewAppUrl] = useState('');
    const [newAppName, setNewAppName] = useState('');

    const handleCreateApp = async () => {
        if (!newAppUrl.trim() || !newAppName.trim()) return;

        let url = newAppUrl.trim();
        if (!url.startsWith('http')) url = 'https://' + url;

        const newApp: MiniApp = {
            id: 'custom-' + Date.now(),
            name: newAppName.trim(),
            url: url,
            category: 'Custom',
            description: 'User created mini app'
        };

        // For now, we just launch it instantly. 
        // In a real app, we would save it to the DB.
        launchApp(newApp);
        setIsCreating(false);
        setNewAppUrl('');
        setNewAppName('');
    };

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const { data } = await insforge.database
                    .from('miniapps')
                    .select('*')
                    .limit(6);
                if (data) setTrendingApps(data);
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchTrending();
    }, []);

    const CategoryBadge = ({ category }: { category?: string }) => {
        if (!category) return null;
        return (
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {category}
            </span>
        );
    };

    return (
        <div className="h-full w-full bg-gray-50 dark:bg-[#121212] overflow-y-auto pb-32 no-scrollbar">
            <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 py-10">

                {/* Hero / Pinned Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Star className="text-yellow-500 fill-yellow-500" size={20} />
                            <h2 className="text-xl font-bold dark:text-white">Pinned Apps</h2>
                        </div>
                        <button className="text-primary-light text-sm font-semibold flex items-center gap-1 hover:underline">
                            View All <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PINNED_APPS.map((app) => (
                            <div
                                key={app.id}
                                onClick={() => launchApp(app)}
                                className="bg-white dark:bg-[#1A1C1E] p-4 rounded-[28px] shadow-sm hover:shadow-xl hover:scale-[1.03] transition-all cursor-pointer border border-gray-100 dark:border-gray-800 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-primary-light/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform duration-500 group-hover:scale-150" />

                                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-2xl mb-3 shadow-inner group-hover:bg-primary-light group-hover:text-white transition-colors duration-300">
                                    {app.name[0]}
                                </div>

                                <CategoryBadge category={app.category} />
                                <h3 className="font-bold text-gray-900 dark:text-white mt-0.5 truncate">{app.name}</h3>

                                <button className="mt-3 w-full py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs font-bold group-hover:bg-primary-light group-hover:text-white transition-all shadow-sm">
                                    Launch
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Categories Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Rocket className="text-orange-500" size={20} />
                        <h2 className="text-xl font-bold dark:text-white">Categories</h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.name}
                                className="flex flex-col items-center gap-2 shrink-0 group"
                            >
                                <div className={classNames(
                                    "w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-active:scale-90",
                                    cat.color
                                )}>
                                    <cat.icon size={28} strokeWidth={2.5} />
                                </div>
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Recently Used */}
                {recentlyUsed.length > 0 && (
                    <section className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Clock className="text-blue-500" size={20} />
                                <h2 className="text-xl font-bold dark:text-white">Recent</h2>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {recentlyUsed.map((app) => (
                                <div
                                    key={app.id}
                                    className="flex items-center gap-4 p-3 pr-4 bg-white dark:bg-[#1A1C1E] rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all group cursor-pointer"
                                    onClick={() => launchApp(app)}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-primary-light/10 flex items-center justify-center text-primary-light font-bold text-xl">
                                        {app.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold dark:text-white leading-tight">{app.name}</h4>
                                        <p className="text-xs text-gray-500">Last opened recently</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFromRecent(app.id); }}
                                            className="p-2 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <div className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-primary-light transition-colors">
                                            <ExternalLink size={18} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Trending Apps */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Flame className="text-red-500" size={20} />
                        <h2 className="text-xl font-bold dark:text-white">Trending Now</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {trendingApps.map((app) => (
                            <div
                                key={app.id}
                                onClick={() => launchApp(app)}
                                className="flex items-center gap-4 p-5 bg-gradient-to-br from-white to-gray-50 dark:from-[#1A1C1E] dark:to-[#121212] rounded-[32px] border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all cursor-pointer group"
                            >
                                <div className="w-16 h-16 rounded-[22px] bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                    {app.name === 'YouTube' ? '📺' : app.name === 'Amazon' ? '🛒' : '🌐'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <CategoryBadge category={app.category} />
                                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Popular</span>
                                    </div>
                                    <h3 className="text-lg font-black dark:text-white">{app.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{app.description || 'Explore trending services'}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg shadow-primary-light/40 transition-all -translate-x-2 group-hover:translate-x-0">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Promotion / Banner */}
                <div
                    onClick={() => setIsCreating(true)}
                    className="relative h-48 rounded-[40px] bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden shadow-2xl flex items-center p-8 group cursor-pointer transition-transform active:scale-95"
                >
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
                    </div>
                    <div className="relative z-10 space-y-2">
                        <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest">WITS Exclusive</span>
                        <h2 className="text-3xl font-black text-white leading-tight">Create your own<br />Mini App in seconds</h2>
                        <p className="text-white/70 text-sm font-medium">Paste any URL and start using it instantly.</p>
                    </div>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-[32px] rotate-12 flex items-center justify-center backdrop-blur-sm border border-white/20 transition-transform duration-700 group-hover:rotate-[28deg] group-hover:scale-110">
                        <Plus size={48} className="text-white" />
                    </div>
                </div>
            </div>

            {/* Creator Modal */}
            {isCreating && (
                <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1A1C1E] w-full max-w-md rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-primary-light/10 rounded-2xl flex items-center justify-center text-primary-light mb-6">
                            <Rocket size={32} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black dark:text-white mb-2">Create Mini App</h2>
                        <p className="text-gray-500 text-sm mb-6 font-medium">Instantly convert any website into a Super App tool.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1 ml-4">App Name</label>
                                <input
                                    autoFocus
                                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-primary-light/20 transition-all dark:text-white font-bold"
                                    placeholder="e.g. My Website"
                                    value={newAppName}
                                    onChange={e => setNewAppName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 block mb-1 ml-4">Website URL</label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-primary-light/20 transition-all dark:text-white font-bold"
                                    placeholder="https://example.com"
                                    value={newAppUrl}
                                    onChange={e => setNewAppUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="flex-1 py-4 rounded-2xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateApp}
                                disabled={!newAppName || !newAppUrl}
                                className="flex-1 py-4 rounded-2xl font-bold bg-primary-light text-white shadow-xl shadow-primary-light/30 disabled:opacity-50"
                            >
                                Create & Launch
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeDashboard;
