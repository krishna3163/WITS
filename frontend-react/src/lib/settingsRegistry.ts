/**
 * WITS Super-App Settings Registry
 * Each setting has: setting_id, setting_category, setting_name, description,
 * default_value, requires_restart, permission_required.
 * Used for validation, cloud sync, and UI tooltips.
 */

import type { SettingCategory } from '../store/settingsStore';
import { DEFAULT_SETTINGS } from '../store/settingsStore';

export interface SettingDefinition {
    setting_id: string;
    setting_category: SettingCategory;
    setting_name: string;
    description: string;
    default_value: unknown;
    requires_restart: boolean;
    permission_required: string | null;
}

/** Flattened list of all setting definitions for sync and validation */
const DEFS: SettingDefinition[] = [];

function register(
    category: SettingCategory,
    entries: Array<{
        id: string;
        name: string;
        description: string;
        default_value: unknown;
        requires_restart?: boolean;
        permission_required?: string | null;
    }>
) {
    for (const e of entries) {
        DEFS.push({
            setting_id: e.id,
            setting_category: category,
            setting_name: e.name,
            description: e.description,
            default_value: e.default_value,
            requires_restart: e.requires_restart ?? false,
            permission_required: e.permission_required ?? null,
        });
    }
}

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────
const n = DEFAULT_SETTINGS.notifications;
register('notifications', [
    { id: 'notifications.disableAll', name: 'Disable All Notifications', description: 'Completely silence all alerts', default_value: n.disableAll, permission_required: 'notifications' },
    { id: 'notifications.autoHideAfter5s', name: 'Auto-Hide After 5s', description: 'Notifications disappear after 5 seconds', default_value: n.autoHideAfter5s },
    { id: 'notifications.floatingBubbles', name: 'Floating Bubble Notifications', description: 'Chat heads as floating bubbles', default_value: n.floatingBubbles },
    { id: 'notifications.toastNotifications', name: 'Toast Notifications', description: 'Slide-in banners for live activity', default_value: n.toastNotifications },
    { id: 'notifications.suppressOnDND', name: 'Suppress in Do Not Disturb', description: 'Block alerts when DND is active', default_value: n.suppressOnDND },
    { id: 'notifications.suppressOnLandscape', name: 'Suppress in Landscape', description: 'Hide when screen is rotated', default_value: n.suppressOnLandscape },
    { id: 'notifications.suppressOnGaming', name: 'Suppress in Gaming Mode', description: 'Block during gameplay', default_value: n.suppressOnGaming },
    { id: 'notifications.notifyContactOnline', name: 'Contact Online', description: 'Notify when contact comes online', default_value: n.notifyContactOnline },
    { id: 'notifications.notifyTyping', name: 'Typing', description: 'Notify when contact is typing', default_value: n.notifyTyping },
    { id: 'notifications.notifyVoiceRecording', name: 'Voice Recording', description: 'Notify when contact is recording', default_value: n.notifyVoiceRecording },
    { id: 'notifications.notifyMessageRead', name: 'Message Read', description: 'Notify when message is read', default_value: n.notifyMessageRead },
    { id: 'notifications.notifyAudioPlayed', name: 'Audio Played', description: 'Notify when audio is played', default_value: n.notifyAudioPlayed },
    { id: 'notifications.notifyStatusViewed', name: 'Status Viewed', description: 'Notify when status is viewed', default_value: n.notifyStatusViewed },
    { id: 'notifications.notifyProfileChanged', name: 'Profile Photo Changed', description: 'Notify when profile photo changes', default_value: n.notifyProfileChanged },
    { id: 'notifications.showCallerInfo', name: 'Show Caller Info', description: 'Display caller details after call', default_value: n.showCallerInfo },
    { id: 'notifications.showCallerCountry', name: 'Show Caller Country', description: 'Show country after call', default_value: n.showCallerCountry },
    { id: 'notifications.showCallerCity', name: 'Show Caller City', description: 'Show city after call', default_value: n.showCallerCity },
    { id: 'notifications.showCallerNetwork', name: 'Show Network Provider', description: 'Show carrier after call', default_value: n.showCallerNetwork },
]);

