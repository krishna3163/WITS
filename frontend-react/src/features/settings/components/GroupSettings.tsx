import React from 'react';
import { SettingsSection, SettingsRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import { AtSign, Crown, Bot, Book, Shield, Users, Palette, Wifi } from 'lucide-react';

const GroupSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const g = settings.groups;
    const upd = (patch: Partial<typeof g>) => updateSection('groups', patch);

    return (
        <div className="space-y-1">
            <SettingsSection title="Admin Tools">
                <SettingsRow icon={<AtSign size={16} />} label="Mention All Participants"
                    description="@everyone notifies all group members"
                    checked={g.mentionAllParticipants} onToggle={(v) => upd({ mentionAllParticipants: v })} />
                <SettingsRow icon={<Crown size={16} />} label="Admin Crown Indicator"
                    description="Crown badge appears next to admin names"
                    checked={g.adminCrownEnabled} onToggle={(v) => upd({ adminCrownEnabled: v })} />
                <SettingsRow icon={<Shield size={16} />} label="Auto Spam Removal"
                    description="Automatically remove spam messages from groups"
                    checked={g.autoSpamRemoval} onToggle={(v) => upd({ autoSpamRemoval: v })} badge="AI" />
                <SettingsRow icon={<Wifi size={16} />} label="Show Online Members"
                    description="Display online count in group header"
                    checked={g.showOnlineMembers} onToggle={(v) => upd({ showOnlineMembers: v })} />
                <SettingsRow icon={<Palette size={16} />} label="Custom Group Themes"
                    description="Apply unique themes to individual groups"
                    checked={g.customGroupThemes} onToggle={(v) => upd({ customGroupThemes: v })} badge="PRO" />
            </SettingsSection>

            <SettingsSection title="Auto Messages">
                <SettingsRow icon={<Bot size={16} />} label="Auto Welcome Message"
                    description="Send a greeting when new members join"
                    checked={g.autoWelcomeMessage} onToggle={(v) => upd({ autoWelcomeMessage: v })} />
                {g.autoWelcomeMessage && (
                    <div className="px-4 py-3 border-t border-white/5">
                        <textarea rows={3} value={g.welcomeMessageText}
                            onChange={(e) => upd({ welcomeMessageText: e.target.value })}
                            className="w-full bg-white/8 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>
                )}
                <SettingsRow icon={<Book size={16} />} label="Auto Rules Message"
                    description="Post group rules when new member joins"
                    checked={g.autoRulesMessage} onToggle={(v) => upd({ autoRulesMessage: v })} />
                {g.autoRulesMessage && (
                    <div className="px-4 py-3 border-t border-white/5">
                        <textarea rows={4} value={g.rulesMessageText}
                            onChange={(e) => upd({ rulesMessageText: e.target.value })}
                            className="w-full bg-white/8 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>
                )}
            </SettingsSection>
        </div>
    );
};

export default GroupSettings;
