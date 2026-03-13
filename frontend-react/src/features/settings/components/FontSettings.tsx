import React from 'react';
import { SettingsSection, SettingsRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import { Type, Download, Bell, Smartphone, Tag } from 'lucide-react';

const FONTS = [
    'Inter', 'Roboto', 'Outfit', 'Poppins', 'Nunito', 'Raleway',
    'Space Grotesk', 'DM Sans', 'Plus Jakarta Sans', 'Sora',
    'Cairo', 'Tajawal', 'Noto Sans Arabic'
];

const FontSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const f = settings.fonts;
    const upd = (patch: Partial<typeof f>) => updateSection('fonts', patch);

    const FontSelect: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
        <div className="px-4 py-3.5">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">{label}</p>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
                {FONTS.map((font) => (
                    <button
                        key={font}
                        onClick={() => onChange(font)}
                        className={`px-3 py-2 rounded-xl text-sm text-left transition-all duration-200 ${value === font
                                ? 'bg-indigo-500/30 border border-indigo-500/50 text-indigo-300'
                                : 'bg-white/5 border border-white/8 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                        style={{ fontFamily: font }}
                    >
                        {font}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-1">
            <SettingsSection title="Title Font">
                <FontSelect label="Select Title Font" value={f.titleFont} onChange={(v) => upd({ titleFont: v })} />
            </SettingsSection>

            <SettingsSection title="Message Font">
                <FontSelect label="Select Message Font" value={f.messageFont} onChange={(v) => upd({ messageFont: v })} />
            </SettingsSection>

            <SettingsSection title="Custom Font">
                <div className="px-4 py-3.5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-500/15 text-indigo-400">
                            <Download size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Custom Font URL</p>
                            <p className="text-xs text-white/40">Paste a .ttf or .woff2 URL</p>
                        </div>
                    </div>
                    <input
                        type="url"
                        value={f.customFontUrl}
                        onChange={(e) => upd({ customFontUrl: e.target.value })}
                        placeholder="https://fonts.example.com/myfont.ttf"
                        className="w-full bg-white/8 border border-white/10 text-white rounded-xl px-3 py-2 text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </SettingsSection>

            <SettingsSection title="App Identity">
                <div className="px-4 py-3.5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-500/15 text-indigo-400">
                            <Tag size={16} />
                        </div>
                        <p className="text-sm font-medium text-white">App Display Name</p>
                    </div>
                    <input
                        type="text"
                        value={f.appName}
                        onChange={(e) => upd({ appName: e.target.value })}
                        placeholder="WITS"
                        maxLength={20}
                        className="w-full bg-white/8 border border-white/10 text-white rounded-xl px-3 py-2 text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="px-4 py-3.5 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-500/15 text-indigo-400">
                            <Bell size={16} />
                        </div>
                        <p className="text-sm font-medium text-white">Custom Notification Icon URL</p>
                    </div>
                    <input
                        type="url"
                        value={f.notificationIcon}
                        onChange={(e) => upd({ notificationIcon: e.target.value })}
                        placeholder="https://example.com/icon.png"
                        className="w-full bg-white/8 border border-white/10 text-white rounded-xl px-3 py-2 text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </SettingsSection>
        </div>
    );
};

export default FontSettings;
