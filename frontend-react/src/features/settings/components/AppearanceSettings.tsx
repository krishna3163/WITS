import React from 'react';
import { SettingsSection, SettingsRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import { Moon, Sun, Monitor, Palette, Navigation, Layout } from 'lucide-react';

const AppearanceSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const a = settings.appearance;
    const upd = (patch: Partial<typeof a>) => updateSection('appearance', patch);

    const themes = [
        { id: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
        { id: 'light', label: 'Light', icon: Sun, desc: 'Classic bright mode' },
        { id: 'system', label: 'System', icon: Monitor, desc: 'Follow OS setting' },
        { id: 'amoled', label: 'AMOLED', icon: Moon, desc: 'Pure black for OLED' },
    ] as const;

    return (
        <div className="space-y-1">
            <SettingsSection title="Theme">
                <div className="px-4 py-3">
                    <div className="grid grid-cols-2 gap-2">
                        {themes.map((theme) => {
                            const Icon = theme.icon;
                            return (
                                <button
                                    key={theme.id}
                                    onClick={() => upd({ theme: theme.id })}
                                    className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all duration-200 text-left ${a.theme === theme.id
                                            ? 'border-indigo-500/60 bg-indigo-500/15 shadow-lg shadow-indigo-500/10'
                                            : 'border-white/8 bg-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${a.theme === theme.id ? 'bg-indigo-500/30 text-indigo-300' : 'bg-white/10 text-white/50'
                                        }`}>
                                        <Icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{theme.label}</p>
                                        <p className="text-[10px] text-white/40">{theme.desc}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Custom Navigation">
                <SettingsRow icon={<Navigation size={16} />} label="Custom Navigation Bar"
                    checked={a.customNavBar} onToggle={(v) => upd({ customNavBar: v })} />
                {a.customNavBar && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 hover:bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl" style={{ backgroundColor: a.customNavBarColor }} />
                            <p className="text-sm font-medium text-white">Nav Bar Color</p>
                        </div>
                        <input type="color" value={a.customNavBarColor} onChange={(e) => upd({ customNavBarColor: e.target.value })}
                            className="w-10 h-8 rounded-lg cursor-pointer bg-transparent border-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-0" />
                    </div>
                )}
            </SettingsSection>

            <SettingsSection title="Layout">
                <SettingsRow icon={<Layout size={16} />} label="Custom Header"
                    checked={a.customHeader} onToggle={(v) => upd({ customHeader: v })} />
                <SettingsRow icon={<Layout size={16} />} label="Custom Footer"
                    checked={a.customFooter} onToggle={(v) => upd({ customFooter: v })} />
            </SettingsSection>
        </div>
    );
};

export default AppearanceSettings;
