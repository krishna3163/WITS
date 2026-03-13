import React from 'react';
import { SettingsSection, SettingsRow, SliderRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import {
    Bell, BellOff, Clock, Wifi, Layers, Smartphone, Globe, Phone,
    Map, Signal, Radio, Eye, Mic, CheckCheck, Volume2, Star
} from 'lucide-react';

const NotificationSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const n = settings.notifications;
    const upd = (patch: Partial<typeof n>) => updateSection('notifications', patch);

    return (
        <div className="space-y-1">
            <SettingsSection title="Master Controls">
                <SettingsRow icon={<BellOff size={16} />} label="Disable All Notifications"
                    description="Completely silence all alerts from WITS"
                    checked={n.disableAll} onToggle={(v) => upd({ disableAll: v })} danger />
                <SettingsRow icon={<Clock size={16} />} label="Auto-Hide After 5 Seconds"
                    description="Notifications disappear automatically after 5s"
                    checked={n.autoHideAfter5s} onToggle={(v) => upd({ autoHideAfter5s: v })} />
                <SettingsRow icon={<Layers size={16} />} label="Floating Bubble Notifications"
                    description="Chat heads appear as floating bubbles (Android-style)"
                    checked={n.floatingBubbles} onToggle={(v) => upd({ floatingBubbles: v })} badge="PRO" />
                <SettingsRow icon={<Bell size={16} />} label="Toast Notifications"
                    description="Slide-in banners for live activity"
                    checked={n.toastNotifications} onToggle={(v) => upd({ toastNotifications: v })} />
            </SettingsSection>

            <SettingsSection title="Suppression Rules">
                <SettingsRow icon={<BellOff size={16} />} label="Suppress in Do Not Disturb"
                    description="Block all alerts when DND mode is active"
                    checked={n.suppressOnDND} onToggle={(v) => upd({ suppressOnDND: v })} />
                <SettingsRow icon={<Smartphone size={16} />} label="Suppress in Landscape Mode"
                    description="Hide notifications when screen is rotated"
                    checked={n.suppressOnLandscape} onToggle={(v) => upd({ suppressOnLandscape: v })} />
                <SettingsRow icon={<Globe size={16} />} label="Suppress in Gaming Mode"
                    description="Block interruptions during gameplay"
                    checked={n.suppressOnGaming} onToggle={(v) => upd({ suppressOnGaming: v })} badge="GAME" />
            </SettingsSection>

            <SettingsSection title="Event Alerts">
                <SettingsRow icon={<Wifi size={16} />} label="Contact Comes Online"
                    checked={n.notifyContactOnline} onToggle={(v) => upd({ notifyContactOnline: v })} />
                <SettingsRow icon={<Radio size={16} />} label="Contact is Typing"
                    checked={n.notifyTyping} onToggle={(v) => upd({ notifyTyping: v })} />
                <SettingsRow icon={<Mic size={16} />} label="Contact is Recording Voice"
                    checked={n.notifyVoiceRecording} onToggle={(v) => upd({ notifyVoiceRecording: v })} />
                <SettingsRow icon={<CheckCheck size={16} />} label="Message Read by Recipient"
                    checked={n.notifyMessageRead} onToggle={(v) => upd({ notifyMessageRead: v })} />
                <SettingsRow icon={<Volume2 size={16} />} label="Audio Message Played"
                    checked={n.notifyAudioPlayed} onToggle={(v) => upd({ notifyAudioPlayed: v })} />
                <SettingsRow icon={<Eye size={16} />} label="Status Viewed by Contact"
                    checked={n.notifyStatusViewed} onToggle={(v) => upd({ notifyStatusViewed: v })} />
                <SettingsRow icon={<Star size={16} />} label="Profile Photo Changed"
                    checked={n.notifyProfileChanged} onToggle={(v) => upd({ notifyProfileChanged: v })} />
            </SettingsSection>

            <SettingsSection title="Caller Information">
                <SettingsRow icon={<Phone size={16} />} label="Show Caller Info After Call"
                    description="Display caller details post-call"
                    checked={n.showCallerInfo} onToggle={(v) => upd({ showCallerInfo: v })} />
                <SettingsRow icon={<Globe size={16} />} label="Show Caller Country"
                    checked={n.showCallerCountry} onToggle={(v) => upd({ showCallerCountry: v })} disabled={!n.showCallerInfo} />
                <SettingsRow icon={<Map size={16} />} label="Show Caller City"
                    checked={n.showCallerCity} onToggle={(v) => upd({ showCallerCity: v })} disabled={!n.showCallerInfo} />
                <SettingsRow icon={<Signal size={16} />} label="Show Network Provider"
                    checked={n.showCallerNetwork} onToggle={(v) => upd({ showCallerNetwork: v })} disabled={!n.showCallerInfo} />
            </SettingsSection>
        </div>
    );
};

export default NotificationSettings;
