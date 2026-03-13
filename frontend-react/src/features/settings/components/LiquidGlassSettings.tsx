import React from 'react';
import { SettingsSection, SettingsRow, SliderRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import {
    Layers, Droplets, MessageSquare, Wind
} from 'lucide-react';

const LiquidGlassSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const lg = settings.liquidglass;
    const upd = (patch: Partial<typeof lg>) => updateSection('liquidglass', patch);

    return (
        <div className="space-y-1">
            {/* Live Preview */}
            <div className="mx-4 mb-4 relative overflow-hidden rounded-2xl border border-white/10 h-32">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20" />
                {lg.blurBackgrounds && (
                    <div
                        className="absolute inset-0"
                        style={{ backdropFilter: `blur(${lg.blurIntensity}px)` }}
                    />
                )}
                <div className={`absolute inset-0 flex items-center justify-center ${lg.enabled ? '' : 'opacity-30'}`}>
                    <div className={`px-4 py-2 rounded-2xl text-white text-sm font-medium ${lg.translucentPanels
                            ? 'bg-white/10 backdrop-blur-md border border-white/20'
                            : 'bg-white/20'
                        }`}>
                        {lg.enabled ? '✨ Liquid Glass Active' : 'Glass UI Disabled'}
                    </div>
                </div>
                <div className="absolute top-2 right-2 text-[10px] text-white/40 uppercase tracking-widest">PREVIEW</div>
            </div>

            <SettingsSection title="Liquid Glass Engine">
                <SettingsRow icon={<Droplets size={16} />} label="Enable Liquid Glass UI"
                    description="iOS-inspired frosted glass interface"
                    checked={lg.enabled} onToggle={(v) => upd({ enabled: v })} badge="iOS" />
                <SettingsRow icon={<Layers size={16} />} label="Translucent Panels"
                    description="Make UI panels semi-transparent"
                    checked={lg.translucentPanels} onToggle={(v) => upd({ translucentPanels: v })} disabled={!lg.enabled} />
                <SettingsRow icon={<Wind size={16} />} label="Blur Backgrounds"
                    description="Apply backdrop blur behind panels"
                    checked={lg.blurBackgrounds} onToggle={(v) => upd({ blurBackgrounds: v })} disabled={!lg.enabled} />
                <SettingsRow icon={<MessageSquare size={16} />} label="Glass Message Input"
                    description="Frosted glass chat input bar"
                    checked={lg.glassMessageInput} onToggle={(v) => upd({ glassMessageInput: v })} disabled={!lg.enabled} />
            </SettingsSection>

            {lg.enabled && (
                <SettingsSection title="Intensity">
                    <SliderRow
                        icon={<Wind size={16} />}
                        label="Blur Intensity"
                        description="How much blur to apply to backgrounds"
                        value={lg.blurIntensity}
                        min={0} max={30} step={1}
                        onChange={(v) => upd({ blurIntensity: v })}
                        format={(v) => `${v}px`}
                    />
                </SettingsSection>
            )}
        </div>
    );
};

export default LiquidGlassSettings;
