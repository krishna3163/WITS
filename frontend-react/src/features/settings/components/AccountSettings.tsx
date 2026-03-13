import React, { useState } from 'react';
import { SettingsSection, SettingsRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import { useAuthStore } from '../../../store/authStore';
import { Fingerprint, Key, Users, FileDown, Shield, Loader2, Check, AlertCircle } from 'lucide-react';

const AccountSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const { user } = useAuthStore();
    const a = settings.account;
    const upd = (patch: Partial<typeof a>) => updateSection('account', patch);
    const [exportStatus, setExportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleExportData = async () => {
        setExportStatus('loading');
        try {
            const payload = {
                exported_at: new Date().toISOString(),
                user: user ? { id: user.id, email: user.email, profile: user.profile } : null,
                settings: settings,
            };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `wits-export-${user?.id ?? 'anonymous'}-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            setExportStatus('success');
            setTimeout(() => setExportStatus('idle'), 3000);
        } catch (e) {
            console.error('Export failed:', e);
            setExportStatus('error');
            setTimeout(() => setExportStatus('idle'), 3000);
        }
    };

    return (
        <div className="space-y-1">
            <SettingsSection title="Authentication">
                <SettingsRow icon={<Fingerprint size={16} />} label="Biometric Login"
                    description="Use fingerprint or Face ID to sign in"
                    checked={a.biometricLogin} onToggle={(v) => upd({ biometricLogin: v })} />
                <SettingsRow icon={<Key size={16} />} label="Passkeys"
                    description="Hardware-backed passwordless authentication"
                    checked={a.passkeys} onToggle={(v) => upd({ passkeys: v })} badge="NEW" />
                <SettingsRow icon={<Shield size={16} />} label="Two-Factor Authentication"
                    checked={a.twoFactorEnabled} onToggle={(v) => upd({ twoFactorEnabled: v })} />
            </SettingsSection>

            <SettingsSection title="Multi Account">
                <SettingsRow icon={<Users size={16} />} label="Enable Multi Account"
                    description="Manage multiple WITS accounts simultaneously"
                    checked={a.multiAccount} onToggle={(v) => upd({ multiAccount: v })} badge="PRO" />
            </SettingsSection>

            <SettingsSection title="Data">
                <div
                    className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={exportStatus === 'loading' ? undefined : handleExportData}
                >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-500/15 text-indigo-400">
                            <FileDown size={16} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Export My Data</p>
                            <p className="text-xs text-white/40 mt-0.5">Download account info and settings as JSON</p>
                        </div>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                        {exportStatus === 'loading' && <Loader2 size={18} className="text-indigo-400 animate-spin" />}
                        {exportStatus === 'success' && <Check size={18} className="text-green-400" />}
                        {exportStatus === 'error' && <AlertCircle size={18} className="text-red-400" />}
                        {exportStatus === 'idle' && (
                            <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
};

export default AccountSettings;
