import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, Contact, Compass, LayoutGrid, Wallet, Settings, UserCircle } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';

const tabs = [
    { path: '/chats', label: 'Chats', icon: MessageSquare },
    { path: '/contacts', label: 'Contacts', icon: Contact },
    { path: '/moments', label: 'Discover', icon: Compass },
    { path: '/discover', label: 'Mini Apps', icon: LayoutGrid },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
    { path: '/profile', label: 'Me', icon: UserCircle },
];

const NavRail = () => {
    const { isExpanded } = useResponsive();

    // On large desktop, it becomes a permanent drawer
    const widthClass = isExpanded ? 'w-[240px]' : 'w-[80px]';

    return (
        <nav className={`h-full ${widthClass} bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-6 z-50 transition-all duration-300`}>
            <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                <span className="text-white font-bold text-lg">W</span>
            </div>

            <div className="flex-1 w-full flex flex-col gap-2 items-center">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <NavLink
                            key={tab.path}
                            to={tab.path}
                            className={({ isActive }) =>
                                `flex items-center rounded-2xl transition-all duration-200 group
                 ${isExpanded ? 'w-[200px] h-[56px] px-4 justify-start' : 'w-14 h-[56px] justify-center flex-col'}
                 ${isActive
                                    ? 'bg-primary-container-light dark:bg-primary-container-dark text-on-primary-container-light dark:text-primary-dark font-medium'
                                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={isExpanded ? 24 : 26} strokeWidth={isActive ? 2.5 : 2} />
                                    {isExpanded && <span className="ml-4 text-[14px]">{tab.label}</span>}
                                    {!isExpanded && <span className="text-[11px] mt-1 hidden">{tab.label}</span>}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>

            {/* Footer Area / Settings */}
            <div className="mt-auto w-full flex items-center justify-center pb-4">
                <button className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:scale-105 transition-transform">
                    <Settings size={22} />
                </button>
            </div>
        </nav>
    );
};

export default NavRail;
