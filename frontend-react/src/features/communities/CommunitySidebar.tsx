import React from 'react';
import { Plus, Compass, Settings, Home, LayoutDashboard } from 'lucide-react';
import classNames from 'classnames';

interface CommunitySidebarProps {
    communities: any[];
    activeId: string | null;
    onSelect: (id: string | null) => void;
    onAdd: () => void;
}

export default function CommunitySidebar({ communities, activeId, onSelect, onAdd }: CommunitySidebarProps) {
    return (
        <div className="w-[72px] h-full bg-[#e3e5e8] dark:bg-[#0E1012] flex flex-col items-center py-4 gap-3 shrink-0 scroll-smooth no-scrollbar overflow-y-auto z-50">
            {/* Home / Global Chat */}
            <button
                onClick={() => onSelect(null)}
                className="group relative flex items-center justify-center"
            >
                <div className={classNames(
                    "absolute left-0 w-1 bg-gray-900 dark:bg-white rounded-r-full transition-all duration-300",
                    activeId === null ? "h-8" : "h-2 scale-0 group-hover:scale-100 group-hover:h-5"
                )} />
                <div className={classNames(
                    "w-12 h-12 flex items-center justify-center transition-all duration-200 shadow-sm",
                    activeId === null
                        ? "bg-primary-light text-white rounded-[16px]"
                        : "bg-white dark:bg-[#1A1C1E] text-gray-400 rounded-[24px] hover:rounded-[16px] hover:bg-primary-light hover:text-white"
                )}>
                    <LayoutDashboard size={24} />
                </div>

                {/* Tooltip Simulation */}
                <div className="absolute left-16 bg-black text-white text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest z-10 border border-white/10">
                    Dashboard
                </div>
            </button>

            <div className="w-8 h-[2px] bg-gray-300 dark:bg-white/10 rounded-full mx-auto" />

            {communities.map((c) => {
                const isActive = activeId === c.id;
                return (
                    <button
                        key={c.id}
                        onClick={() => onSelect(c.id)}
                        className="group relative flex items-center justify-center"
                    >
                        <div className={classNames(
                            "absolute left-0 w-1 bg-gray-900 dark:bg-white rounded-r-full transition-all duration-300",
                            isActive ? "h-10" : "h-2 scale-0 group-hover:scale-100 group-hover:h-5"
                        )} />

                        <div className={classNames(
                            "w-12 h-12 flex items-center justify-center overflow-hidden transition-all duration-200 shadow-lg",
                            isActive
                                ? "rounded-[16px] shadow-primary-light/20"
                                : "bg-white dark:bg-[#1A1C1E] rounded-[24px] hover:rounded-[16px] hover:bg-primary-light hover:shadow-primary-light/10"
                        )}>
                            {c.icon_url ? (
                                <img src={c.icon_url} alt={c.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className={classNames(
                                    "font-black text-lg transition-colors",
                                    isActive ? "text-white" : "text-gray-500 group-hover:text-white"
                                )}>
                                    {c.name[0].toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div className="absolute left-16 bg-black text-white text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest z-10 border border-white/10">
                            {c.name}
                        </div>
                    </button>
                );
            })}

            {/* Action Buttons */}
            <button
                onClick={onAdd}
                className="group relative flex items-center justify-center mt-auto"
            >
                <div className="w-12 h-12 bg-white dark:bg-[#1A1C1E] text-emerald-500 rounded-[24px] hover:rounded-[16px] hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all duration-200">
                    <Plus size={24} />
                </div>
                <div className="absolute left-16 bg-black text-white text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest z-10 border border-white/10">
                    Add Community
                </div>
            </button>

            <button
                className="group relative flex items-center justify-center mb-4"
            >
                <div className="w-12 h-12 bg-white dark:bg-[#1A1C1E] text-blue-500 rounded-[24px] hover:rounded-[16px] hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-200">
                    <Compass size={24} />
                </div>
                <div className="absolute left-16 bg-black text-white text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest z-10 border border-white/10">
                    Discover
                </div>
            </button>
        </div>
    );
}
