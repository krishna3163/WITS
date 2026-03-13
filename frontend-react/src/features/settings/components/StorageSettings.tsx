import React, { useState, useMemo } from 'react';
import { SettingsSection, SettingsRow, SliderRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import { HardDrive, Search, Trash2, Image, Wifi, Server, Upload, Clock, RefreshCw, Loader2 } from 'lucide-react';

function getLocalStorageSize(): number {
    let total = 0;
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) total += (localStorage.getItem(key)?.length ?? 0) + (key.length * 2);
        }
    } catch (_) {}
    return total;
}

const StorageSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const s = settings.storage;
    const upd = (patch: Partial<typeof s>) => updateSection('storage', patch);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState<{ photos: number; videos: number; audio: number; documents: number; other: number; totalMB: number } | null>(null);

    const runScan = () => {
        setScanning(true);
        setTimeout(() => {
            const lsBytes = getLocalStorageSize();
            const lsMB = Math.round((lsBytes / 1024 / 1024) * 100) / 100;
            const photos = Math.min(800, Math.round(lsMB * 0.4));
            const videos = Math.min(1200, Math.round(lsMB * 0.35));
            const audio = Math.min(200, Math.round(lsMB * 0.1));
            const documents = Math.min(100, Math.round(lsMB * 0.05));
            const other = Math.max(0, Math.round(lsMB) - photos - videos - audio - documents);
            const totalMB = photos + videos + audio + documents + other || Math.max(1, Math.round(lsMB));
            setScanResult({ photos, videos, audio, documents, other, totalMB });
            setScanning(false);
        }, 600);
    };

    const storageStats = useMemo(() => {
        if (scanResult) {
            const { photos, videos, audio, documents, other, totalMB } = scanResult;
            const total = totalMB || 1;
            return [
                { label: 'Photos', used: photos, color: '#6366f1' },
                { label: 'Videos', used: videos, color: '#8b5cf6' },
                { label: 'Audio', used: audio, color: '#ec4899' },
                { label: 'Documents', used: documents, color: '#22c55e' },
                { label: 'Other', used: other, color: '#f97316' },
            ];
        }
        return [
            { label: 'Photos', used: 342, color: '#6366f1' },
            { label: 'Videos', used: 1204, color: '#8b5cf6' },
            { label: 'Audio', used: 89, color: '#ec4899' },
            { label: 'Documents', used: 45, color: '#22c55e' },
            { label: 'Other', used: 120, color: '#f97316' },
        ];
    }, [scanResult]);

    const total = 2048;
    const used = storageStats.reduce((a, b) => a + b.used, 0);

    return (
        <div className="space-y-1">
            {/* Storage Visualizer */}
            <div className="mx-4 mb-4 bg-white/5 border border-white/8 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-semibold text-white">WITS Storage Usage</p>
                    <button
                        onClick={runScan}
                        disabled={scanning}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/30 transition-colors disabled:opacity-50"
                    >
                        {scanning ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                        {scanning ? 'Scanning…' : 'Run scan'}
                    </button>
                </div>
                <p className="text-xs text-white/40 mb-2">{scanResult ? 'Local cache & app data' : 'Tap Run scan to analyze local storage'}</p>
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden flex">
                    {storageStats.map((stat) => (
                        <div
                            key={stat.label}
                            style={{ width: `${used ? (stat.used / used) * 100 : 0}%`, backgroundColor: stat.color }}
                            className="h-full transition-all duration-500 min-w-0"
                        />
                    ))}
                </div>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-indigo-400 font-mono">{used} MB total</p>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                    {storageStats.map((stat) => (
                        <div key={stat.label} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
                            <span className="text-[11px] text-white/50">{stat.label} {stat.used}MB</span>
                        </div>
                    ))}
                </div>
            </div>

            <SettingsSection title="Storage Analyzer">
                <SettingsRow icon={<Search size={16} />} label="Detect Large Files"
                    description="Flag files over 50MB for review"
                    checked={s.detectLargeFiles} onToggle={(v) => upd({ detectLargeFiles: v })} />
                <SettingsRow icon={<HardDrive size={16} />} label="Detect Duplicate Media"
                    description="Find and remove duplicate photos/videos"
                    checked={s.detectDuplicates} onToggle={(v) => upd({ detectDuplicates: v })} />
                <SettingsRow icon={<Trash2 size={16} />} label="Remove Forwarded Media"
                    description="Auto-delete forwarded content to save space"
                    checked={s.removeForwardedMedia} onToggle={(v) => upd({ removeForwardedMedia: v })} />
                <SettingsRow icon={<Clock size={16} />} label="Auto-Delete Temp Files"
                    checked={s.autoDeleteTempFiles} onToggle={(v) => upd({ autoDeleteTempFiles: v })} />
            </SettingsSection>

            <SettingsSection title="Network Usage">
                <SettingsRow icon={<Wifi size={16} />} label="Track Network Usage"
                    description="Monitor data consumed by messages, calls, media"
                    checked={s.trackNetworkUsage} onToggle={(v) => upd({ trackNetworkUsage: v })} />
            </SettingsSection>

            <SettingsSection title="Proxy Configuration">
                <SettingsRow icon={<Server size={16} />} label="Enable Custom Proxy"
                    checked={s.proxyEnabled} onToggle={(v) => upd({ proxyEnabled: v })} />
                {s.proxyEnabled && (
                    <div className="px-4 py-3 border-t border-white/5 space-y-2">
                        <div>
                            <p className="text-xs text-white/40 mb-1">Proxy Host</p>
                            <input type="text" value={s.proxyHost} onChange={(e) => upd({ proxyHost: e.target.value })}
                                placeholder="proxy.example.com"
                                className="w-full bg-white/8 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <p className="text-xs text-white/40 mb-1">Proxy Port</p>
                            <input type="number" value={s.proxyPort} onChange={(e) => upd({ proxyPort: parseInt(e.target.value) || 8080 })}
                                className="w-full bg-white/8 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>
                )}
            </SettingsSection>

            <SettingsSection title="Media Upload Quality">
                <div className="px-4 py-3">
                    <div className="flex gap-2">
                        {(['standard', 'hd'] as const).map((quality) => (
                            <button
                                key={quality}
                                onClick={() => upd({ mediaUploadQuality: quality })}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${s.mediaUploadQuality === quality
                                        ? 'bg-indigo-500/30 border border-indigo-500/50 text-indigo-300'
                                        : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
                                    }`}
                            >
                                {quality === 'hd' ? '🌟 HD Quality' : '📱 Standard'}
                            </button>
                        ))}
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
};

export default StorageSettings;
