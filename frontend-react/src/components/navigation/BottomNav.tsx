import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Contact, Compass, LayoutGrid, Wallet, UserCircle } from 'lucide-react';

const tabs = [
    { path: '/chats', label: 'Chats', icon: MessageSquare },
    { path: '/contacts', label: 'Contacts', icon: Contact },
    { path: '/moments', label: 'Discover', icon: Compass },
    { path: '/discover', label: 'Mini Apps', icon: LayoutGrid },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
    { path: '/profile', label: 'Me', icon: UserCircle },
];

const BottomNav = () => {
    return (
        <nav className="fixed bottom-0 w-full h-[80px] bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 flex items-center justify-around px-2 z-50">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center w-16 h-[64px] rounded-2xl transition-all duration-300 group
               ${isActive ? 'text-primary-light dark:text-primary-dark font-medium'
                                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`
                  p-1.5 rounded-2xl transition-colors duration-300
                  ${isActive ? 'bg-primary-container-light dark:bg-primary-container-dark -translate-y-1' : ''}
                `}>
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="transition-transform group-active:scale-95" />
                                </div>
                                <span className={`text-[11px] mt-1 transition-all ${isActive ? 'translate-y-[-2px]' : ''}`}>
                                    {tab.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default BottomNav;
