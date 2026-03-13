import React, { useState } from 'react';
import { SettingsSection, SettingsRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import { Home, User, Filter, Archive, Zap, GripVertical } from 'lucide-react';

const TAB_IDS = ['chats', 'communities', 'updates', 'calls', 'settings'] as const;

const HomeScreenSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const h = settings.homescreen;
    const upd = (patch: Partial<typeof h>) => updateSection('homescreen', patch);
    const [dragging, setDragging] = useState<number | null>(null);

    const tabOrder = h.tabOrder.length ? h.tabOrder : [...TAB_IDS];
    const displayOrder = tabOrder.filter((t) => TAB_IDS.includes(t as typeof TAB_IDS[number]));
    const missing = TAB_IDS.filter((t) => !displayOrder.includes(t));
    const ordered = [...displayOrder, ...missing];

    const moveTab = (fromIndex: number, toIndex: number) => {
        const next = [...ordered];
        const [removed] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, removed);
        upd({ tabOrder: next });
        setDragging(null);
    };

    const label = (id: string) => {
        const labels: Record<string, string> = {
            chats: 'Chats',
            communities: 'Communities',
            updates: 'Updates',
            calls: 'Calls',
            settings: 'Settings',
        };
        return labels[id] || id;
    };

    return (
        <div className="space-y-1">
            <SettingsSection title="Header & List">
                <SettingsRow
                    icon={<User size={16} />}
                    label="Show Username in Header"
                    description="Display your username in the main header"
                    checked={h.showUsernameInHeader}
                    onToggle={(v) => upd({ showUsernameInHeader: v })}
                />
                <SettingsRow
                    icon={<Filter size={16} />}
                    label="Disable Chat Filters"
                    description="Hide filter tabs (All, Unread, etc.)"
                    checked={h.disableChatFilters}
                    onToggle={(v) => upd({ disableChatFilters: v })}
                />
                <SettingsRow
                    icon={<Archive size={16} />}
                    label="Hide Archived Chats"
                    description="Do not show archived chats in the list"
                    checked={h.hideArchivedChats}
                    onToggle={(v) => upd({ hideArchivedChats: v })}
                />
                <SettingsRow
                    icon={<Zap size={16} />}
                    label="Hide Floating Buttons"
                    description="Hide FAB and floating action buttons"
                    checked={h.hideFloatingButtons}
                    onToggle={(v) => upd({ hideFloatingButtons: v })}
                />
            </SettingsSection>

            <SettingsSection title="Tab Order">
                <div className="px-4 py-3">
                    <p className="text-xs text-white/40 mb-3">Drag to reorder. Order applies to bottom navigation and home tabs.</p>
                    <div className="space-y-1">
                        {ordered.map((id, index) => (
                            <div
                                key={id}
                                draggable
                                onDragStart={() => setDragging(index)}
                                onDragEnd={() => setDragging(null)}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    if (dragging === null || dragging === index) return;
                                    moveTab(dragging, index);
                                }}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 cursor-grab active:cursor-grabbing ${dragging === index ? 'opacity-50' : ''}`}
                            >
                                <GripVertical size={16} className="text-white/30 flex-shrink-0" />
                                <span className="text-sm font-medium text-white flex-1">{label(id)}</span>
                                <span className="text-xs text-white/30">#{index + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
};

export default HomeScreenSettings;
