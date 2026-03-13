import React, { useState, useEffect } from 'react';
import { Search, X, Globe, Zap, ArrowRight, Star } from 'lucide-react';
import { insforge } from '../../lib/insforge';
import { useMiniAppStore } from '../../store/miniAppStore';
import classNames from 'classnames';

export default function SearchPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { launchApp } = useMiniAppStore();

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const { data } = await insforge.database
                    .from('miniapps')
                    .select('*')
                    .ilike('name', `%${query}%`)
                    .limit(5);
                setResults(data || []);
            } catch (e) { console.error(e); }
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex flex-col bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="container mx-auto max-w-2xl px-4 pt-20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-light" size={24} />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Find apps, tools, websites..."
                            className="w-full bg-gray-100 dark:bg-gray-800 rounded-[28px] py-5 pl-14 pr-6 text-xl outline-none focus:ring-4 focus:ring-primary-light/20 transition-all dark:text-white shadow-lg"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                    <button onClick={onClose} className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <div className="space-y-6">
                    {loading && <div className="text-center py-10"><div className="w-8 h-8 border-4 border-primary-light border-t-transparent rounded-full animate-spin mx-auto" /></div>}

                    {!loading && results.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4 flex items-center gap-2">
                                <Zap size={14} className="text-yellow-500" /> App Results
                            </h3>
                            <div className="space-y-2">
                                {results.map(app => (
                                    <button
                                        key={app.id}
                                        onClick={() => { launchApp(app); onClose(); }}
                                        className="w-full flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-gray-100 dark:border-gray-700 group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-primary-light/10 flex items-center justify-center text-primary-light font-bold text-xl group-hover:scale-110 transition-transform">
                                            {app.name[0]}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h4 className="font-bold dark:text-white">{app.name}</h4>
                                            <p className="text-xs text-gray-500">{app.category}</p>
                                        </div>
                                        <ArrowRight size={18} className="text-gray-300 group-hover:text-primary-light group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!loading && !query && (
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4 flex items-center gap-2">
                                <Star size={14} className="text-primary-light" /> Suggested
                            </h3>
                            <div className="grid grid-cols-2 gap-3 px-2">
                                {['YouTube', 'Amazon', 'Wikipedia', 'GitHub'].map(name => (
                                    <button
                                        key={name}
                                        onClick={() => setQuery(name)}
                                        className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-light/5 text-gray-700 dark:text-gray-300 transition-all"
                                    >
                                        <Globe size={18} className="text-gray-400" />
                                        <span className="font-semibold text-sm">{name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!loading && query && results.length === 0 && (
                        <div className="text-center py-20 px-10">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Globe size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold dark:text-white mb-2">No Match Found</h3>
                            <p className="text-gray-500">Try searching for a platform like "YouTube" or "Shopping"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
