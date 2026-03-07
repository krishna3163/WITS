# Screen Designs & Key Features

## 1. Home / Chat List Screen
- **App Bar**: Search Bar integrated natively into the top app bar using an Extra-Large MD3 rounded container (28dp).
- **List Items**: Prominent Avatar (Full round), Title (Body Large), Subtitle (Body Medium, secondary color), Unread Badge (Primary color, pill shape).
- **Gestures**: 
  - Swipe Right -> Pin Conversation (animates to top with a soft tertiary background).
  - Swipe Left -> Mark Read / Mute.
- **FAB**: Bottom right, Animated expand on scroll up, shrinks to icon on scroll down.

## 2. Chat Conversation Screen
- **Header**: Back button, Contact/Group Avatar, Name, Online Status/Typing Indicator (smooth fade animation).
- **Message Bubbles**: 
  - Rounded Large (16dp).
  - Sender: Primary Background, Primary Foreground Text.
  - Receiver: Surface Variant Background, On-Surface Text.
  - Contextual corner radiuses (e.g., subsequent messages from same sender share sharp inner corners).
- **Input Area**: 
  - Fluidly expanding `TextInput`.
  - Prefix: Emoji Button.
  - Suffix: Camera Icon, Voice Record (Hold to record animation), Add Attachment (+) rotating to (x) when open.
- **Gestures**: Swipe message horizontally to reply. Long press triggers an MD3 modal overlay for Reactions (horizontal emoji strip) and actions (Forward, Copy).

## 3. Social Feed / Moments
- **Stories Carousel**: Horizontal scrolling avatars with colorful borders indicating unseen status.
- **Feed Cards**:
  - Edge-to-edge media for immersive feel or standard padded MD3 Cards.
  - Media: Lazy-loaded, skeleton layout matching media aspect ratio before load.
  - Actions at bottom: Like (Heart burst animation), Comment, Share.
- **Performance**: Virtualized List rendering (only items in viewport exist in DOM).

## 4. Mini App Store & Runtime
- **Store UI**: 
  - Hero carousel for featured apps.
  - Grid layout (2x2 on mobile, 4x4 on tablet) for categories.
- **Runtime**:
  - A Sandboxed `WebView`.
  - Injected JavaScript bridge communicating back to the host React Native layer to execute commands (e.g., `window.SuperApp.scanQRCode()`).
  - Loading State: MD3 Circular Progress Indicator over a blurred overlay.

## 5. Wallet Screen
- **Hero Card**: A bright gradient or primary surface card displaying the user's balance with an "eye" icon to mask the total.
- **Quick Links**: 4 circular icon buttons arranged horizontally: Send, Request, Scan, Pay Code.
- **Transaction List**: Bottom sheet-style list scrolling up smoothly over the Hero Card.
- **Security**: Invokes native biometric APIs (FaceID/TouchID) prior to executing any transfer endpoints.

## 6. Groups & Communities
- **Channels Layout**: If it's a Super Group, a left-hand contextual drawer opens showing #announcements, #general.
- **Settings Page**: Material List layout featuring toggles for notifications, chips for member roles, and an accordion view for shared media/links.