// ─── PRIVACY ───────────────────────────────────────────────────────────────
const p = DEFAULT_SETTINGS.privacy;
register('privacy', [
    { id: 'privacy.freezeLastSeen', name: 'Freeze Last Seen', description: 'Lock last seen time', default_value: p.freezeLastSeen },
    { id: 'privacy.hideOnlineStatus', name: 'Hide Online Status', description: 'Nobody can see when you are online', default_value: p.hideOnlineStatus },
    { id: 'privacy.fakeLastSeen', name: 'Fake Last Seen', description: 'Show fake last seen time', default_value: p.fakeLastSeen },
    { id: 'privacy.customLastSeenTimer', name: 'Last Seen Timer', description: 'Minutes ago to show', default_value: p.customLastSeenTimer },
    { id: 'privacy.hideBlueTicks', name: 'Hide Blue Ticks', description: 'Hide read receipts', default_value: p.hideBlueTicks },
    { id: 'privacy.hideDoubleTicks', name: 'Hide Double Ticks', description: 'Show only single tick', default_value: p.hideDoubleTicks },
    { id: 'privacy.hideTypingIndicator', name: 'Hide Typing Indicator', description: "Others won't see typing", default_value: p.hideTypingIndicator },
    { id: 'privacy.hideRecordingIndicator', name: 'Hide Recording Indicator', description: "Others won't see recording", default_value: p.hideRecordingIndicator },
    { id: 'privacy.storeDeletedMessages', name: 'Store Deleted Messages', description: 'Keep local copy of deleted messages', default_value: p.storeDeletedMessages },
    { id: 'privacy.storeDeletedStatuses', name: 'Store Deleted Statuses', description: 'Archive statuses before delete', default_value: p.storeDeletedStatuses },
    { id: 'privacy.allowViewOnceSave', name: 'Allow Saving View-Once', description: 'Save disappearing media', default_value: p.allowViewOnceSave },
    { id: 'privacy.disableAllCalls', name: 'Disable All Calls', description: 'Block all calls', default_value: p.disableAllCalls },
    { id: 'privacy.disableVoiceCalls', name: 'Disable Voice Calls', description: 'Block voice only', default_value: p.disableVoiceCalls },
    { id: 'privacy.disableVideoCalls', name: 'Disable Video Calls', description: 'Block video only', default_value: p.disableVideoCalls },
]);

// ─── LINKS ─────────────────────────────────────────────────────────────────
const l = DEFAULT_SETTINGS.links;
register('links', [
    { id: 'links.openLinksInApp', name: 'Open Links in App', description: 'Use in-app browser', default_value: l.openLinksInApp },
    { id: 'links.tiktokSecureViewer', name: 'TikTok Secure Viewer', description: 'Open TikTok without tracking', default_value: l.tiktokSecureViewer },
    { id: 'links.mediaDownloader', name: 'Media Downloader', description: 'Download from shared links', default_value: l.mediaDownloader },
]);

// ─── GENERAL ───────────────────────────────────────────────────────────────
const g = DEFAULT_SETTINGS.general;
register('general', [
    { id: 'general.textSizeScale', name: 'Text Size Scale', description: 'Global text size', default_value: g.textSizeScale },
    { id: 'general.screenDpiScale', name: 'Screen DPI Scale', description: 'Rendering density', default_value: g.screenDpiScale },
    { id: 'general.disableAnimations', name: 'Disable Animations', description: 'Remove motion effects', default_value: g.disableAnimations },
    { id: 'general.disableBlurEffects', name: 'Disable Blur', description: 'Remove backdrop blur', default_value: g.disableBlurEffects },
    { id: 'general.enableBetaFeatures', name: 'Beta Features', description: 'Unlock experimental features', default_value: g.enableBetaFeatures },
    { id: 'general.customStatusBarHeight', name: 'Status Bar Height', description: 'Override status bar (px)', default_value: g.customStatusBarHeight },
    { id: 'general.customNotificationIcon', name: 'Notification Icon', description: 'Custom notification icon', default_value: g.customNotificationIcon },
    { id: 'general.language', name: 'Language', description: 'App language', default_value: g.language },
]);

