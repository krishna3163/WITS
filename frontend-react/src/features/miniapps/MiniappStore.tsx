import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Star, Globe, Plus, X, ChevronLeft, Heart, Clock, ExternalLink, Trash2, Zap } from 'lucide-react';
import { insforge } from '../../lib/insforge';
import { useAuthStore } from '../../store/authStore';
import { useMiniAppStore } from '../../store/miniAppStore';
import classNames from 'classnames';

interface MiniApp {
    id: string;
    name: string;
    url: string;
    icon_url: string;
    category: string;
    description: string;
    is_default: boolean;
}

interface UserMiniApp {
    id: string;
    user_id: string;
    miniapp_id: string;
    is_favorite: boolean;
    visit_count: number;
    last_visited: string;
}

interface AppWithMeta extends MiniApp {
    user_data?: UserMiniApp;
}

const DEFAULT_WEBSITES: Partial<MiniApp>[] = [
    { name: 'YouTube', url: 'https://m.youtube.com', icon_url: '', category: 'Video', description: 'Watch videos, music, and livestreams' },
    { name: 'Amazon', url: 'https://www.amazon.com', icon_url: '', category: 'Shopping', description: 'Shop millions of products' },
    { name: 'Wikipedia', url: 'https://en.m.wikipedia.org', icon_url: '', category: 'Education', description: 'Free online encyclopedia' },
    { name: 'Reddit', url: 'https://www.reddit.com', icon_url: '', category: 'Social', description: 'Communities and discussions' },
    { name: 'GitHub', url: 'https://github.com', icon_url: '', category: 'Developer', description: 'Code hosting and collaboration' },
    { name: 'Twitter / X', url: 'https://x.com', icon_url: '', category: 'Social', description: 'Microblogging and news' },
    { name: 'Google News', url: 'https://news.google.com', icon_url: '', category: 'News', description: 'Latest news from around the world' },
    { name: 'Spotify', url: 'https://open.spotify.com', icon_url: '', category: 'Music', description: 'Stream music and podcasts' },
    { name: 'Netflix', url: 'https://www.netflix.com', icon_url: '', category: 'Entertainment', description: 'Watch TV shows and movies' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon_url: '', category: 'Developer', description: 'Developer Q&A community' },
    { name: 'Google Maps', url: 'https://maps.google.com', icon_url: '', category: 'Travel', description: 'Maps, directions, and places' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com', icon_url: '', category: 'Business', description: 'Professional networking' },
];

const CATEGORIES = ['All', 'Video', 'Shopping', 'Social', 'Developer', 'Education', 'News', 'Music', 'Entertainment', 'Travel', 'Business', 'Custom'];

const EMOJI_ICONS: Record<string, string> = {
    Video: '📺', Shopping: '🛒', Social: '💬', Developer: '💻', Education: '📚',
    News: '📰', Music: '🎵', Entertainment: '🎬', Travel: '🗺️', Business: '💼', Custom: '🌐',
};

type View = 'discover' | 'add-custom';

const MiniappStore = () => {
    const { user } = useAuthStore();
    const { launchApp } = useMiniAppStore();
    const [view, setView] = useState<View>('discover');
    const [apps, setApps] = useState<AppWithMeta[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [tab, setTab] = useState<'popular' | 'favorites' | 'recent'>('popular');

    // Add custom form
    const [customName, setCustomName] = useState('');
    const [customUrl, setCustomUrl] = useState('');
    const [customCategory, setCustomCategory] = useState('Custom');

    const fetchApps = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const { data: dbApps } = await insforge.database.from('miniapps').select('*').order('name', { ascending: true });
            let allApps: MiniApp[] = (dbApps || []) as MiniApp[];

            if (allApps.length === 0) {
                const toInsert = DEFAULT_WEBSITES.map(w => ({
                    name: w.name,
                    url: w.url,
                    icon_url: w.icon_url || '',
                    category: w.category || 'Other',
                    description: w.description || '',
                    is_default: true,
                }));
                const { data: inserted } = await insforge.database.from('miniapps').insert(toInsert).select();
                allApps = (inserted || []) as MiniApp[];
            }

            const { data: userData } = await insforge.database.from('user_miniapps').select('*').eq('user_id', user.id);
            const userMap = new Map((userData || []).map((u: any) => [u.miniapp_id, u]));

            const merged: AppWithMeta[] = allApps.map(app => ({
                ...app,
                user_data: userMap.get(app.id) as UserMiniApp | undefined,
            }));

            setApps(merged);
        } catch (e) { console.error(e); }
        setLoading(false);
    }, [user?.id]);

    useEffect(() => { fetchApps(); }, [fetchApps]);

    const openApp = async (app: AppWithMeta) => {
        if (!user?.id) return;

        launchApp({
            id: app.id,
            name: app.name,
            url: app.url,
            icon_url: app.icon_url,
            category: app.category
        });

        // Track visit
        try {
            if (app.user_data) {
                await insforge.database.from('user_miniapps').update({
                    visit_count: (app.user_data.visit_count || 0) + 1,
                    last_visited: new Date().toISOString(),
                }).eq('id', app.user_data.id);
            } else {
                await insforge.database.from('user_miniapps').insert([{
                    user_id: user.id,
                    miniapp_id: app.id,
                    is_favorite: false,
                    visit_count: 1,
                    last_visited: new Date().toISOString(),
                }]);
            }
        } catch (e) { console.error(e); }
    };

    const toggleFavorite = async (app: AppWithMeta) => {
        if (!user?.id) return;
        try {
            if (app.user_data) {
                await insforge.database.from('user_miniapps').update({ is_favorite: !app.user_data.is_favorite }).eq('id', app.user_data.id);
            } else {
                await insforge.database.from('user_miniapps').insert([{
                    user_id: user.id,
                    miniapp_id: app.id,
                    is_favorite: true,
                    visit_count: 0,
                }]);
            }
            setApps(prev => prev.map(a => a.id === app.id ? {
                ...a,
                user_data: a.user_data
                    ? { ...a.user_data, is_favorite: !a.user_data.is_favorite }
                    : { id: '', user_id: user!.id, miniapp_id: a.id, is_favorite: true, visit_count: 0, last_visited: '' } as UserMiniApp
            } : a));
        } catch (e) { console.error(e); }
    };

    const addCustomApp = async () => {
        if (!customName.trim() || !customUrl.trim() || !user?.id) return;
        let url = customUrl.trim();
        if (!url.startsWith('http')) url = 'https://' + url;
        try {
            const { data } = await insforge.database.from('miniapps').insert([{
                name: customName.trim(),
                url,
                icon_url: '',
                category: customCategory,
                description: 'Custom website',
                is_default: false,
            }]).select();
            if (data?.[0]) {
                await insforge.database.from('user_miniapps').insert([{
                    user_id: user.id,
                    miniapp_id: data[0].id,
                    is_favorite: true,
                    visit_count: 0,
                }]);
            }
            setCustomName('');
            setCustomUrl('');
            setView('discover');
            fetchApps();
        } catch (e) { console.error(e); }
    };

    const deleteApp = async (app: AppWithMeta) => {
        if (!confirm(`Remove ${app.name}?`)) return;
        if (app.user_data) await insforge.database.from('user_miniapps').delete().eq('id', app.user_data.id);
        if (!app.is_default) await insforge.database.from('miniapps').delete().eq('id', app.id);
        setApps(prev => prev.filter(a => a.id !== app.id));
    };

    let filtered = apps;
    if (search) filtered = filtered.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'All') filtered = filtered.filter(a => a.category === category);
    if (tab === 'favorites') filtered = filtered.filter(a => a.user_data?.is_favorite);
    if (tab === 'recent') filtered = filtered.filter(a => a.user_data?.visit_count).sort((a, b) => new Date(b.user_data?.last_visited || 0).getTime() - new Date(a.user_data?.last_visited || 0).getTime());

    if (view === 'add-custom') return (
        <div className="h-full w-full bg-gray-50 dark:bg-[#121212] overflow-y-auto pb-24">
            <div className="w-full bg-surface-light dark:bg-surface-dark px-6 pt-12 pb-4 sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => setView('discover')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronLeft size={24} /></button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Website</h1>
                </div>
            </div>
            <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Website Name</label>
                    <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="e.g. My Blog"
                        className="w-full bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-light/50" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">URL</label>
                    <input value={customUrl} onChange={e => setCustomUrl(e.target.value)} placeholder="https://example.com"
                        className="w-full bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-light/50" />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Category</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.filter(c => c !== 'All').map(c => (
                            <button key={c} onClick={() => setCustomCategory(c)}
                                className={classNames('px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                                    customCategory === c ? 'bg-primary-light text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                )}>{c}</button>
                        ))}
                    </div>
                </div>
                <button onClick={addCustomApp} disabled={!customName.trim() || !customUrl.trim()}
                    className="w-full bg-primary-light text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                    Add Website
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-full w-full bg-gray-50 dark:bg-[#121212] overflow-y-auto pb-24">
            <div className="w-full bg-surface-light dark:bg-surface-dark px-6 pt-12 pb-4 sticky top-0 z-20 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-[32px] font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                        Apps <Zap size={24} className="text-yellow-500 fill-yellow-500" />
                    </h1>
                    <button onClick={() => setView('add-custom')}
                        className="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all">
                        <Plus size={20} />
                    </button>
                </div>

                <div className="relative mb-3">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search apps..."
                        className="w-full bg-gray-100 dark:bg-gray-800 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-light/50" />
                </div>

                <div className="flex gap-2 mb-3">
                    {(['popular', 'favorites', 'recent'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={classNames('px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize flex items-center gap-1.5',
                                tab === t ? 'bg-primary-light text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            )}>
                            {t === 'favorites' && <Heart size={14} />}
                            {t === 'recent' && <Clock size={14} />}
                            {t === 'popular' && <Star size={14} />}
                            {t}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={classNames('px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                                category === c ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                            )}>
                            {c !== 'All' && <span className="mr-1">{EMOJI_ICONS[c] || '🌐'}</span>}{c}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-2xl mx-auto w-full px-4 md:px-0 py-4">
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="w-10 h-10 border-4 border-primary-light border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-16">
                        <Globe size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-500">
                            {tab === 'favorites' ? 'No favorites yet' : tab === 'recent' ? 'No recent visits' : 'No apps found'}
                        </h3>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {filtered.map((app, i) => (
                        <div key={app.id}
                            className="bg-white dark:bg-[#1A1C1E] rounded-[20px] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group relative animate-in fade-in duration-500"
                            style={{ animationDelay: `${i * 40}ms` }}
                            onClick={() => openApp(app)}
                        >
                            <button onClick={(e) => { e.stopPropagation(); toggleFavorite(app); }}
                                className={classNames('absolute top-3 right-3 p-1 rounded-full transition-all z-10',
                                    app.user_data?.is_favorite ? 'text-red-500' : 'text-gray-300 opacity-0 group-hover:opacity-100')}>
                                <Heart size={16} className={app.user_data?.is_favorite ? 'fill-red-500' : ''} />
                            </button>

                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-light/20 to-blue-400/20 flex items-center justify-center text-2xl mb-3 mx-auto group-hover:scale-110 transition-transform">
                                {EMOJI_ICONS[app.category] || '🌐'}
                            </div>

                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm text-center truncate">{app.name}</h4>
                            <p className="text-xs text-gray-400 text-center mt-0.5">{app.category}</p>

                            {app.user_data?.visit_count ? (
                                <p className="text-[10px] text-gray-400 text-center mt-1">{app.user_data.visit_count} visits</p>
                            ) : null}

                            {!app.is_default && (
                                <button onClick={(e) => { e.stopPropagation(); deleteApp(app); }}
                                    className="absolute bottom-3 right-3 p-1 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all">
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MiniappStore;
