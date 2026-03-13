import React, { useState } from 'react';
import {
    Search, Smartphone, MapPin, Grid,
    Gamepad2, Newspaper, ChevronRight,
    Video, ShoppingBag, Globe, Zap, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

const DISCOVER_ITEMS = [
    {
        group: "Social",
        items: [
            { id: 'moments', icon: Globe, label: 'Moments', color: 'bg-blue-500', path: '/moments' },
        ]
    },
    {
        group: "Exploration",
        items: [
            { id: 'shake', icon: Smartphone, label: 'Shake', color: 'bg-indigo-500', path: '/discover/shake' },
            { id: 'nearby', icon: MapPin, label: 'People Nearby', color: 'bg-emerald-500', path: '/discover/nearby' },
        ]
    },
    {
        group: "Services",
        items: [
            { id: 'market', icon: Grid, label: 'Mini Apps', color: 'bg-primary-light', path: '/market' },
            { id: 'games', icon: Gamepad2, label: 'Games', color: 'bg-orange-500', path: '/discover/games' },
        ]
    },
    {
        group: "Content",
        items: [
            { id: 'news', icon: Newspaper, label: 'Top News', color: 'bg-red-500', path: '/discover/news' },
            { id: 'video', icon: Video, label: 'Short Videos', color: 'bg-pink-500', path: '/discover/videos' },
        ]
    }
];

export default function Discover() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="h-full w-full bg-[#f4f6f8] dark:bg-[#0A0A0A] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-12 pb-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shrink-0">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-[32px] font-black tracking-tight text-gray-900 dark:text-white">Discover</h1>
                    <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500">
                        <Search size={22} />
                    </div>
                </div>
            </div>

            {/* Menu List */}
            <div className="flex-1 overflow-y-auto pb-24 space-y-6 pt-4 px-4 scroll-smooth no-scrollbar">

                {DISCOVER_ITEMS.map((section, idx) => (
                    <div key={idx} className="space-y-1">
                        <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-4 mb-2">
                            {section.group}
                        </h3>
                        <div className="bg-white dark:bg-[#1A1C1E] rounded-[32px] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                            {section.items.map((item, i) => (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className={classNames(
                                        "w-full flex items-center justify-between px-5 py-4 transition-all active:bg-gray-100 dark:active:bg-white/5 group",
                                        i !== section.items.length - 1 && "border-b border-gray-50 dark:border-gray-800/50"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={classNames(
                                            "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110",
                                            item.color
                                        )}>
                                            <item.icon size={20} />
                                        </div>
                                        <span className="font-bold text-gray-800 dark:text-gray-200">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.id === 'shake' && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                                        <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Promotional Card */}
                <div className="mt-8 mx-2 p-6 rounded-[40px] bg-gradient-to-br from-primary-light/10 to-transparent border border-primary-light/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap size={18} className="text-primary-light" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-light">WITS Spotlight</span>
                        </div>
                        <h4 className="text-lg font-black dark:text-white mb-1">New Mini Apps Arrived</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Explore the latest productivity tools added to the marketplace today.</p>
                        <button
                            onClick={() => navigate('/market')}
                            className="mt-4 px-6 py-2 bg-primary-light text-white rounded-full font-bold text-xs shadow-md shadow-primary-light/20"
                        >
                            Open Market
                        </button>
                    </div>
                    <div className="absolute right-6 bottom-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Heart size={80} className="text-primary-light" fill="currentColor" />
                    </div>
                </div>
            </div>
        </div>
    );
}
