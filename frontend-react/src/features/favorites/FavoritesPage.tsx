import React from 'react';
import { Heart, Star, LayoutGrid, ArrowRight, Trash2 } from 'lucide-react';
import { useMiniAppStore } from '../../store/miniAppStore';
import classNames from 'classnames';

export default function FavoritesPage() {
    const { favorites, toggleFavorite, launchApp } = useMiniAppStore();

    return (
        <div className="h-full w-full bg-gray-50 dark:bg-[#121212] overflow-y-auto pb-32 no-scrollbar">
            <div className="max-w-4xl mx-auto p-6 space-y-8 pt-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Favorites</h1>
                        <p className="text-gray-500 text-sm font-medium">Your most loved mini apps</p>
                    </div>
                </div>

                {favorites.length === 0 ? (
                    <div className="text-center py-20 px-10">
                        <div className="w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                            <Heart size={48} className="fill-current" />
                        </div>
                        <h3 className="text-xl font-bold dark:text-white mb-2">Nothing here yet</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mb-8">Mark mini apps as favorite to see them here for quick access.</p>
                        <button className="px-8 py-3 bg-primary-light text-white rounded-2xl font-bold shadow-lg shadow-primary-light/30">
                            Browse Store
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favorites.map((app) => (
                            <div
                                key={app.id}
                                onClick={() => launchApp(app)}
                                className="flex items-center gap-4 p-5 bg-white dark:bg-[#1A1C1E] rounded-[32px] border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
                            >
                                <div className="w-16 h-16 rounded-[22px] bg-primary-light/5 flex items-center justify-center text-3xl font-bold text-primary-light">
                                    {app.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black uppercase text-primary-light">{app.category || 'General'}</span>
                                        <div className="w-1 h-1 rounded-full bg-primary-light" />
                                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                    </div>
                                    <h3 className="text-lg font-black dark:text-white truncate">{app.name}</h3>
                                    <p className="text-xs text-gray-400 line-clamp-1">Tap to launch instantly</p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(app); }}
                                    className="p-3 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {favorites.length > 0 && (
                    <div className="pt-10 border-t border-gray-100 dark:border-gray-800">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Recommended for you</h3>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            {['ChatGPT', 'YouTube', 'Notion'].map(name => (
                                <div key={name} className="shrink-0 w-32 h-40 bg-white dark:bg-[#1A1C1E] rounded-3xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col items-center justify-center gap-2 hover:border-primary-light transition-all cursor-pointer">
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-xl">🌐</div>
                                    <span className="text-xs font-bold dark:text-white">{name}</span>
                                    <Heart size={14} className="text-gray-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
