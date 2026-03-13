import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Users, Compass, Store, GalleryVertical } from 'lucide-react';
import classNames from 'classnames';
import { useChatStore } from '../../store/chatStore';

const TABS = [
    { path: '/app/home', label: 'Home', icon: Home },
    { path: '/app/chat', label: 'Chats', icon: MessageCircle },
    { path: '/app/moments', label: 'Moments', icon: GalleryVertical },
    { path: '/app/discover', label: 'Discover', icon: Compass },
    { path: '/app/store', label: 'Market', icon: Store },
];

const BottomNav = () => {
    const location = useLocation();
    const totalUnreadCount = useChatStore((s) => s.totalUnreadCount);

    return (
        <nav className="fixed bottom-0 w-full h-[84px] bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-t border-gray-200 dark:border-gray-800 flex items-center justify-around px-2 z-[60] pb-2 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
            {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = location.pathname.startsWith(tab.path);

                return (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
                        className={({ isActive: linkActive }) =>
                            classNames(
                                "relative flex flex-col items-center justify-center w-20 h-full transition-all duration-500 group",
                                isActive ? "text-primary-light dark:text-primary-light" : "text-gray-400 dark:text-gray-500"
                            )
                        }
                    >
                        <div className={classNames(
                            "relative p-2.5 rounded-2xl transition-all duration-500 ease-out",
                            isActive ? "bg-primary-light/10 scale-110 -translate-y-1.5" : "group-hover:bg-gray-100 dark:group-hover:bg-gray-800"
                        )}>
                            <Icon
                                size={28}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={classNames(
                                    "transition-transform",
                                    isActive && "animate-float"
                                )}
                            />

                            {/* Unread Badge - only for Chats, from real unread count */}
                            {tab.path === '/app/chat' && totalUnreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white dark:border-black shadow-lg shadow-red-500/30">
                                    {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                                </span>
                            )}

                            {/* Active Dot indicator */}
                            {isActive && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-light rounded-full blur-[1px]" />
                            )}
                        </div>

                        <span className={classNames(
                            "text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                            isActive ? "opacity-100 translate-y-[-2px] text-primary-light" : "opacity-0 translate-y-1"
                        )}>
                            {tab.label}
                        </span>
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default BottomNav;
