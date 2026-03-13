import React, { useState } from 'react';
import { SettingsSection, SettingsRow, SliderRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import {
    Shield, Fingerprint, Lock, UserX, AlertTriangle, Activity, Cpu, Bug
} from 'lucide-react';

const SecuritySettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const s = settings.security;
    const upd = (patch: Partial<typeof s>) => updateSection('security', patch);
    const [showPasscode, setShowPasscode] = useState(false);

    return (
        <div className="space-y-1">
            <SettingsSection title="Threat Protection">
                <SettingsRow icon={<AlertTriangle size={16} />} label="Spam Detection"
                    description="Auto-detect and block spam messages"
                    checked={s.spamDetection} onToggle={(v) => upd({ spamDetection: v })} />
                <SettingsRow icon={<Activity size={16} />} label="Rate Limiting"
                    description="Prevent bulk message abuse"
                    checked={s.rateLimiting} onToggle={(v) => upd({ rateLimiting: v })} />
                <SettingsRow icon={<Cpu size={16} />} label="Device Spoof Protection"
                    description="Block access from emulators and spoofed devices"
                    checked={s.deviceSpoofProtection} onToggle={(v) => upd({ deviceSpoofProtection: v })} badge="PRO" />
                <SettingsRow icon={<UserX size={16} />} label="Block Unknown Contact Messages"
                    description="Only receive messages from saved contacts"
                    checked={s.disableUnknownMessages} onToggle={(v) => upd({ disableUnknownMessages: v })} />
            </SettingsSection>

            <SettingsSection title="App Lock">
                <SettingsRow icon={<Fingerprint size={16} />} label="Fingerprint Lock"
                    description="Require biometric to open WITS"
                    checked={s.appLockFingerprint} onToggle={(v) => upd({ appLockFingerprint: v })} />
                <SettingsRow icon={<Lock size={16} />} label="Passcode Lock"
                    description="4-digit PIN to unlock the app"
                    checked={s.passcodeEnabled} onToggle={(v) => upd({ passcodeEnabled: v })} />

                {s.passcodeEnabled && (
                    <div className="px-4 py-3.5 border-t border-white/5">
                        <p className="text-xs text-white/40 mb-2">Set Passcode (4 digits)</p>
                        <div className="flex gap-2 items-center">
                            <input
                                type={showPasscode ? 'text' : 'password'}
                                value={s.passcode}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    upd({ passcode: val });
                                }}
                                maxLength={4}
                                placeholder="••••"
                                className="flex-1 bg-white/8 border border-white/10 text-white rounded-xl px-3 py-2 text-sm text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                onClick={() => setShowPasscode(!showPasscode)}
                                className="w-10 h-10 rounded-xl bg-white/8 text-white/40 hover:text-white flex items-center justify-center"
                            >
                                <Shield size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </SettingsSection>
        </div>
    );
};

export default SecuritySettings;