// ─── COLORS ───────────────────────────────────────────────────────────────
const c = DEFAULT_SETTINGS.colors;
register('colors', [
    { id: 'colors.primaryColor', name: 'Primary Color', description: 'Primary theme color', default_value: c.primaryColor },
    { id: 'colors.secondaryColor', name: 'Secondary Color', description: 'Secondary theme color', default_value: c.secondaryColor },
    { id: 'colors.headerColor', name: 'Header Color', description: 'Header background', default_value: c.headerColor },
    { id: 'colors.footerColor', name: 'Footer Color', description: 'Footer/nav color', default_value: c.footerColor },
    { id: 'colors.backgroundColor', name: 'Background Color', description: 'Main background', default_value: c.backgroundColor },
    { id: 'colors.gradientEnabled', name: 'Gradient Background', description: 'Use gradient', default_value: c.gradientEnabled },
    { id: 'colors.gradientStart', name: 'Gradient Start', description: 'Gradient start color', default_value: c.gradientStart },
    { id: 'colors.gradientEnd', name: 'Gradient End', description: 'Gradient end color', default_value: c.gradientEnd },
    { id: 'colors.wallpaperUrl', name: 'Wallpaper URL', description: 'Background image URL', default_value: c.wallpaperUrl },
]);

// ─── FONTS ─────────────────────────────────────────────────────────────────
const f = DEFAULT_SETTINGS.fonts;
register('fonts', [
    { id: 'fonts.titleFont', name: 'Title Font', description: 'Font for titles', default_value: f.titleFont },
    { id: 'fonts.messageFont', name: 'Message Font', description: 'Font for messages', default_value: f.messageFont },
    { id: 'fonts.customFontUrl', name: 'Custom Font URL', description: 'URL to custom font', default_value: f.customFontUrl },
    { id: 'fonts.launcherIcon', name: 'Launcher Icon', description: 'App launcher icon', default_value: f.launcherIcon },
    { id: 'fonts.notificationIcon', name: 'Notification Icon', description: 'Notification icon', default_value: f.notificationIcon },
    { id: 'fonts.appName', name: 'App Name', description: 'Rename application', default_value: f.appName },
]);

// ─── HOME SCREEN ───────────────────────────────────────────────────────────
const h = DEFAULT_SETTINGS.homescreen;
register('homescreen', [
    { id: 'homescreen.showUsernameInHeader', name: 'Show Username in Header', description: 'Display username in main header', default_value: h.showUsernameInHeader },
    { id: 'homescreen.disableChatFilters', name: 'Disable Chat Filters', description: 'Hide filter tabs', default_value: h.disableChatFilters },
    { id: 'homescreen.hideArchivedChats', name: 'Hide Archived Chats', description: 'Do not show archived in list', default_value: h.hideArchivedChats },
    { id: 'homescreen.hideFloatingButtons', name: 'Hide Floating Buttons', description: 'Hide FAB and floating actions', default_value: h.hideFloatingButtons },
    { id: 'homescreen.tabOrder', name: 'Tab Order', description: 'Order of main tabs', default_value: h.tabOrder },
]);

// ─── LIQUID GLASS ───────────────────────────────────────────────────────────
const lg = DEFAULT_SETTINGS.liquidglass;
register('liquidglass', [
    { id: 'liquidglass.enabled', name: 'Liquid Glass UI', description: 'Enable iOS-style glass', default_value: lg.enabled },
    { id: 'liquidglass.translucentPanels', name: 'Translucent Panels', description: 'See-through panels', default_value: lg.translucentPanels },
    { id: 'liquidglass.blurBackgrounds', name: 'Blur Backgrounds', description: 'Frosted backgrounds', default_value: lg.blurBackgrounds },
    { id: 'liquidglass.glassMessageInput', name: 'Glass Message Input', description: 'Frosted input bar', default_value: lg.glassMessageInput },
    { id: 'liquidglass.blurIntensity', name: 'Blur Intensity', description: 'Blur strength 0–20', default_value: lg.blurIntensity },
]);

// ─── CHAT INTERFACE ────────────────────────────────────────────────────────
const ch = DEFAULT_SETTINGS.chat;
register('chat', [
    { id: 'chat.separateGroups', name: 'Separate Groups', description: 'Show groups in separate section', default_value: ch.separateGroups },
    { id: 'chat.showOnlineIndicator', name: 'Online Indicator', description: 'Show green dot for online', default_value: ch.showOnlineIndicator },
    { id: 'chat.showLastMessageTimestamp', name: 'Last Message Time', description: 'Show time of last message', default_value: ch.showLastMessageTimestamp },
    { id: 'chat.showChatDivider', name: 'Chat Divider', description: 'Visual divider between chats', default_value: ch.showChatDivider },
    { id: 'chat.chatPreviewOnHold', name: 'Preview on Hold', description: 'Preview chat on long-press', default_value: ch.chatPreviewOnHold },
    { id: 'chat.maxPinnedChats', name: 'Max Pinned Chats', description: 'Up to 60 pinned chats', default_value: ch.maxPinnedChats },
]);

