import React from 'react';
import { SettingsSection, SettingsRow, SliderRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import {
    Eye, EyeOff, Clock, MessageSquare, Mic, Trash2, Download,
    Phone, Video, PhoneOff, Shield, Lock
} from 'lucide-react';

const PrivacySettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const p = settings.privacy;
    const upd = (patch: Partial<typeof p>) => updateSection('privacy', patch);

    return (
        <div className="space-y-1">
            <SettingsSection title="Online Privacy">
                <SettingsRow icon={<Eye size={16} />} label="Freeze Last Seen"
                    description="Lock your last seen time to prevent updates"
                    checked={p.freezeLastSeen} onToggle={(v) => upd({ freezeLastSeen: v })} />
                <SettingsRow icon={<EyeOff size={16} />} label="Hide Online Status"
                    description="Nobody can see when you're online"
                    checked={p.hideOnlineStatus} onToggle={(v) => upd({ hideOnlineStatus: v })} />
                <SettingsRow icon={<Clock size={16} />} label="Fake Last Seen"
                    description="Show a fake last seen time"
                    checked={p.fakeLastSeen} onToggle={(v) => upd({ fakeLastSeen: v })} badge="PRO" />

                {p.fakeLastSeen && (
                    <SliderRow
                        icon={<Clock size={16} />}
                        label="Last Seen Timer"
                        description="How many minutes ago to show as last seen"
                        value={p.customLastSeenTimer}
                        min={5}
                        max={1440}
                        step={5}
                        onChange={(v) => upd({ customLastSeenTimer: v })}
                        format={(v) => `${v}m ago`}
                    />
                )}
            </SettingsSection>

            <SettingsSection title="Message Privacy">
                <SettingsRow icon={<MessageSquare size={16} />} label="Hide Blue Ticks"
                    description="Recipients won't see read receipts"
                    checked={p.hideBlueTicks} onToggle={(v) => upd({ hideBlueTicks: v })} />
                <SettingsRow icon={<MessageSquare size={16} />} label="Hide Double Ticks"
                    description="Show only single tick (delivered) always"
                    checked={p.hideDoubleTicks} onToggle={(v) => upd({ hideDoubleTicks: v })} />
                <SettingsRow icon={<MessageSquare size={16} />} label="Hide Typing Indicator"
                    description="Others won't see 'typing...' from you"
                    checked={p.hideTypingIndicator} onToggle={(v) => upd({ hideTypingIndicator: v })} />
                <SettingsRow icon={<Mic size={16} />} label="Hide Recording Indicator"
                    description="Others won't see when you're recording audio"
                    checked={p.hideRecordingIndicator} onToggle={(v) => upd({ hideRecordingIndicator: v })} />
            </SettingsSection>

            <SettingsSection title="Anti-Delete System">
                <SettingsRow icon={<Trash2 size={16} />} label="Store Deleted Messages"
                    description="Keep a local copy of messages deleted by others"
                    checked={p.storeDeletedMessages} onToggle={(v) => upd({ storeDeletedMessages: v })} badge="NEW" />
                <SettingsRow icon={<Trash2 size={16} />} label="Store Deleted Statuses"
                    description="Archive statuses before they're deleted"
                    checked={p.storeDeletedStatuses} onToggle={(v) => upd({ storeDeletedStatuses: v })} badge="NEW" />
            </SettingsSection>

            <SettingsSection title="View Once Bypass">
                <SettingsRow icon={<Download size={16} />} label="Allow Saving View-Once Media"
                    description="Save disappearing photos and videos"
                    checked={p.allowViewOnceSave} onToggle={(v) => upd({ allowViewOnceSave: v })} badge="PRO" danger />
            </SettingsSection>

            <SettingsSection title="Call Blocking">
                <SettingsRow icon={<PhoneOff size={16} />} label="Disable All Calls"
                    checked={p.disableAllCalls} onToggle={(v) => upd({ disableAllCalls: v })} danger />
                <SettingsRow icon={<Phone size={16} />} label="Disable Voice Calls Only"
                    checked={p.disableVoiceCalls} onToggle={(v) => upd({ disableVoiceCalls: v })} disabled={p.disableAllCalls} />
                <SettingsRow icon={<Video size={16} />} label="Disable Video Calls Only"
                    checked={p.disableVideoCalls} onToggle={(v) => upd({ disableVideoCalls: v })} disabled={p.disableAllCalls} />
            </SettingsSection>
        </div>
    );
};

export default PrivacySettings;
