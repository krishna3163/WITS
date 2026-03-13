import React from 'react';
import { SettingsSection, SettingsRow, SliderRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import {
    MessageSquare, Circle, Clock, LayoutGrid, MousePointer, Pin
} from 'lucide-react';

const ChatSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const c = settings.chat;
    const upd = (patch: Partial<typeof c>) => updateSection('chat', patch);

    return (
        <div className="space-y-1">
            <SettingsSection title="Layout">
                <SettingsRow
                    icon={<LayoutGrid size={16} />}
                    label="Separate Groups from Chats"
                    description="Show groups in a dedicated section"
                    checked={c.separateGroups}
                    onToggle={(v) => upd({ separateGroups: v })}
                />
            </SettingsSection>

            <SettingsSection title="Indicators">
                <SettingsRow
                    icon={<Circle size={16} />}
                    label="Online Contact Indicator"
                    description="Green dot when contact is online"
                    checked={c.showOnlineIndicator}
                    onToggle={(v) => upd({ showOnlineIndicator: v })}
                />
                <SettingsRow
                    icon={<Clock size={16} />}
                    label="Last Message Timestamp"
                    description="Show time of last message in list"
                    checked={c.showLastMessageTimestamp}
                    onToggle={(v) => upd({ showLastMessageTimestamp: v })}
                />
                <SettingsRow
                    icon={<MessageSquare size={16} />}
                    label="Chat Divider"
                    description="Visual divider between chat rows"
                    checked={c.showChatDivider}
                    onToggle={(v) => upd({ showChatDivider: v })}
                />
                <SettingsRow
                    icon={<MousePointer size={16} />}
                    label="Chat Preview on Hold"
                    description="Preview message on long-press"
                    checked={c.chatPreviewOnHold}
                    onToggle={(v) => upd({ chatPreviewOnHold: v })}
                />
            </SettingsSection>

            <SettingsSection title="Pinned Chats">
                <SliderRow
                    icon={<Pin size={16} />}
                    label="Max Pinned Chats"
                    description="Pin up to 60 chats at the top"
                    value={c.maxPinnedChats}
                    min={5}
                    max={60}
                    step={1}
                    onChange={(v) => upd({ maxPinnedChats: v })}
                    format={(v) => `${v}`}
                />
            </SettingsSection>
        </div>
    );
};

export default ChatSettings;