// ─── STATUS (and updates) ──────────────────────────────────────────────────
const st = DEFAULT_SETTINGS.status;
register('status', [
    { id: 'status.blurImages', name: 'Blur Effect on Images', description: 'Blur status images', default_value: st.blurImages },
    { id: 'status.disableReactions', name: 'Disable Reactions', description: 'Turn off status reactions', default_value: st.disableReactions },
    { id: 'status.disableStoryJumping', name: 'Disable Story Jumping', description: 'No auto-advance to next', default_value: st.disableStoryJumping },
    { id: 'status.autoPlaySound', name: 'Auto Play Sound', description: 'Play sound in status', default_value: st.autoPlaySound },
    { id: 'status.disableChannels', name: 'Disable Channels', description: 'Hide channels tab', default_value: st.disableChannels },
]);

// ─── CONVERSATION ──────────────────────────────────────────────────────────
const cv = DEFAULT_SETTINGS.conversation;
register('conversation', [
    { id: 'conversation.bubbleStyle', name: 'Bubble Style', description: 'Shape of message bubbles', default_value: cv.bubbleStyle },
    { id: 'conversation.fontSize', name: 'Font Size', description: 'Message text size', default_value: cv.fontSize },
    { id: 'conversation.emojiSize', name: 'Emoji Size', description: 'Size of emojis', default_value: cv.emojiSize },
    { id: 'conversation.stickerSize', name: 'Sticker Size', description: 'Size of stickers', default_value: cv.stickerSize },
    { id: 'conversation.linkColor', name: 'Link Color', description: 'Color of links', default_value: cv.linkColor },
    { id: 'conversation.bubbleColorSent', name: 'Sent Bubble Color', description: 'Outgoing bubble color', default_value: cv.bubbleColorSent },
    { id: 'conversation.bubbleColorReceived', name: 'Received Bubble Color', description: 'Incoming bubble color', default_value: cv.bubbleColorReceived },
    { id: 'conversation.doubleTapReaction', name: 'Double Tap Reaction', description: 'React with double tap', default_value: cv.doubleTapReaction },
    { id: 'conversation.customReactionEmoji', name: 'Custom Reaction Emoji', description: 'Default reaction emoji', default_value: cv.customReactionEmoji },
    { id: 'conversation.reactionAnimations', name: 'Reaction Animations', description: 'Animate reactions', default_value: cv.reactionAnimations },
]);

