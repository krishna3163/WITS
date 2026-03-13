import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type SettingCategory =
    | 'notifications' | 'privacy' | 'links' | 'general' | 'colors'
    | 'fonts' | 'homescreen' | 'liquidglass' | 'chat' | 'status'
    | 'conversation' | 'messaging' | 'account' | 'storage' | 'notifcontrols'
    | 'media' | 'groups' | 'statusfeatures' | 'appearance' | 'performance'
    | 'security' | 'developer';

export interface SettingMeta {
    setting_id: string;
    setting_category: SettingCategory;
    setting_name: string;
    description: string;
    requires_restart: boolean;
    permission_required: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION PREFERENCES
// ─────────────────────────────────────────────────────────────────────────────
export interface NotificationSettings {
    disableAll: boolean;
    autoHideAfter5s: boolean;
    floatingBubbles: boolean;
    toastNotifications: boolean;
    suppressOnDND: boolean;
    suppressOnLandscape: boolean;
    suppressOnGaming: boolean;
    notifyContactOnline: boolean;
    notifyTyping: boolean;
    notifyVoiceRecording: boolean;
    notifyMessageRead: boolean;
    notifyAudioPlayed: boolean;
    notifyStatusViewed: boolean;
    notifyProfileChanged: boolean;
    showCallerInfo: boolean;
    showCallerCountry: boolean;
    showCallerCity: boolean;
    showCallerNetwork: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIVACY AND SECURITY
// ─────────────────────────────────────────────────────────────────────────────
export interface PrivacySettings {
    freezeLastSeen: boolean;
    hideOnlineStatus: boolean;
    fakeLastSeen: boolean;
    customLastSeenTimer: number; // minutes
    hideBlueTicks: boolean;
    hideDoubleTicks: boolean;
    hideTypingIndicator: boolean;
    hideRecordingIndicator: boolean;
    storeDeletedMessages: boolean;
    storeDeletedStatuses: boolean;
    allowViewOnceSave: boolean;
    disableAllCalls: boolean;
    disableVoiceCalls: boolean;
    disableVideoCalls: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// LINKS AND BROWSER
// ─────────────────────────────────────────────────────────────────────────────
export interface LinkSettings {
    openLinksInApp: boolean;
    tiktokSecureViewer: boolean;
    mediaDownloader: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERAL CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
export interface GeneralSettings {
    textSizeScale: number; // 0.8 – 1.4
    screenDpiScale: number; // 0.8 – 1.4
    disableAnimations: boolean;
    disableBlurEffects: boolean;
    enableBetaFeatures: boolean;
    customStatusBarHeight: number; // px
    customNotificationIcon: string;
    language: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOR CUSTOMIZATION
// ─────────────────────────────────────────────────────────────────────────────
export interface ColorSettings {
    primaryColor: string;
    secondaryColor: string;
    headerColor: string;
    footerColor: string;
    backgroundColor: string;
    gradientEnabled: boolean;
    gradientStart: string;
    gradientEnd: string;
    wallpaperUrl: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FONTS AND ICONS
// ─────────────────────────────────────────────────────────────────────────────
export interface FontSettings {
    titleFont: string;
    messageFont: string;
    customFontUrl: string;
    launcherIcon: string;
    notificationIcon: string;
    appName: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export interface HomeScreenSettings {
    showUsernameInHeader: boolean;
    disableChatFilters: boolean;
    hideArchivedChats: boolean;
    hideFloatingButtons: boolean;
    tabOrder: string[]; // ['chats','communities','updates','calls','settings']
}

// ─────────────────────────────────────────────────────────────────────────────
// LIQUID GLASS UI
// ─────────────────────────────────────────────────────────────────────────────
export interface LiquidGlassSettings {
    enabled: boolean;
    translucentPanels: boolean;
    blurBackgrounds: boolean;
    glassMessageInput: boolean;
    blurIntensity: number; // 0–20
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAT INTERFACE
// ─────────────────────────────────────────────────────────────────────────────
export interface ChatSettings {
    separateGroups: boolean;
    showOnlineIndicator: boolean;
    showLastMessageTimestamp: boolean;
    showChatDivider: boolean;
    chatPreviewOnHold: boolean;
    maxPinnedChats: number; // up to 60
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS
// ─────────────────────────────────────────────────────────────────────────────
export interface StatusSettings {
    blurImages: boolean;
    disableReactions: boolean;
    disableStoryJumping: boolean;
    autoPlaySound: boolean;
    disableChannels: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSATION SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export interface ConversationSettings {
    bubbleStyle: 'rounded' | 'sharp' | 'pill' | 'ios';
    fontSize: number;
    emojiSize: number;
    stickerSize: number;
    linkColor: string;
    bubbleColorSent: string;
    bubbleColorReceived: string;
    doubleTapReaction: boolean;
    customReactionEmoji: string;
    reactionAnimations: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// ADVANCED MESSAGING
// ─────────────────────────────────────────────────────────────────────────────
export interface MessagingSettings {
    confirmBeforeSendingSticker: boolean;
    modernReplyUI: boolean;
    disableQuickActions: boolean;
    popupChatWindow: boolean;
    emojiPackSwitcher: boolean;
    disableAnimatedEmojis: boolean;
    adminCrownIndicator: boolean;
    incognitoKeyboard: boolean;
    copyWithoutMetadata: boolean;
    mentionAll: boolean;
    showEditedIndicator: boolean;
    showEditTimestamp: boolean;
    scheduleMessages: boolean;
    autoReply: boolean;
    autoReplyMessage: string;
    sendToUnsavedNumber: boolean;
    broadcastUnlimited: boolean;
    sendBlankMessages: boolean;
    chatTranslator: boolean;
    unlimitedPinnedChats: boolean;
    saveDrafts: boolean;
    quickReplyTemplates: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCOUNT
// ─────────────────────────────────────────────────────────────────────────────
export interface AccountSettings {
    biometricLogin: boolean;
    passkeys: boolean;
    multiAccount: boolean;
    twoFactorEnabled: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE AND DATA
// ─────────────────────────────────────────────────────────────────────────────
export interface StorageSettings {
    detectLargeFiles: boolean;
    detectDuplicates: boolean;
    removeForwardedMedia: boolean;
    trackNetworkUsage: boolean;
    proxyEnabled: boolean;
    proxyHost: string;
    proxyPort: number;
    mediaUploadQuality: 'standard' | 'hd';
    autoDeleteTempFiles: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA FEATURES
// ─────────────────────────────────────────────────────────────────────────────
export interface MediaSettings {
    maxUploadSizeMB: number; // up to 700
    sendFullResImages: boolean;
    maxImagesAtOnce: number; // up to 100
    disableCompression: boolean;
    downloadViewOnce: boolean;
    downloadStatuses: boolean;
    saveProfilePictures: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// GROUP MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────
export interface GroupSettings {
    mentionAllParticipants: boolean;
    adminCrownEnabled: boolean;
    autoWelcomeMessage: boolean;
    welcomeMessageText: string;
    autoRulesMessage: boolean;
    rulesMessageText: string;
    autoSpamRemoval: boolean;
    showOnlineMembers: boolean;
    customGroupThemes: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS FEATURES
// ─────────────────────────────────────────────────────────────────────────────
export interface StatusFeatureSettings {
    uploadLongerVideos: boolean;
    uploadHDStatuses: boolean;
    downloadStatusMedia: boolean;
    viewDeletedStatuses: boolean;
    hideStatusViews: boolean;
    disableStoryJumping: boolean;
    statusReactionSystem: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// APP APPEARANCE
// ─────────────────────────────────────────────────────────────────────────────
export interface AppearanceSettings {
    theme: 'light' | 'dark' | 'system' | 'amoled';
    activeThemeName: string;
    customNavBar: boolean;
    customNavBarColor: string;
    customHeader: boolean;
    customFooter: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// PERFORMANCE
// ─────────────────────────────────────────────────────────────────────────────
export interface PerformanceSettings {
    autoCacheClean: boolean;
    autoJunkClean: boolean;
    memoryOptimizer: boolean;
    lightweightMode: boolean;
    backgroundTaskManager: boolean;
    fastMessageLoading: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY
// ─────────────────────────────────────────────────────────────────────────────
export interface SecuritySettings {
    spamDetection: boolean;
    rateLimiting: boolean;
    deviceSpoofProtection: boolean;
    appLockFingerprint: boolean;
    passcodeEnabled: boolean;
    passcode: string;
    disableUnknownMessages: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEVELOPER TOOLS
// ─────────────────────────────────────────────────────────────────────────────
export interface DeveloperSettings {
    debugMode: boolean;
    featureFlagsEnabled: boolean;
    overrideExperimental: boolean;
    customApiEndpoint: string;
    animationTimingMultiplier: number; // 0.1 – 3.0
    logLevel: 'error' | 'warn' | 'info' | 'debug' | 'verbose';
    showFpsCounter: boolean;
    networkInspector: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER SETTINGS OBJECT
// ─────────────────────────────────────────────────────────────────────────────
export interface WitsSettings {
    notifications: NotificationSettings;
    privacy: PrivacySettings;
    links: LinkSettings;
    general: GeneralSettings;
    colors: ColorSettings;
    fonts: FontSettings;
    homescreen: HomeScreenSettings;
    liquidglass: LiquidGlassSettings;
    chat: ChatSettings;
    status: StatusSettings;
    conversation: ConversationSettings;
    messaging: MessagingSettings;
    account: AccountSettings;
    storage: StorageSettings;
    media: MediaSettings;
    groups: GroupSettings;
    statusFeatures: StatusFeatureSettings;
    appearance: AppearanceSettings;
    performance: PerformanceSettings;
    security: SecuritySettings;
    developer: DeveloperSettings;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT VALUES
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS: WitsSettings = {
    notifications: {
        disableAll: false, autoHideAfter5s: true, floatingBubbles: true,
        toastNotifications: true, suppressOnDND: true, suppressOnLandscape: false,
        suppressOnGaming: true, notifyContactOnline: true, notifyTyping: true,
        notifyVoiceRecording: true, notifyMessageRead: false, notifyAudioPlayed: false,
        notifyStatusViewed: false, notifyProfileChanged: true,
        showCallerInfo: true, showCallerCountry: true, showCallerCity: true, showCallerNetwork: false,
    },
    privacy: {
        freezeLastSeen: false, hideOnlineStatus: false, fakeLastSeen: false,
        customLastSeenTimer: 60, hideBlueTicks: false, hideDoubleTicks: false,
        hideTypingIndicator: false, hideRecordingIndicator: false,
        storeDeletedMessages: true, storeDeletedStatuses: true,
        allowViewOnceSave: false, disableAllCalls: false,
        disableVoiceCalls: false, disableVideoCalls: false,
    },
    links: { openLinksInApp: true, tiktokSecureViewer: false, mediaDownloader: true },
    general: {
        textSizeScale: 1.0, screenDpiScale: 1.0, disableAnimations: false,
        disableBlurEffects: false, enableBetaFeatures: false,
        customStatusBarHeight: 0, customNotificationIcon: '', language: 'en',
    },
    colors: {
        primaryColor: '#6366f1', secondaryColor: '#8b5cf6',
        headerColor: '#1e1e2e', footerColor: '#1e1e2e',
        backgroundColor: '#0f0f1a', gradientEnabled: false,
        gradientStart: '#6366f1', gradientEnd: '#8b5cf6', wallpaperUrl: '',
    },
    fonts: {
        titleFont: 'Inter', messageFont: 'Inter',
        customFontUrl: '', launcherIcon: '', notificationIcon: '', appName: 'WITS',
    },
    homescreen: {
        showUsernameInHeader: true, disableChatFilters: false,
        hideArchivedChats: false, hideFloatingButtons: false,
        tabOrder: ['chats', 'communities', 'updates', 'calls', 'settings'],
    },
    liquidglass: {
        enabled: true, translucentPanels: true, blurBackgrounds: true,
        glassMessageInput: true, blurIntensity: 12,
    },
    chat: {
        separateGroups: false, showOnlineIndicator: true,
        showLastMessageTimestamp: true, showChatDivider: true,
        chatPreviewOnHold: true, maxPinnedChats: 10,
    },
    status: {
        blurImages: false, disableReactions: false, disableStoryJumping: false,
        autoPlaySound: true, disableChannels: false,
    },
    conversation: {
        bubbleStyle: 'rounded', fontSize: 14, emojiSize: 24, stickerSize: 120,
        linkColor: '#6366f1', bubbleColorSent: '#6366f1', bubbleColorReceived: '#2a2a3e',
        doubleTapReaction: true, customReactionEmoji: '❤️', reactionAnimations: true,
    },
    messaging: {
        confirmBeforeSendingSticker: false, modernReplyUI: true,
        disableQuickActions: false, popupChatWindow: false,
        emojiPackSwitcher: true, disableAnimatedEmojis: false,
        adminCrownIndicator: true, incognitoKeyboard: false,
        copyWithoutMetadata: true, mentionAll: false,
        showEditedIndicator: true, showEditTimestamp: true,
        scheduleMessages: true, autoReply: false,
        autoReplyMessage: "I'm currently unavailable, I'll reply soon!",
        sendToUnsavedNumber: true, broadcastUnlimited: false,
        sendBlankMessages: false, chatTranslator: true,
        unlimitedPinnedChats: false, saveDrafts: true,
        quickReplyTemplates: ["OK", "Sure!", "On my way", "Be right back"],
    },
    account: { biometricLogin: false, passkeys: false, multiAccount: false, twoFactorEnabled: false },
    storage: {
        detectLargeFiles: true, detectDuplicates: true, removeForwardedMedia: false,
        trackNetworkUsage: true, proxyEnabled: false, proxyHost: '', proxyPort: 8080,
        mediaUploadQuality: 'hd', autoDeleteTempFiles: true,
    },
    media: {
        maxUploadSizeMB: 700, sendFullResImages: true, maxImagesAtOnce: 100,
        disableCompression: false, downloadViewOnce: false,
        downloadStatuses: true, saveProfilePictures: false,
    },
    groups: {
        mentionAllParticipants: false, adminCrownEnabled: true,
        autoWelcomeMessage: false, welcomeMessageText: 'Welcome to the group! 👋',
        autoRulesMessage: false, rulesMessageText: '1. Be respectful\n2. No spam',
        autoSpamRemoval: false, showOnlineMembers: true, customGroupThemes: false,
    },
    statusFeatures: {
        uploadLongerVideos: true, uploadHDStatuses: true,
        downloadStatusMedia: true, viewDeletedStatuses: true,
        hideStatusViews: false, disableStoryJumping: false, statusReactionSystem: true,
    },
    appearance: {
        theme: 'dark', activeThemeName: 'WITS Dark',
        customNavBar: false, customNavBarColor: '#1e1e2e',
        customHeader: false, customFooter: false,
    },
    performance: {
        autoCacheClean: true, autoJunkClean: false, memoryOptimizer: true,
        lightweightMode: false, backgroundTaskManager: true, fastMessageLoading: true,
    },
    security: {
        spamDetection: true, rateLimiting: true, deviceSpoofProtection: false,
        appLockFingerprint: false, passcodeEnabled: false, passcode: '',
        disableUnknownMessages: false,
    },
    developer: {
        debugMode: false, featureFlagsEnabled: false, overrideExperimental: false,
        customApiEndpoint: '', animationTimingMultiplier: 1.0,
        logLevel: 'error', showFpsCounter: false, networkInspector: false,
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// STORE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────
interface SettingsState {
    settings: WitsSettings;
    // keep old shape for App.tsx compat
    updateSettings: (patch: RecursivePartial<WitsSettings>) => void;
    updateSection: <K extends keyof WitsSettings>(section: K, patch: Partial<WitsSettings[K]>) => void;
    resetSection: <K extends keyof WitsSettings>(section: K) => void;
    resetAll: () => void;
    // Derived helpers
    isDarkMode: () => boolean;
}

type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

export const useSettingsStore = create<SettingsState>()(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                settings: DEFAULT_SETTINGS,

                updateSettings: (patch) =>
                    set((state) => ({
                        settings: deepMerge(state.settings, patch) as WitsSettings,
                    })),

                updateSection: (section, patch) =>
                    set((state) => ({
                        settings: {
                            ...state.settings,
                            [section]: { ...state.settings[section], ...patch },
                        },
                    })),

                resetSection: (section) =>
                    set((state) => ({
                        settings: { ...state.settings, [section]: DEFAULT_SETTINGS[section] },
                    })),

                resetAll: () => set({ settings: DEFAULT_SETTINGS }),

                isDarkMode: () => {
                    const theme = get().settings.appearance.theme;
                    if (theme === 'dark' || theme === 'amoled') return true;
                    if (theme === 'light') return false;
                    return window.matchMedia('(prefers-color-scheme: dark)').matches;
                },
            }),
            { name: 'wits-settings-v3' }
        )
    )
);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function deepMerge(target: any, source: any): any {
    const result = { ...target };
    for (const key in source) {
        if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(target[key] ?? {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}
