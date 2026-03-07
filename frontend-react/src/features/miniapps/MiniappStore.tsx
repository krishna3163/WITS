import React from 'react';
import { Search, Grid, Star, Download, ChevronRight, Zap } from 'lucide-react';
import classNames from 'classnames';

const APPS = [
    { id: 1, name: 'Ride Hailing', category: 'Travel', rating: 4.8, users: '1.2M', icon: '🚗', color: 'from-blue-400 to-indigo-500' },
    { id: 2, name: 'Food Delivery', category: 'Lifestyle', rating: 4.9, users: '3.4M', icon: '🍔', color: 'from-orange-400 to-red-500' },
    { id: 3, name: 'Movie Tickets', category: 'Entertainment', rating: 4.5, users: '800K', icon: '🎟️', color: 'from-purple-400 to-pink-500' },
    { id: 4, name: 'Health Tracking', category: 'Wellness', rating: 4.7, users: '2.1M', icon: '❤️', color: 'from-green-400 to-teal-500' },
    { id: 5, name: 'Split Bills', category: 'Finance', rating: 4.9, users: '500K', icon: '💸', color: 'from-yellow-400 to-orange-500' },
    { id: 6, name: 'Micro Games', category: 'Gaming', rating: 4.2, users: '4.5M', icon: '🕹️', color: 'from-pink-500 to-rose-500' },
];

const MiniappStore = () => {
    return (
        <div className="h-full w-full bg-surface-light dark:bg-surface-dark overflow-y-auto pb-24 scroll-smooth">
            {/* Header */}
            <div className="px-6 pt-12 pb-6 flex flex-col gap-6 sticky top-0 bg-surface-light dark:bg-[#121212] z-10 shadow-sm transition-colors duration-300">
                <div className="flex justify-between items-center">
                    <h1 className="text-[32px] font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                        Mini Apps <Zap size={28} className="text-yellow-500 fill-yellow-500" />
                    </h1>
                </div>

                {/* Search */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={20} className="text-gray-400 group-focus-within:text-primary-light transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search micro-apps..."
                        className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-[28px] py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-light/50 transition-all font-medium shadow-inner"
                    />
                </div>
            </div>

            <div className="px-6 py-6 animate-in slide-in-from-bottom-8 duration-700 fade-in">

                {/* Banner Section */}
                <div className="w-full h-48 rounded-[28px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 flex flex-col justify-end relative shadow-lg overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                    <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold w-max mb-2">Featured Developer</span>
                    <h2 className="text-white text-2xl font-bold">Build Your Own App</h2>
                    <p className="text-white/80 text-sm mt-1 max-w-[70%]">Access our developer portal and deploy React bundles directly.</p>
                </div>

                {/* Categories Grid */}
                <div className="mt-8 flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Trending Services</h3>
                    <button className="text-primary-light text-sm font-semibold flex items-center hover:opacity-80">See all <ChevronRight size={16} /></button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {APPS.map((app, i) => (
                        <div
                            key={app.id}
                            className="bg-white dark:bg-[#1A1C1E] rounded-[24px] p-4 flex flex-col items-center gap-3 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 cursor-pointer group active:scale-95"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <div className={classNames(
                                "w-16 h-16 rounded-[20px] flex items-center justify-center text-3xl shadow-md bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
                                app.color
                            )}>
                                {app.icon}
                            </div>
                            <div className="text-center w-full">
                                <h4 className="font-semibold text-gray-900 dark:text-white text-[15px] truncate">{app.name}</h4>
                                <p className="text-xs text-gray-500 truncate">{app.category}</p>

                                <div className="flex items-center justify-center gap-2 mt-2 w-full">
                                    <span className="flex items-center text-xs font-medium text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                                        <Star size={10} className="fill-amber-500 mr-1" /> {app.rating}
                                    </span>
                                    <span className="text-[10px] text-gray-400">{app.users} installs</span>
                                </div>
                            </div>

                            <button className="mt-auto w-full bg-gray-50 dark:bg-gray-800 text-primary-light dark:text-primary-dark rounded-xl py-2 text-sm font-semibold hover:bg-primary-light focus-within:ring-2 focus:ring-primary-light/50 hover:text-white transition-colors flex items-center justify-center gap-2">
                                <Download size={14} /> Open
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default MiniappStore;