// ─── MESSAGING ──────────────────────────────────────────────────────────────
const m = DEFAULT_SETTINGS.messaging;
register('messaging', [
    { id: 'messaging.confirmBeforeSendingSticker', name: 'Confirm Before Sticker', description: 'Confirm before sending sticker', default_value: m.confirmBeforeSendingSticker },
    { id: 'messaging.modernReplyUI', name: 'Modern Reply UI', description: 'Use new reply layout', default_value: m.modernReplyUI },
    { id: 'messaging.disableQuickActions', name: 'Disable Quick Actions', description: 'Hide quick action bar', default_value: m.disableQuickActions },
    { id: 'messaging.popupChatWindow', name: 'Popup Chat Window', description: 'Chat in popup overlay', default_value: m.popupChatWindow },
    { id: 'messaging.emojiPackSwitcher', name: 'Emoji Pack Switcher', description: 'Switch emoji packs', default_value: m.emojiPackSwitcher },
    { id: 'messaging.disableAnimatedEmojis', name: 'Disable Animated Emojis', description: 'Static emojis only', default_value: m.disableAnimatedEmojis },
    { id: 'messaging.adminCrownIndicator', name: 'Admin Crown', description: 'Show crown for admins', default_value: m.adminCrownIndicator },
    { id: 'messaging.incognitoKeyboard', name: 'Incognito Keyboard', description: 'Do not learn from input', default_value: m.incognitoKeyboard },
    { id: 'messaging.copyWithoutMetadata', name: 'Copy Without Metadata', description: 'Plain text on copy', default_value: m.copyWithoutMetadata },
    { id: 'messaging.mentionAll', name: 'Mention All', description: 'Allow @all in groups', default_value: m.mentionAll },
    { id: 'messaging.showEditedIndicator', name: 'Show Edited Indicator', description: 'Show (edited) on messages', default_value: m.showEditedIndicator },
    { id: 'messaging.showEditTimestamp', name: 'Show Edit Timestamp', description: 'Show when edited', default_value: m.showEditTimestamp },
    { id: 'messaging.scheduleMessages', name: 'Schedule Messages', description: 'Send later', default_value: m.scheduleMessages },
    { id: 'messaging.autoReply', name: 'Auto Reply', description: 'Automatic reply when busy', default_value: m.autoReply },
    { id: 'messaging.autoReplyMessage', name: 'Auto Reply Message', description: 'Text of auto reply', default_value: m.autoReplyMessage },
    { id: 'messaging.sendToUnsavedNumber', name: 'Send to Unsaved Number', description: 'Allow messaging unsaved', default_value: m.sendToUnsavedNumber },
    { id: 'messaging.broadcastUnlimited', name: 'Broadcast Unlimited', description: 'No limit on broadcast list', default_value: m.broadcastUnlimited },
    { id: 'messaging.sendBlankMessages', name: 'Send Blank Messages', description: 'Allow empty messages', default_value: m.sendBlankMessages },
    { id: 'messaging.chatTranslator', name: 'Chat Translator', description: 'Translate messages', default_value: m.chatTranslator },
    { id: 'messaging.unlimitedPinnedChats', name: 'Unlimited Pinned Chats', description: 'Pin more than max', default_value: m.unlimitedPinnedChats },
    { id: 'messaging.saveDrafts', name: 'Save Drafts', description: 'Save message drafts', default_value: m.saveDrafts },
    { id: 'messaging.quickReplyTemplates', name: 'Quick Reply Templates', description: 'Predefined quick replies', default_value: m.quickReplyTemplates },
]);

// ─── ACCOUNT ───────────────────────────────────────────────────────────────
const a = DEFAULT_SETTINGS.account;
register('account', [
    { id: 'account.biometricLogin', name: 'Biometric Login', description: 'Use fingerprint/Face ID', default_value: a.biometricLogin, permission_required: 'biometric' },
    { id: 'account.passkeys', name: 'Passkeys', description: 'Passwordless sign-in', default_value: a.passkeys },
    { id: 'account.multiAccount', name: 'Multi Account', description: 'Multiple accounts', default_value: a.multiAccount },
    { id: 'account.twoFactorEnabled', name: 'Two-Factor Auth', description: '2FA enabled', default_value: a.twoFactorEnabled },
]);

// ─── STORAGE ───────────────────────────────────────────────────────────────
const s = DEFAULT_SETTINGS.storage;
register('storage', [
    { id: 'storage.detectLargeFiles', name: 'Detect Large Files', description: 'Flag files over 50MB', default_value: s.detectLargeFiles },
    { id: 'storage.detectDuplicates', name: 'Detect Duplicates', description: 'Find duplicate media', default_value: s.detectDuplicates },
    { id: 'storage.removeForwardedMedia', name: 'Remove Forwarded Media', description: 'Auto-delete forwarded', default_value: s.removeForwardedMedia },
    { id: 'storage.trackNetworkUsage', name: 'Track Network Usage', description: 'Monitor data usage', default_value: s.trackNetworkUsage },
    { id: 'storage.proxyEnabled', name: 'Proxy Enabled', description: 'Use custom proxy', default_value: s.proxyEnabled },
    { id: 'storage.proxyHost', name: 'Proxy Host', description: 'Proxy server host', default_value: s.proxyHost },
    { id: 'storage.proxyPort', name: 'Proxy Port', description: 'Proxy port', default_value: s.proxyPort },
    { id: 'storage.mediaUploadQuality', name: 'Upload Quality', description: 'Standard or HD', default_value: s.mediaUploadQuality },
    { id: 'storage.autoDeleteTempFiles', name: 'Auto-Delete Temp', description: 'Clean temp files', default_value: s.autoDeleteTempFiles },
]);

// ─── NOTIFICATION CONTROLS (same category as notifications for simplicity) ──
// Already covered in notifications.

