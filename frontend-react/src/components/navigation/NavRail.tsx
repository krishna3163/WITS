import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Home, MessageSquare, Users, Compass, Store, SlidersHorizontal
} from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';
import classNames from 'classnames';

const TABS = [
    { path: '/app/home', label: 'Home', icon: Home },
    { path: '/app/chat', label: 'Chats', icon: MessageSquare },
    { path: '/app/contacts', label: 'Contacts', icon: Users },
    { path: '/app/discover', label: 'Discover', icon: Compass },
    { path: '/app/store', label: 'Market', icon: Store },
    { path: '/app/settings', label: 'Settings', icon: SlidersHorizontal },
];

const NavRail = () => {
    const { isExpanded } = useResponsive();
    const location = useLocation();

    // Width classes
    const containerClass = isExpanded ? 'w-64' : 'w-20';

    return (
        <nav className={classNames(
            "h-full flex flex-col bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-gray-800 transition-all duration-500 z-50",
            containerClass
        )}>
            {/* Logo */}
            <div className="h-20 flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-tr from-primary-light to-blue-600 rounded-[18px] flex items-center justify-center text-white shadow-xl shadow-primary-light/30">
                    <span className="font-black text-2xl tracking-tighter">W</span>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 px-3 py-4 space-y-2 overflow-y-auto no-scrollbar">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = location.pathname.startsWith(tab.path);

                    return (
                        <NavLink
                            key={tab.path}
                            to={tab.path}
                            className={classNames(
                                "flex items-center gap-4 p-3 rounded-[20px] transition-all duration-300 group relative",
                                isActive
                                    ? "bg-primary-light text-white shadow-lg shadow-primary-light/20"
                                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                        >
                            <div className={classNames(
                                "transition-transform group-active:scale-90",
                                !isExpanded && "w-full flex justify-center"
                            )}>
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </div>

                            {isExpanded && (
                                <span className="font-bold text-sm tracking-tight">{tab.label}</span>
                            )}

                            {/* Tooltip for collapsed rail */}
                            {!isExpanded && (
                                <div className="absolute left-20 bg-gray-900 text-white px-3 py-2 rounded-xl text-[10px] font-bold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                    {tab.label}
                                </div>
                            )}
                        </NavLink>
                    );
                })}
            </div>

            {/* Footer / App Version */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                <div className={classNames(
                    "flex flex-col gap-1 transition-opacity",
                    isExpanded ? "opacity-100" : "opacity-0"
                )}>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Version Alpha</span>
                    <span className="text-[10px] text-gray-400">© 2026 WITS Platform</span>
                </div>
            </div>
        </nav>
    );
};

export default NavRail;
