import React from 'react';
import { SettingsSection, SettingsRow, SliderRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import {
    Cpu, Trash2, Zap, Minimize2, Settings, Gauge
} from 'lucide-react';

const PerformanceSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const p = settings.performance;
    const upd = (patch: Partial<typeof p>) => updateSection('performance', patch);
    const [isOptimizing, setIsOptimizing] = React.useState(false);

    const runOptimizer = async () => {
        setIsOptimizing(true);
        await new Promise((r) => setTimeout(r, 2000));
        setIsOptimizing(false);
    };

    return (
        <div className="space-y-1">
            {/* One-tap optimize */}
            <div className="mx-4 mb-4">
                <button
                    onClick={runOptimizer}
                    disabled={isOptimizing}
                    className={`w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-3 transition-all duration-500 ${isOptimizing
                            ? 'bg-indigo-500/30 border border-indigo-500/30 cursor-wait'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                >
                    <Gauge size={20} className={isOptimizing ? 'animate-spin' : ''} />
                    {isOptimizing ? 'Optimizing WITS...' : '⚡ One-Tap Optimize'}
                </button>
            </div>

            <SettingsSection title="Auto Cleanup">
                <SettingsRow icon={<Trash2 size={16} />} label="Auto Cache Cleaner"
                    description="Periodically clear cached data"
                    checked={p.autoCacheClean} onToggle={(v) => upd({ autoCacheClean: v })} />
                <SettingsRow icon={<Trash2 size={16} />} label="Auto Junk File Cleaner"
                    description="Remove temp and orphaned files automatically"
                    checked={p.autoJunkClean} onToggle={(v) => upd({ autoJunkClean: v })} />
            </SettingsSection>

            <SettingsSection title="Memory & CPU">
                <SettingsRow icon={<Cpu size={16} />} label="Memory Optimizer"
                    description="Aggressively free RAM when app is backgrounded"
                    checked={p.memoryOptimizer} onToggle={(v) => upd({ memoryOptimizer: v })} />
                <SettingsRow icon={<Minimize2 size={16} />} label="Lightweight Mode"
                    description="Reduce all visual effects for minimal resource use"
                    checked={p.lightweightMode} onToggle={(v) => upd({ lightweightMode: v })} />
                <SettingsRow icon={<Settings size={16} />} label="Background Task Manager"
                    description="Control which tasks run when app is backgrounded"
                    checked={p.backgroundTaskManager} onToggle={(v) => upd({ backgroundTaskManager: v })} />
            </SettingsSection>

            <SettingsSection title="Loading">
                <SettingsRow icon={<Zap size={16} />} label="Fast Message Loading"
                    description="Pre-cache recent messages for instant access"
                    checked={p.fastMessageLoading} onToggle={(v) => upd({ fastMessageLoading: v })} badge="BOOST" />
            </SettingsSection>
        </div>
    );
};

export default PerformanceSettings;
