import React from 'react';
import { SettingsSection, SettingsRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import { Video, Image, Download, Eye, EyeOff, SkipForward, Heart } from 'lucide-react';

const StatusFeatureSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const s = settings.statusFeatures;
    const upd = (patch: Partial<typeof s>) => updateSection('statusFeatures', patch);

    return (
        <div className="space-y-1">
            <SettingsSection title="Upload Capabilities">
                <SettingsRow icon={<Video size={16} />} label="Upload Longer Videos"
                    description="Post videos beyond the standard 30s limit"
                    checked={s.uploadLongerVideos} onToggle={(v) => upd({ uploadLongerVideos: v })} badge="PRO" />
                <SettingsRow icon={<Image size={16} />} label="Upload HD Statuses"
                    description="Post full-resolution images and videos"
                    checked={s.uploadHDStatuses} onToggle={(v) => upd({ uploadHDStatuses: v })} badge="HD" />
            </SettingsSection>

            <SettingsSection title="Download & Privacy">
                <SettingsRow icon={<Download size={16} />} label="Download Status Media"
                    description="Save others' statuses to your device"
                    checked={s.downloadStatusMedia} onToggle={(v) => upd({ downloadStatusMedia: v })} />
                <SettingsRow icon={<Eye size={16} />} label="View Deleted Statuses"
                    description="See statuses that were removed before you opened them"
                    checked={s.viewDeletedStatuses} onToggle={(v) => upd({ viewDeletedStatuses: v })} badge="NEW" />
                <SettingsRow icon={<EyeOff size={16} />} label="Hide Your Status Views"
                    description="View others' statuses without them knowing"
                    checked={s.hideStatusViews} onToggle={(v) => upd({ hideStatusViews: v })} badge="PRO" />
            </SettingsSection>

            <SettingsSection title="Playback">
                <SettingsRow icon={<SkipForward size={16} />} label="Disable Story Jumping"
                    description="Prevent auto-advancing to next contact's status"
                    checked={s.disableStoryJumping} onToggle={(v) => upd({ disableStoryJumping: v })} />
                <SettingsRow icon={<Heart size={16} />} label="Status Reaction System"
                    description="Allow emoji reactions on statuses"
                    checked={s.statusReactionSystem} onToggle={(v) => upd({ statusReactionSystem: v })} />
            </SettingsSection>
        </div>
    );
};

export default StatusFeatureSettings;
