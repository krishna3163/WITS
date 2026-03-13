import React from 'react';
import { SettingsSection, SettingsRow, SliderRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import { Bug, Flag, FlaskConical, Server, Activity, MonitorDot, Network } from 'lucide-react';

const LOG_LEVELS = ['error', 'warn', 'info', 'debug', 'verbose'] as const;

const DeveloperSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const d = settings.developer;
    const upd = (patch: Partial<typeof d>) => updateSection('developer', patch);

    return (
        <div className="space-y-1">
            {/* Dev Warning Banner */}
            <div className="mx-4 mb-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex gap-3">
                <Bug size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-semibold text-amber-300">Developer Mode</p>
                    <p className="text-xs text-amber-300/60 mt-0.5">
                        These settings are intended for developers and advanced users. Incorrect configuration may cause instability.
                    </p>
                </div>
            </div>

            <SettingsSection title="Dev Tools">
                <SettingsRow icon={<Bug size={16} />} label="Debug Mode"
                    description="Enable verbose error output and debug overlays"
                    checked={d.debugMode} onToggle={(v) => upd({ debugMode: v })} badge="DEV" />
                <SettingsRow icon={<Flag size={16} />} label="Feature Flags"
                    description="Enable or disable individual feature toggles"
                    checked={d.featureFlagsEnabled} onToggle={(v) => upd({ featureFlagsEnabled: v })} />
                <SettingsRow icon={<FlaskConical size={16} />} label="Override Experimental Features"
                    description="Force-enable dev-flag gated features"
                    checked={d.overrideExperimental} onToggle={(v) => upd({ overrideExperimental: v })} badge="DANGER" danger />
                <SettingsRow icon={<MonitorDot size={16} />} label="FPS Counter"
                    description="Show frames-per-second in corner"
                    checked={d.showFpsCounter} onToggle={(v) => upd({ showFpsCounter: v })} />
                <SettingsRow icon={<Network size={16} />} label="Network Inspector"
                    description="Monitor all API requests in real-time"
                    checked={d.networkInspector} onToggle={(v) => upd({ networkInspector: v })} />
            </SettingsSection>

            <SettingsSection title="Custom API">
                <div className="px-4 py-3.5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-500/15 text-indigo-400">
                            <Server size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Custom API Endpoint</p>
                            <p className="text-xs text-white/40">Override the backend endpoint</p>
                        </div>
                    </div>
                    <input
                        type="url"
                        value={d.customApiEndpoint}
                        onChange={(e) => upd({ customApiEndpoint: e.target.value })}
                        placeholder="https://api.yourdomain.com"
                        className="w-full bg-white/8 border border-white/10 text-white rounded-xl px-3 py-2 text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </SettingsSection>

            <SettingsSection title="Animation Tuning">
                <SliderRow
                    icon={<Activity size={16} />}
                    label="Animation Speed Multiplier"
                    description="1.0 = normal, 0.5 = slow, 2.0 = fast"
                    value={d.animationTimingMultiplier}
                    min={0.1} max={3.0} step={0.1}
                    onChange={(v) => upd({ animationTimingMultiplier: v })}
                    format={(v) => `${v.toFixed(1)}×`}
                />
            </SettingsSection>

            <SettingsSection title="Log Level">
                <div className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                        {LOG_LEVELS.map((level) => (
                            <button
                                key={level}
                                onClick={() => upd({ logLevel: level })}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${d.logLevel === level
                                        ? level === 'error' ? 'bg-red-500/30 border border-red-500/50 text-red-300'
                                            : level === 'warn' ? 'bg-amber-500/30 border border-amber-500/50 text-amber-300'
                                                : level === 'debug' || level === 'verbose' ? 'bg-purple-500/30 border border-purple-500/50 text-purple-300'
                                                    : 'bg-indigo-500/30 border border-indigo-500/50 text-indigo-300'
                                        : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
};

export default DeveloperSettings;
