import React from 'react';
import { SettingsSection, SettingsRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import {
    Sticker, Reply, Zap, ExternalLink, Smile, Crown, Keyboard,
    Copy, AtSign, Edit, Clock, Send, Bot, Phone, Users,
    MessageSquare, Languages, Pin, Archive, BookOpen, MessageCircle
} from 'lucide-react';

const MessagingSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const m = settings.messaging;
    const upd = (patch: Partial<typeof m>) => updateSection('messaging', patch);

    return (
        <div className="space-y-1">
            <SettingsSection title="Chat Interface">
                <SettingsRow icon={<Sticker size={16} />} label="Confirm Before Sending Sticker"
                    description="Show confirmation dialog before sticker is sent"
                    checked={m.confirmBeforeSendingSticker} onToggle={(v) => upd({ confirmBeforeSendingSticker: v })} />
                <SettingsRow icon={<Reply size={16} />} label="Modern Reply UI"
                    description="Use new card-style reply interface"
                    checked={m.modernReplyUI} onToggle={(v) => upd({ modernReplyUI: v })} badge="NEW" />
                <SettingsRow icon={<Zap size={16} />} label="Disable Quick Actions"
                    description="Remove long-press action shortcuts"
                    checked={m.disableQuickActions} onToggle={(v) => upd({ disableQuickActions: v })} />
                <SettingsRow icon={<ExternalLink size={16} />} label="Popup Chat Window"
                    description="Open chats in a floating popup"
                    checked={m.popupChatWindow} onToggle={(v) => upd({ popupChatWindow: v })} />
                <SettingsRow icon={<Smile size={16} />} label="Emoji Pack Switcher"
                    description="Switch between emoji styles (Android, iOS, Twitter)"
                    checked={m.emojiPackSwitcher} onToggle={(v) => upd({ emojiPackSwitcher: v })} />
                <SettingsRow icon={<Smile size={16} />} label="Disable Animated Emojis"
                    checked={m.disableAnimatedEmojis} onToggle={(v) => upd({ disableAnimatedEmojis: v })} />
                <SettingsRow icon={<Crown size={16} />} label="Admin Crown Indicator"
                    description="Show crown badge next to admin names in groups"
                    checked={m.adminCrownIndicator} onToggle={(v) => upd({ adminCrownIndicator: v })} />
                <SettingsRow icon={<Keyboard size={16} />} label="Incognito Keyboard Mode"
                    description="Prevent keyboard from learning your messages"
                    checked={m.incognitoKeyboard} onToggle={(v) => upd({ incognitoKeyboard: v })} />
                <SettingsRow icon={<Copy size={16} />} label="Copy Without Metadata"
                    description="Copy messages without timestamp/sender info"
                    checked={m.copyWithoutMetadata} onToggle={(v) => upd({ copyWithoutMetadata: v })} />
                <SettingsRow icon={<AtSign size={16} />} label="Mention All Participants"
                    description="@everyone shortcut in groups"
                    checked={m.mentionAll} onToggle={(v) => upd({ mentionAll: v })} />
            </SettingsSection>

            <SettingsSection title="Message Edit Tracking">
                <SettingsRow icon={<Edit size={16} />} label="Show Edited Indicator"
                    description="Display 'edited' label on modified messages"
                    checked={m.showEditedIndicator} onToggle={(v) => upd({ showEditedIndicator: v })} />
                <SettingsRow icon={<Clock size={16} />} label="Show Edit Timestamp"
                    description="Show when the message was last edited"
                    checked={m.showEditTimestamp} onToggle={(v) => upd({ showEditTimestamp: v })} disabled={!m.showEditedIndicator} />
            </SettingsSection>

            <SettingsSection title="Power Features">
                <SettingsRow icon={<Clock size={16} />} label="Schedule Messages"
                    description="Queue messages to be sent at a specific time"
                    checked={m.scheduleMessages} onToggle={(v) => upd({ scheduleMessages: v })} badge="PRO" />
                <SettingsRow icon={<Bot size={16} />} label="Auto Reply System"
                    description="Automatically respond when unavailable"
                    checked={m.autoReply} onToggle={(v) => upd({ autoReply: v })} />

                {m.autoReply && (
                    <div className="px-4 py-3 border-t border-white/5">
                        <p className="text-xs text-white/40 mb-2">Auto Reply Message</p>
                        <textarea
                            value={m.autoReplyMessage}
                            onChange={(e) => upd({ autoReplyMessage: e.target.value })}
                            rows={3}
                            className="w-full bg-white/8 border border-white/10 text-white rounded-xl px-3 py-2 text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>
                )}

                <SettingsRow icon={<Phone size={16} />} label="Send to Unsaved Number"
                    description="Message without saving contact"
                    checked={m.sendToUnsavedNumber} onToggle={(v) => upd({ sendToUnsavedNumber: v })} />
                <SettingsRow icon={<Users size={16} />} label="Broadcast Unlimited Contacts"
                    checked={m.broadcastUnlimited} onToggle={(v) => upd({ broadcastUnlimited: v })} badge="PRO" />
                <SettingsRow icon={<MessageCircle size={16} />} label="Send Blank Messages"
                    checked={m.sendBlankMessages} onToggle={(v) => upd({ sendBlankMessages: v })} />
                <SettingsRow icon={<Languages size={16} />} label="Chat Translator"
                    description="Auto-translate messages inline"
                    checked={m.chatTranslator} onToggle={(v) => upd({ chatTranslator: v })} badge="AI" />
                <SettingsRow icon={<Pin size={16} />} label="Unlimited Pinned Chats"
                    checked={m.unlimitedPinnedChats} onToggle={(v) => upd({ unlimitedPinnedChats: v })} badge="PRO" />
                <SettingsRow icon={<Archive size={16} />} label="Auto-Save Drafts"
                    checked={m.saveDrafts} onToggle={(v) => upd({ saveDrafts: v })} />
            </SettingsSection>

            <SettingsSection title="Quick Reply Templates">
                <div className="px-4 py-3">
                    {m.quickReplyTemplates.map((tmpl, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                            <input
                                value={tmpl}
                                onChange={(e) => {
                                    const arr = [...m.quickReplyTemplates];
                                    arr[i] = e.target.value;
                                    upd({ quickReplyTemplates: arr });
                                }}
                                className="flex-1 bg-white/8 border border-white/10 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                onClick={() => {
                                    const arr = m.quickReplyTemplates.filter((_, j) => j !== i);
                                    upd({ quickReplyTemplates: arr });
                                }}
                                className="w-8 h-9 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 flex items-center justify-center text-xs font-bold"
                            >✕</button>
                        </div>
                    ))}
                    <button
                        onClick={() => upd({ quickReplyTemplates: [...m.quickReplyTemplates, ''] })}
                        className="w-full mt-1 py-2 rounded-xl border border-dashed border-indigo-500/30 text-indigo-400 text-sm hover:bg-indigo-500/10 transition-colors"
                    >
                        + Add Template
                    </button>
                </div>
            </SettingsSection>
        </div>
    );
};

export default MessagingSettings;
