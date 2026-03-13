/**
 * Applies WitsSettings (colors, fonts, liquid glass) to the document as CSS variables.
 * Mount once at app root so all screens inherit.
 */
import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export function SettingsThemeApply() {
    const settings = useSettingsStore((s) => s.settings);
    const { colors, fonts, liquidglass, general } = settings;

    useEffect(() => {
        const root = document.documentElement;

        root.style.setProperty('--wits-primary', colors.primaryColor);
        root.style.setProperty('--wits-secondary', colors.secondaryColor);
        root.style.setProperty('--wits-header', colors.headerColor);
        root.style.setProperty('--wits-footer', colors.footerColor);
        root.style.setProperty('--wits-bg', colors.backgroundColor);
        root.style.setProperty('--wits-gradient-start', colors.gradientStart);
        root.style.setProperty('--wits-gradient-end', colors.gradientEnd);
        root.style.setProperty('--wits-wallpaper', colors.wallpaperUrl ? `url(${colors.wallpaperUrl})` : 'none');
        root.style.setProperty('--wits-gradient-enabled', colors.gradientEnabled ? '1' : '0');

        root.style.setProperty('--wits-title-font', fonts.titleFont);
        root.style.setProperty('--wits-message-font', fonts.messageFont);

        root.style.setProperty('--wits-blur-intensity', String(liquidglass.blurIntensity));
        root.style.setProperty('--wits-glass-enabled', liquidglass.enabled ? '1' : '0');
        root.style.setProperty('--wits-blur-backgrounds', liquidglass.blurBackgrounds ? '1' : '0');

        root.style.setProperty('--wits-text-scale', String(general.textSizeScale));
        root.style.setProperty('--wits-dpi-scale', String(general.screenDpiScale));
        root.style.setProperty('--wits-animations', general.disableAnimations ? '0' : '1');
        root.style.setProperty('--wits-blur-effects', general.disableBlurEffects ? '0' : '1');
        root.style.setProperty('--wits-status-bar-height', `${general.customStatusBarHeight}px`);
    }, [settings.colors, settings.fonts, settings.liquidglass, settings.general]);

    return null;
}
