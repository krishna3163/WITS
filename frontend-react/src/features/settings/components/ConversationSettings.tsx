import React from 'react';
import { SettingsSection, SettingsRow, SliderRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import { MessageSquare, Clock, Columns, Pin, Users, Smile, Type, Sticker, Palette, Hand } from 'lucide-react';

const ConversationSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const c = settings.conversation;
    const upd = (patch: Partial<typeof c>) => updateSection('conversation', patch);

    const bubbleStyles = [
        { id: 'rounded', label: 'Rounded', preview: 'rounded-2xl' },
        { id: 'sharp', label: 'Sharp', preview: 'rounded-none' },
        { id: 'pill', label: 'Pill', preview: 'rounded-full' },
        { id: 'ios', label: 'iOS', preview: 'rounded-[18px]' },
    ];

    return (
        <div className="space-y-1">
            <SettingsSection title="Bubble Style">
                <div className="px-4 py-3">
                    <div className="grid grid-cols-4 gap-2">
                        {bubbleStyles.map((style) => (
                            <button
                                key={style.id}
                                onClick={() => upd({ bubbleStyle: style.id as any })}
                                className={`flex flex-col items-center gap-2 p-2 border transition-all duration-200 ${c.bubbleStyle === style.id
                                        ? 'border-indigo-500/60 bg-indigo-500/15'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                                    } ${style.preview}`}
                            >
                                <div
                                    className={`w-8 h-5 ${style.preview}`}
                                    style={{ backgroundColor: c.bubbleColorSent }}
                                />
                                <span className="text-[10px] font-semibold text-white/60">{style.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Size Customization">
                <SliderRow
                    icon={<Type size={16} />}
                    label="Font Size"
                    value={c.fontSize} min={10} max={22} step={1}
                    onChange={(v) => upd({ fontSize: v })}
                    format={(v) => `${v}px`}
                />
                <SliderRow
                    icon={<Smile size={16} />}
                    label="Emoji Size"
                    value={c.emojiSize} min={16} max={48} step={2}
                    onChange={(v) => upd({ emojiSize: v })}
                    format={(v) => `${v}px`}
                />
                <SliderRow
                    icon={<Sticker size={16} />}
                    label="Sticker Size"
                    value={c.stickerSize} min={60} max={200} step={10}
                    onChange={(v) => upd({ stickerSize: v })}
                    format={(v) => `${v}px`}
                />
            </SettingsSection>

            <SettingsSection title="Bubble Colors">
                <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl" style={{ backgroundColor: c.bubbleColorSent }} />
                        <p className="text-sm font-medium text-white">Sent Bubble</p>
                    </div>
                    <input type="color" value={c.bubbleColorSent} onChange={(e) => upd({ bubbleColorSent: e.target.value })}
                        className="w-10 h-8 rounded-lg cursor-pointer bg-transparent border-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-0" />
                </div>
                <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl" style={{ backgroundColor: c.bubbleColorReceived }} />
                        <p className="text-sm font-medium text-white">Received Bubble</p>
                    </div>
                    <input type="color" value={c.bubbleColorReceived} onChange={(e) => upd({ bubbleColorReceived: e.target.value })}
                        className="w-10 h-8 rounded-lg cursor-pointer bg-transparent border-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-0" />
                </div>
            </SettingsSection>

            <SettingsSection title="Reaction System">
                <SettingsRow icon={<Hand size={16} />} label="Double Tap to React"
                    description="Double-tap a message to react with emoji"
                    checked={c.doubleTapReaction} onToggle={(v) => upd({ doubleTapReaction: v })} />
                <SettingsRow icon={<Palette size={16} />} label="Reaction Animations"
                    checked={c.reactionAnimations} onToggle={(v) => upd({ reactionAnimations: v })} />
                <div className="px-4 py-3.5 border-t border-white/5">
                    <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Default Reaction Emoji</p>
                    <div className="flex gap-2 flex-wrap">
                        {['❤️', '😂', '😮', '😢', '🙏', '👍', '🔥', '⭐'].map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => upd({ customReactionEmoji: emoji })}
                                className={`text-xl p-1.5 rounded-xl transition-all duration-200 ${c.customReactionEmoji === emoji
                                        ? 'bg-indigo-500/30 ring-2 ring-indigo-500/50 scale-110'
                                        : 'bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
};

export default ConversationSettings;