// ─── MEDIA ─────────────────────────────────────────────────────────────────
const med = DEFAULT_SETTINGS.media;
register('media', [
    { id: 'media.maxUploadSizeMB', name: 'Max Upload Size', description: 'Up to 700MB', default_value: med.maxUploadSizeMB },
    { id: 'media.sendFullResImages', name: 'Full Resolution Images', description: 'No image compression', default_value: med.sendFullResImages },
    { id: 'media.maxImagesAtOnce', name: 'Max Images at Once', description: 'Up to 100', default_value: med.maxImagesAtOnce },
    { id: 'media.disableCompression', name: 'Disable Compression', description: 'Send originals', default_value: med.disableCompression },
    { id: 'media.downloadViewOnce', name: 'Download View-Once', description: 'Save view-once media', default_value: med.downloadViewOnce },
    { id: 'media.downloadStatuses', name: 'Download Statuses', description: 'Save status media', default_value: med.downloadStatuses },
    { id: 'media.saveProfilePictures', name: 'Save Profile Pictures', description: 'Save contact photos', default_value: med.saveProfilePictures },
]);

// ─── GROUPS ────────────────────────────────────────────────────────────────
const gr = DEFAULT_SETTINGS.groups;
register('groups', [
    { id: 'groups.mentionAllParticipants', name: 'Mention All', description: 'Mention all in group', default_value: gr.mentionAllParticipants },
    { id: 'groups.adminCrownEnabled', name: 'Admin Crown', description: 'Show crown for admins', default_value: gr.adminCrownEnabled },
    { id: 'groups.autoWelcomeMessage', name: 'Auto Welcome', description: 'Send welcome on join', default_value: gr.autoWelcomeMessage },
    { id: 'groups.welcomeMessageText', name: 'Welcome Message', description: 'Welcome text', default_value: gr.welcomeMessageText },
    { id: 'groups.autoRulesMessage', name: 'Auto Rules', description: 'Send rules on join', default_value: gr.autoRulesMessage },
    { id: 'groups.rulesMessageText', name: 'Rules Message', description: 'Rules text', default_value: gr.rulesMessageText },
    { id: 'groups.autoSpamRemoval', name: 'Auto Spam Removal', description: 'Remove spam automatically', default_value: gr.autoSpamRemoval },
    { id: 'groups.showOnlineMembers', name: 'Show Online Members', description: 'List online in group', default_value: gr.showOnlineMembers },
    { id: 'groups.customGroupThemes', name: 'Custom Group Themes', description: 'Per-group themes', default_value: gr.customGroupThemes },
]);

// ─── STATUS FEATURES ───────────────────────────────────────────────────────
const sf = DEFAULT_SETTINGS.statusFeatures;
register('statusfeatures', [
    { id: 'statusFeatures.uploadLongerVideos', name: 'Upload Longer Videos', description: 'Longer status videos', default_value: sf.uploadLongerVideos },
    { id: 'statusFeatures.uploadHDStatuses', name: 'Upload HD Statuses', description: 'High quality status', default_value: sf.uploadHDStatuses },
    { id: 'statusFeatures.downloadStatusMedia', name: 'Download Status Media', description: 'Save status media', default_value: sf.downloadStatusMedia },
    { id: 'statusFeatures.viewDeletedStatuses', name: 'View Deleted Statuses', description: 'See deleted statuses', default_value: sf.viewDeletedStatuses },
    { id: 'statusFeatures.hideStatusViews', name: 'Hide Status Views', description: 'Hide view count', default_value: sf.hideStatusViews },
    { id: 'statusFeatures.disableStoryJumping', name: 'Disable Story Jumping', description: 'No auto-advance', default_value: sf.disableStoryJumping },
    { id: 'statusFeatures.statusReactionSystem', name: 'Status Reactions', description: 'React to status', default_value: sf.statusReactionSystem },
]);

