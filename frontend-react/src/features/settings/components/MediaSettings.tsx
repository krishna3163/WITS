import React from 'react';
import { SettingsSection, SettingsRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import { Upload, Download, Video, Image, Eye, EyeOff } from 'lucide-react';

const MediaSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const m = settings.media;
    const upd = (patch: Partial<typeof m>) => updateSection('media', patch);

    return (
        <div className="space-y-1">
            <SettingsSection title="Upload Limits">
                <div className="px-4 py-3.5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                            <Upload size={16} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <p className="text-sm font-medium text-white">Max Upload Size</p>
                                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg">
                                    {m.maxUploadSizeMB} MB
                                </span>
                            </div>
                            <p className="text-xs text-white/40 mt-0.5">Standard WhatsApp allows 16MB</p>
                        </div>
                    </div>
                    <input type="range" min={16} max={700} step={1} value={m.maxUploadSizeMB}
                        onChange={(e) => upd({ maxUploadSizeMB: parseInt(e.target.value) })}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-indigo-500 bg-white/10"
                    />
                    <div className="flex justify-between text-[10px] text-white/20 mt-1">
                        <span>16MB</span><span>700MB ⚡</span>
                    </div>
                </div>

                <div className="px-4 py-3.5 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                            <Image size={16} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <p className="text-sm font-medium text-white">Images Per Batch</p>
                                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg">
                                    {m.maxImagesAtOnce}
                                </span>
                            </div>
                        </div>
                    </div>
                    <input type="range" min={1} max={100} step={1} value={m.maxImagesAtOnce}
                        onChange={(e) => upd({ maxImagesAtOnce: parseInt(e.target.value) })}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-indigo-500 bg-white/10"
                    />
                    <div className="flex justify-between text-[10px] text-white/20 mt-1">
                        <span>1</span><span>100 images 🔥</span>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Image Quality">
                <SettingsRow icon={<Image size={16} />} label="Send Full Resolution Images"
                    description="No downscaling — sends original quality"
                    checked={m.sendFullResImages} onToggle={(v) => upd({ sendFullResImages: v })} badge="HD" />
                <SettingsRow icon={<Upload size={16} />} label="Disable Compression"
                    description="Send all media without any compression"
                    checked={m.disableCompression} onToggle={(v) => upd({ disableCompression: v })} />
            </SettingsSection>

            <SettingsSection title="Download & Saving">
                <SettingsRow icon={<Eye size={16} />} label="Download View-Once Media"
                    description="Save disappearing photos/videos before they expire"
                    checked={m.downloadViewOnce} onToggle={(v) => upd({ downloadViewOnce: v })} badge="PRO" />
                <SettingsRow icon={<Download size={16} />} label="Download Statuses Automatically"
                    checked={m.downloadStatuses} onToggle={(v) => upd({ downloadStatuses: v })} />
                <SettingsRow icon={<EyeOff size={16} />} label="Save Profile Pictures"
                    description="Auto-save contact profile photos to gallery"
                    checked={m.saveProfilePictures} onToggle={(v) => upd({ saveProfilePictures: v })} />
            </SettingsSection>
        </div>
    );
};

export default MediaSettings;
