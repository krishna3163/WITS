import React from 'react';
import { SettingsSection, SettingsRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import { Palette, Layers, Image } from 'lucide-react';

const ColorPicker: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3">
            <div
                className="w-8 h-8 rounded-xl border-2 border-white/10 shadow-lg cursor-pointer ring-2 ring-offset-2 ring-offset-transparent transition-all"
                style={{ backgroundColor: value, ringColor: value }}
            />
            <p className="text-sm font-medium text-white">{label}</p>
        </div>
        <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-8 rounded-lg cursor-pointer bg-transparent border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-0"
        />
    </div>
);

const ColorSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const c = settings.colors;
    const upd = (patch: Partial<typeof c>) => updateSection('colors', patch);

    const presets = [
        { name: 'WITS Dark', primary: '#6366f1', secondary: '#8b5cf6', bg: '#0f0f1a', header: '#1e1e2e' },
        { name: 'Ocean', primary: '#0ea5e9', secondary: '#6366f1', bg: '#0c1929', header: '#0f2133' },
        { name: 'Rose Gold', primary: '#f43f5e', secondary: '#fb7185', bg: '#1a0c0f', header: '#2d1215' },
        { name: 'Forest', primary: '#22c55e', secondary: '#4ade80', bg: '#0a1a0f', header: '#0f2a18' },
        { name: 'Sunset', primary: '#f97316', secondary: '#fb923c', bg: '#1a100a', header: '#2a1a0f' },
        { name: 'Midnight', primary: '#94a3b8', secondary: '#cbd5e1', bg: '#0a0a0f', header: '#111118' },
    ];

    return (
        <div className="space-y-1">
            <SettingsSection title="Quick Theme Presets">
                <div className="px-4 py-3">
                    <div className="grid grid-cols-3 gap-2">
                        {presets.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => upd({
                                    primaryColor: preset.primary,
                                    secondaryColor: preset.secondary,
                                    backgroundColor: preset.bg,
                                    headerColor: preset.header,
                                    footerColor: preset.header,
                                })}
                                className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-white/8 hover:border-white/20 transition-colors bg-white/5 group"
                            >
                                <div className="flex gap-1">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                                </div>
                                <span className="text-[10px] font-semibold text-white/60 group-hover:text-white/90 transition-colors">{preset.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Custom Colors">
                <ColorPicker label="Primary Color" value={c.primaryColor} onChange={(v) => upd({ primaryColor: v })} />
                <ColorPicker label="Secondary Color" value={c.secondaryColor} onChange={(v) => upd({ secondaryColor: v })} />
                <ColorPicker label="Header Color" value={c.headerColor} onChange={(v) => upd({ headerColor: v })} />
                <ColorPicker label="Footer / Nav Bar" value={c.footerColor} onChange={(v) => upd({ footerColor: v })} />
                <ColorPicker label="Background Color" value={c.backgroundColor} onChange={(v) => upd({ backgroundColor: v })} />
            </SettingsSection>

            <SettingsSection title="Gradient Background">
                <SettingsRow icon={<Layers size={16} />} label="Enable Gradient Background"
                    checked={c.gradientEnabled} onToggle={(v) => upd({ gradientEnabled: v })} badge="NEW" />
                {c.gradientEnabled && (
                    <>
                        <ColorPicker label="Gradient Start" value={c.gradientStart} onChange={(v) => upd({ gradientStart: v })} />
                        <ColorPicker label="Gradient End" value={c.gradientEnd} onChange={(v) => upd({ gradientEnd: v })} />
                    </>
                )}
            </SettingsSection>

            <SettingsSection title="Wallpaper">
                <div className="px-4 py-3.5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-500/15 text-indigo-400">
                            <Image size={16} />
                        </div>
                        <p className="text-sm font-medium text-white">Wallpaper URL</p>
                    </div>
                    <input
                        type="url"
                        value={c.wallpaperUrl}
                        onChange={(e) => upd({ wallpaperUrl: e.target.value })}
                        placeholder="https://example.com/wallpaper.jpg"
                        className="w-full bg-white/8 border border-white/10 text-white rounded-xl px-3 py-2 text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {c.wallpaperUrl && (
                        <div className="mt-2 rounded-xl overflow-hidden h-24 bg-white/5">
                            <img src={c.wallpaperUrl} alt="Wallpaper preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                    )}
                </div>
            </SettingsSection>
        </div>
    );
};

export default ColorSettings;
