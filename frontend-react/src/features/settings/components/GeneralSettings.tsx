import React from 'react';
import { SettingsSection, SettingsRow, SliderRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import { Type, Monitor, Zap, Eye, FlaskConical, AlignCenter, Bell, Globe } from 'lucide-react';

const LANGUAGES = [
    { code: 'en', label: '🇺🇸 English' },
    { code: 'ar', label: '🇸🇦 Arabic' },
    { code: 'fr', label: '🇫🇷 French' },
    { code: 'de', label: '🇩🇪 German' },
    { code: 'es', label: '🇪🇸 Spanish' },
    { code: 'pt', label: '🇧🇷 Portuguese' },
    { code: 'hi', label: '🇮🇳 Hindi' },
    { code: 'zh', label: '🇨🇳 Chinese' },
    { code: 'ja', label: '🇯🇵 Japanese' },
    { code: 'ko', label: '🇰🇷 Korean' },
];

const GeneralSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const g = settings.general;
    const upd = (patch: Partial<typeof g>) => updateSection('general', patch);

    return (
        <div className="space-y-1">
            <SettingsSection title="Interface Scaling">
                <SliderRow
                    icon={<Type size={16} />}
                    label="Text Size Scale"
                    description="Adjust global text size across the app"
                    value={g.textSizeScale}
                    min={0.8} max={1.4} step={0.05}
                    onChange={(v) => upd({ textSizeScale: v })}
                    format={(v) => `${Math.round(v * 100)}%`}
                />
                <SliderRow
                    icon={<Monitor size={16} />}
                    label="Screen DPI Scale"
                    description="Adjust rendering density"
                    value={g.screenDpiScale}
                    min={0.8} max={1.4} step={0.05}
                    onChange={(v) => upd({ screenDpiScale: v })}
                    format={(v) => `${Math.round(v * 100)}%`}
                />
            </SettingsSection>

            <SettingsSection title="Effects">
                <SettingsRow icon={<Zap size={16} />} label="Disable Animations"
                    description="Remove motion effects for better performance"
                    checked={g.disableAnimations} onToggle={(v) => upd({ disableAnimations: v })} />
                <SettingsRow icon={<Eye size={16} />} label="Disable Blur Effects"
                    description="Remove backdrop-blur for lower GPU usage"
                    checked={g.disableBlurEffects} onToggle={(v) => upd({ disableBlurEffects: v })} />
            </SettingsSection>

            <SettingsSection title="Beta Access">
                <SettingsRow icon={<FlaskConical size={16} />} label="Enable Beta Features"
                    description="Unlock experimental and unreleased features"
                    checked={g.enableBetaFeatures} onToggle={(v) => upd({ enableBetaFeatures: v })} badge="BETA" />
            </SettingsSection>

            <SettingsSection title="Language">
                <div className="px-4 py-3.5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-500/15 text-indigo-400">
                            <Globe size={16} />
                        </div>
                        <p className="text-sm font-medium text-white">App Language</p>
                    </div>
                    <select
                        value={g.language}
                        onChange={(e) => upd({ language: e.target.value })}
                        className="w-full bg-white/8 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {LANGUAGES.map((l) => (
                            <option key={l.code} value={l.code} className="bg-gray-900">{l.label}</option>
                        ))}
                    </select>
                </div>
            </SettingsSection>

            <SettingsSection title="Status Bar & Icons">
                <SliderRow
                    icon={<AlignCenter size={16} />}
                    label="Custom Status Bar Height"
                    description="Override native status bar height (px)"
                    value={g.customStatusBarHeight}
                    min={0} max={60} step={1}
                    onChange={(v) => upd({ customStatusBarHeight: v })}
                    format={(v) => `${v}px`}
                />
                <div className="px-4 py-3.5 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-500/15 text-indigo-400">
                            <Bell size={16} />
                        </div>
                        <p className="text-sm font-medium text-white">Custom Notification Icon URL</p>
                    </div>
                    <input
                        type="url"
                        value={g.customNotificationIcon}
                        onChange={(e) => upd({ customNotificationIcon: e.target.value })}
                        placeholder="https://example.com/icon.png"
                        className="w-full bg-white/8 border border-white/10 text-white rounded-xl px-3 py-2 text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </SettingsSection>
        </div>
    );
};

export default GeneralSettings;
