import React from 'react';
import { ChevronRight, Shield, Bell, Key, HelpCircle, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useResponsive } from '../../hooks/useResponsive';
import classNames from 'classnames';

const SETTINGS_CATEGORIES = [
    {
        group: "Account",
        items: [
            { icon: Shield, label: "Privacy & Security", color: "bg-blue-100 text-blue-600" },
            { icon: Key, label: "Account Management", color: "bg-orange-100 text-orange-600" },
            { icon: Bell, label: "Notifications", color: "bg-green-100 text-green-600" }
        ]
    },
    {
        group: "App",
        items: [
            { icon: SettingsIcon, label: "General Settings", color: "bg-gray-100 text-gray-600" },
            { icon: HelpCircle, label: "Help Center", color: "bg-indigo-100 text-indigo-600" }
        ]
    }
];

const ProfilePage = () => {
    const { isExpanded } = useResponsive();

    return (
        <div className="h-full w-full bg-[#f4f6f8] dark:bg-[#0A0A0A] overflow-y-auto pb-24 scroll-smooth">
            {/* Profile Header Block */}
            <div className="bg-white dark:bg-[#1A1C1E] pb-8 pt-16 px-6 shadow-sm">
                <div className={classNames("flex items-center gap-6", { "max-w-3xl mx-auto": isExpanded })}>
                    <div className="w-24 h-24 rounded-[32px] overflow-hidden shadow-lg border-2 border-white dark:border-gray-800">
                        <img src="https://i.pravatar.cc/300?u=me" alt="My Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-[28px] font-bold text-gray-900 dark:text-white tracking-tight">John Doe</h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">My WITS ID: john_doe_99</p>
                        <div className="flex items-center gap-4">
                            <span className="bg-primary-light/10 text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark px-3 py-1 rounded-full text-xs font-semibold">
                                + Add Status
                            </span>
                        </div>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <ChevronRight className="text-gray-500" />
                    </button>
                </div>
            </div>

            <div className={classNames("px-4 md:px-6 w-full mt-6", { "max-w-3xl mx-auto": isExpanded })}>

                {/* Settings Sections */}
                {SETTINGS_CATEGORIES.map((category, i) => (
                    <div key={i} className="mb-6 animate-in slide-in-from-bottom-4 duration-500 fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                        <h3 className="text-sm font-bold text-gray-500 ml-4 mb-2">{category.group}</h3>
                        <div className="bg-white dark:bg-[#1A1C1E] rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                            {category.items.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.label}
                                        className={classNames(
                                            "flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors active:bg-gray-100",
                                            { "border-b border-gray-100 dark:border-gray-800/50": idx !== category.items.length - 1 }
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={classNames("w-10 h-10 rounded-xl flex items-center justify-center", item.color)}>
                                                <Icon size={20} />
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-gray-200">{item.label}</span>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-400" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Global Action / Logout */}
                <div className="mt-8 mb-4">
                    <button className="w-full bg-white dark:bg-[#1A1C1E] text-red-500 font-bold text-lg py-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                        <LogOut size={22} /> Log Out
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;
