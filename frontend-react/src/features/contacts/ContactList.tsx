import React, { useState } from 'react';
import { Search, UserPlus, MoreVertical, ScanLine } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';
import classNames from 'classnames';

const CONTACTS = [
    { letter: 'A', users: [{ id: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice', status: 'Online' }] },
    { letter: 'B', users: [{ id: 2, name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob', status: 'Last seen 2h ago' }] },
    {
        letter: 'C', users: [
            { id: 3, name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=charlie', status: 'At work' },
            { id: 4, name: 'Coffee Enthusiasts', avatar: 'https://i.pravatar.cc/150?u=coffee', status: 'Group · 42 members' }
        ]
    },
    { letter: 'D', users: [{ id: 5, name: 'Diana', avatar: 'https://i.pravatar.cc/150?u=diana', status: 'Available' }] },
];

const ContactList = () => {
    const { isExpanded } = useResponsive();

    return (
        <div className="h-full w-full bg-surface-light dark:bg-surface-dark overflow-y-auto pb-24 scroll-smooth">
            {/* Header */}
            <div className="px-5 pt-12 pb-4 bg-white/50 dark:bg-black/20 backdrop-blur-md sticky top-0 z-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-[32px] font-semibold tracking-tight text-gray-900 dark:text-gray-100">Contacts</h1>
                    <div className="flex gap-4">
                        <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                            <UserPlus size={20} />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative group mb-4">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={20} className="text-gray-400 group-focus-within:text-primary-light transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Contacts"
                        className="w-full bg-surface-variant-light/50 dark:bg-surface-variant-dark bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-[28px] py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-light/50 transition-all font-medium"
                    />
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4 mb-2 overflow-x-auto no-scrollbar py-2">
                    <button className="flex flex-col items-center gap-2 min-w-[72px]">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center"><UserPlus size={24} /></div>
                        <span className="text-xs font-medium dark:text-gray-300">New Friend</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 min-w-[72px]">
                        <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center"><Users size={24} /></div>
                        <span className="text-xs font-medium dark:text-gray-300">Group Chat</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 min-w-[72px]">
                        <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center"><ScanLine size={24} /></div>
                        <span className="text-xs font-medium dark:text-gray-300">Scan QR</span>
                    </button>
                </div>
            </div>

            {/* Directory List */}
            <div className={classNames("px-4", { "max-w-2xl mx-auto": isExpanded })}>
                {CONTACTS.map(group => (
                    <div key={group.letter} className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <h3 className="text-sm font-bold text-gray-500 ml-2 mb-2">{group.letter}</h3>
                        <div className="bg-white dark:bg-[#1A1C1E] rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                            {group.users.map((user, idx) => (
                                <div
                                    key={user.id}
                                    className={classNames(
                                        "flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                                        { "border-b border-gray-100 dark:border-gray-800": idx !== group.users.length - 1 }
                                    )}
                                >
                                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{user.name}</h4>
                                        <p className="text-xs text-gray-500">{user.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// SVG Icon for Users (since not imported directly above)
const Users = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

export default ContactList;
