# Material Design 3 Theme Configuration

## MD3 Expressive Guidelines
Our theme leverages Material Design 3's *Dynamic Color* extraction (Monet) on Android 12+, falling back to a curated premium palette for iOS and unsupported devices.

### 1. Color System (Tokens)
We define absolute light and dark color schemas utilizing MD3 tonal palettes.

#### Semantic Colors (Fallback / iOS)
- **Primary**: Brand identity. Used for major actions (Fab, Send Button).
  - Light: `#006495`
  - Dark: `#8ECAFF`
- **Secondary**: Accents and highlighting.
  - Light: `#50606E`
  - Dark: `#B7C8D9`
- **Tertiary**: Playful, distinct elements (Mini App interactions).
  - Light: `#65587B`
  - Dark: `#D0BCFF`
- **Error**: Validation and destructive actions.
  - Light: `#BA1A1A`
  - Dark: `#FFB4AB`
- **Background**: Lowest surface level.
  - Light: `#FCFCFF`
  - Dark: `#1A1C1E`
- **Surface**: Chat bubbles, cards, bottom sheets.
  - Surface 1 to Surface 5 (increasing elevation = lighter in dark mode, darker in light mode via overlay opacities).

### 2. Typography Scale
We utilize standard MD3 typographic mapping, maintaining high legibility and using a modern sans-serif like `Inter` or `Roboto`.

- **Display Large**: 57sp / 64 line-height (App Hero screens, Onboarding).
- **Display Medium**: 45sp / 52 line-height.
- **Headline Large**: 32sp / 40 line-height (Settings Headers, Wallet Balance).
- **Title Large**: 22sp / 28 line-height (Top App Bar).
- **Body Large**: 16sp / 24 line-height (Chat message bubbles).
- **Body Medium**: 14sp / 20 line-height (Standard text).
- **Label Small**: 11sp / 16 line-height (Bottom Navigation labels, timestamp).

### 3. Shapes & Corners
MD3 Expressive relies heavily on heavily rounded corners to feel soft and welcoming.

- **None**: 0dp
- **Extra Small**: 4dp (Snackbars)
- **Small**: 8dp (Chips, Tags)
- **Medium**: 12dp (Cards, Buttons)
- **Large**: 16dp (Chat Bubbles, standard radius)
- **Extra Large**: 28dp (Floating Action Buttons, Bottom Sheets, Search Bars)
- **Full**: 999dp (Pills, Avatars)

### 4. Elevations (Soft Shadows)
Instead of hard drop-shadows, MD3 uses colored tinted surface overlays combined with very soft diffusion.
- **Level 0**: No shadow.
- **Level 1**: +5% Primary color overlay, subtle 1dp shadow (Cards).
- **Level 2**: +8% Primary color overlay, 3dp shadow (FAB).
- **Level 3**: +11% Primary color overlay, 6dp shadow (Bottom Sheet).
