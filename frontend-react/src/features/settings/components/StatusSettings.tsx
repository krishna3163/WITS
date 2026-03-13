import React from 'react';
import { SettingsSection, SettingsRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import { Image, Heart, SkipForward, Volume2, Radio } from 'lucide-react';

/**
 * Status and Updates configuration (blur, reactions, story jumping, sound, channels).
 * Distinct from StatusFeatureSettings (upload HD, download, etc.).
 */
const StatusSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const s = settings.status;
    const upd = (patch: Partial<typeof s>) => updateSection('status', patch);

    return (
        <div className="space-y-1">
            <SettingsSection title="Visual">
                <SettingsRow
                    icon={<Image size={16} />}
                    label="Blur Effect on Images"
                    description="Apply blur to status images"
                    checked={s.blurImages}
                    onToggle={(v) => upd({ blurImages: v })}
                />
            </SettingsSection>

            <SettingsSection title="Interactions">
                <SettingsRow
                    icon={<Heart size={16} />}
                    label="Disable Reactions"
                    description="Turn off reactions on status"
                    checked={s.disableReactions}
                    onToggle={(v) => upd({ disableReactions: v })}
                />
                <SettingsRow
                    icon={<SkipForward size={16} />}
                    label="Disable Story Jumping"
                    description="Do not auto-advance to next story"
                    checked={s.disableStoryJumping}
                    onToggle={(v) => upd({ disableStoryJumping: v })}
                />
            </SettingsSection>

            <SettingsSection title="Playback">
                <SettingsRow
                    icon={<Volume2 size={16} />}
                    label="Auto Play Sound"
                    description="Play sound in status by default"
                    checked={s.autoPlaySound}
                    onToggle={(v) => upd({ autoPlaySound: v })}
                />
            </SettingsSection>

            <SettingsSection title="Channels">
                <SettingsRow
                    icon={<Radio size={16} />}
                    label="Disable Channels"
                    description="Hide channels tab in updates"
                    checked={s.disableChannels}
                    onToggle={(v) => upd({ disableChannels: v })}
                />
            </SettingsSection>
        </div>
    );
};

export default StatusSettings;