// ─── APPEARANCE ────────────────────────────────────────────────────────────
const ap = DEFAULT_SETTINGS.appearance;
register('appearance', [
    { id: 'appearance.theme', name: 'Theme', description: 'Light/dark/system', default_value: ap.theme },
    { id: 'appearance.activeThemeName', name: 'Active Theme Name', description: 'Current theme name', default_value: ap.activeThemeName },
    { id: 'appearance.customNavBar', name: 'Custom Nav Bar', description: 'Customize nav bar', default_value: ap.customNavBar },
    { id: 'appearance.customNavBarColor', name: 'Nav Bar Color', description: 'Nav bar color', default_value: ap.customNavBarColor },
    { id: 'appearance.customHeader', name: 'Custom Header', description: 'Custom header', default_value: ap.customHeader },
    { id: 'appearance.customFooter', name: 'Custom Footer', description: 'Custom footer', default_value: ap.customFooter },
]);

// ─── PERFORMANCE ────────────────────────────────────────────────────────────
const perf = DEFAULT_SETTINGS.performance;
register('performance', [
    { id: 'performance.autoCacheClean', name: 'Auto Cache Clean', description: 'Clean cache automatically', default_value: perf.autoCacheClean },
    { id: 'performance.autoJunkClean', name: 'Junk File Cleaner', description: 'Remove junk files', default_value: perf.autoJunkClean },
    { id: 'performance.memoryOptimizer', name: 'Memory Optimizer', description: 'Reduce memory use', default_value: perf.memoryOptimizer },
    { id: 'performance.lightweightMode', name: 'Lightweight Mode', description: 'Minimal resources', default_value: perf.lightweightMode },
    { id: 'performance.backgroundTaskManager', name: 'Background Task Manager', description: 'Manage background tasks', default_value: perf.backgroundTaskManager },
    { id: 'performance.fastMessageLoading', name: 'Fast Message Loading', description: 'Quick load messages', default_value: perf.fastMessageLoading },
]);

// ─── SECURITY ──────────────────────────────────────────────────────────────
const sec = DEFAULT_SETTINGS.security;
register('security', [
    { id: 'security.spamDetection', name: 'Spam Detection', description: 'Block spam', default_value: sec.spamDetection },
    { id: 'security.rateLimiting', name: 'Rate Limiting', description: 'Prevent abuse', default_value: sec.rateLimiting },
    { id: 'security.deviceSpoofProtection', name: 'Device Spoof Protection', description: 'Block emulators', default_value: sec.deviceSpoofProtection },
    { id: 'security.appLockFingerprint', name: 'Fingerprint Lock', description: 'Biometric lock', default_value: sec.appLockFingerprint, permission_required: 'biometric' },
    { id: 'security.passcodeEnabled', name: 'Passcode Lock', description: 'PIN lock', default_value: sec.passcodeEnabled },
    { id: 'security.passcode', name: 'Passcode', description: '4-digit PIN', default_value: sec.passcode },
    { id: 'security.disableUnknownMessages', name: 'Block Unknown Messages', description: 'Only saved contacts', default_value: sec.disableUnknownMessages },
]);

// ─── DEVELOPER ──────────────────────────────────────────────────────────────
const d = DEFAULT_SETTINGS.developer;
register('developer', [
    { id: 'developer.debugMode', name: 'Debug Mode', description: 'Enable debug logs', default_value: d.debugMode },
    { id: 'developer.featureFlagsEnabled', name: 'Feature Flags', description: 'Override features', default_value: d.featureFlagsEnabled },
    { id: 'developer.overrideExperimental', name: 'Override Experimental', description: 'Force experimental', default_value: d.overrideExperimental },
    { id: 'developer.customApiEndpoint', name: 'Custom API', description: 'Override API URL', default_value: d.customApiEndpoint },
    { id: 'developer.animationTimingMultiplier', name: 'Animation Timing', description: 'Speed of animations', default_value: d.animationTimingMultiplier },
    { id: 'developer.logLevel', name: 'Log Level', description: 'Console log level', default_value: d.logLevel },
    { id: 'developer.showFpsCounter', name: 'FPS Counter', description: 'Show FPS', default_value: d.showFpsCounter },
    { id: 'developer.networkInspector', name: 'Network Inspector', description: 'Inspect requests', default_value: d.networkInspector },
]);

// ─── EXPORTS ────────────────────────────────────────────────────────────────

export const SETTINGS_REGISTRY: SettingDefinition[] = DEFS;

export function getSettingDefinition(settingId: string): SettingDefinition | undefined {
    return DEFS.find((d) => d.setting_id === settingId);
}

export function getDefinitionsByCategory(category: SettingCategory): SettingDefinition[] {
    return DEFS.filter((d) => d.setting_category === category);
}
