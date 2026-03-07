import React from 'react';
import { Camera, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

const FEED = [
    {
        id: 1,
        user: 'Diana',
        avatar: 'https://i.pravatar.cc/150?u=diana',
        time: '2 hours ago',
        content: 'Just launched the new UI update! The micro-animations are butter smooth. 🚀🔥',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
        likes: 342,
        comments: 56
    },
    {
        id: 2,
        user: 'Team WITS',
        avatar: 'https://i.pravatar.cc/150?u=team',
        time: '5 hours ago',
        content: 'We are expanding the Mini-App ecosystem! Developers can now upload their custom JS bundles directly via our portal.',
        likes: 1024,
        comments: 89
    }
];

const STORIES = Array(8).fill(0).map((_, i) => ({
    id: i,
    name: `User ${i + 1}`,
    avatar: `https://i.pravatar.cc/150?u=${i}`
}));

const MomentsFeed = () => {
    return (
        <div className="h-full w-full bg-gray-50 dark:bg-[#121212] overflow-y-auto pb-24">

            {/* Heavy Header */}
            <div className="w-full bg-surface-light dark:bg-surface-dark px-6 pt-12 pb-6 flex justify-between items-center shadow-sm sticky top-0 z-20">
                <h1 className="text-[32px] font-bold text-gray-900 dark:text-white tracking-tight">Discover</h1>
                <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <Camera size={20} className="text-gray-700 dark:text-gray-300" />
                </button>
            </div>

            <div className="max-w-2xl mx-auto md:py-8 w-full">
                {/* Story Carousel */}
                <div className="flex gap-4 overflow-x-auto px-6 py-4 no-scrollbar mb-4">
                    <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                            <span className="text-2xl text-gray-400">+</span>
                        </div>
                        <span className="text-xs text-gray-600 font-medium mt-1">Add Story</span>
                    </div>

                    {STORIES.map(story => (
                        <div key={story.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200">
                            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                                <img src={story.avatar} className="w-full h-full rounded-full border-2 border-white dark:border-[#121212] object-cover" alt="" />
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">{story.name}</span>
                        </div>
                    ))}
                </div>

                {/* Feed Posts */}
                <div className="flex flex-col gap-6 md:px-0">
                    {FEED.map(post => (
                        <div key={post.id} className="bg-white dark:bg-[#1A1C1E] md:rounded-[24px] shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500 fade-in fill-mode-both" style={{ animationDelay: `${post.id * 100}ms` }}>

                            {/* Post Header */}
                            <div className="px-5 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={post.avatar} className="w-10 h-10 rounded-full cursor-pointer" alt="" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{post.user}</h3>
                                        <p className="text-xs text-gray-500">{post.time}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><MoreHorizontal size={20} /></button>
                            </div>

                            {/* Content */}
                            <div className="px-5 pb-3">
                                <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-[15px]">{post.content}</p>
                            </div>

                            {/* Media */}
                            {post.image && (
                                <div className="w-full h-80 overflow-hidden cursor-pointer">
                                    <img src={post.image} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="" />
                                </div>
                            )}

                            {/* Actions */}
                            <div className="px-5 py-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/50 mt-2">
                                <div className="flex items-center gap-6">
                                    <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-full transition-all group">
                                        <Heart size={22} className="group-active:scale-75 transition-transform" />
                                        <span className="font-medium">{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-full transition-all">
                                        <MessageCircle size={22} />
                                        <span className="font-medium">{post.comments}</span>
                                    </button>
                                </div>
                                <button className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <Share2 size={20} />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MomentsFeed;
