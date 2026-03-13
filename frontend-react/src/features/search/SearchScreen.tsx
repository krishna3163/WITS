import React, { useState } from 'react';
import { Search, History, TrendingUp, Zap, ArrowRight, Grid } from 'lucide-react';
import { useMiniAppStore } from '../../store/miniAppStore';
import classNames from 'classnames';

const RECENT_SEARCHES = ['Music', 'Games', 'Shopping', 'Travel', 'Crypto'];
const SUGGESTED = [
    { name: 'Video Player', category: 'Entertainment' },
    { name: 'Cloud Editor', category: 'Developer' },
    { name: 'Stock Tracker', category: 'Finance' },
];

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const { launchApp } = useMiniAppStore();

    return (
        <div className="h-full w-full bg-gray-50 dark:bg-[#121212] flex flex-col pt-12">
            <div className="px-6 space-y-4">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">Exploration</h1>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-light" size={22} />
                    <input
                        type="text"
                        placeholder="Search for anything..."
                        className="w-full bg-white dark:bg-[#1A1C1E] rounded-[24px] py-4 pl-12 pr-6 shadow-sm border border-gray-100 dark:border-gray-800 outline-none focus:ring-4 focus:ring-primary-light/10 transition-all text-gray-900 dark:text-white"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {RECENT_SEARCHES.map(s => (
                        <button key={s} className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 shadow-sm border border-gray-50 dark:border-gray-700 hover:text-primary-light transition-colors">
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 mt-6 px-6 space-y-8 overflow-y-auto pb-32 no-scrollbar">

                {/* Trending */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-emerald-500" size={18} />
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Trending Searches</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {SUGGESTED.map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-[#1A1C1E] rounded-2xl border border-gray-50 dark:border-gray-800 group cursor-pointer hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 font-bold group-hover:bg-primary-light/10 group-hover:text-primary-light">
                                        #{i + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{s.name}</h4>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{s.category}</span>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="text-gray-300 group-hover:text-primary-light transition-all" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Categories Shortcut */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="text-yellow-500" size={18} />
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Quick Categories</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {['Shopping', 'Games', 'Social', 'Tools'].map(cat => (
                            <div key={cat} className="h-24 bg-gradient-to-br from-primary-light/5 to-primary-light/10 dark:from-primary-light/10 dark:to-transparent rounded-3xl border border-primary-light/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary-light transition-all">
                                <Grid size={24} className="text-primary-light" />
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{cat}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
