import React from 'react';
import { SettingsSection, SettingsRow } from './SettingsToggle';
import { useSettingsStore } from '../../../store/settingsStore';
import { Link, ExternalLink, Download, Video } from 'lucide-react';

const LinkSettings: React.FC = () => {
    const { settings, updateSection } = useSettingsStore();
    const l = settings.links;
    const upd = (patch: Partial<typeof l>) => updateSection('links', patch);

    return (
        <div className="space-y-1">
            <SettingsSection title="Link Opening Mode">
                <SettingsRow icon={<Link size={16} />} label="Open Links Inside App"
                    description="Use WITS built-in browser engine"
                    checked={l.openLinksInApp} onToggle={(v) => upd({ openLinksInApp: v })} />
                <SettingsRow icon={<ExternalLink size={16} />} label="Open Links Externally"
                    description="Use device default browser"
                    checked={!l.openLinksInApp} onToggle={(v) => upd({ openLinksInApp: !v })} />
            </SettingsSection>

            <SettingsSection title="Special Link Handlers">
                <SettingsRow icon={<Video size={16} />} label="TikTok Secure Viewer"
                    description="Open TikTok links without tracking"
                    checked={l.tiktokSecureViewer} onToggle={(v) => upd({ tiktokSecureViewer: v })} badge="BETA" />
                <SettingsRow icon={<Download size={16} />} label="Media Downloader"
                    description="Download media from shared links (YouTube, Instagram, etc.)"
                    checked={l.mediaDownloader} onToggle={(v) => upd({ mediaDownloader: v })} badge="PRO" />
            </SettingsSection>
        </div>
    );
};

export default LinkSettings;
