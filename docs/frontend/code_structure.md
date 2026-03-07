# Frontend Code Structure & Architecture

## Overview
The Super-App frontend is designed as a universal application supporting Android, iOS, Tablets, Foldables, and Web. To achieve native performance, fluid Material Design 3 (MD3) Expressive animations, and cross-platform responsive layouts, the codebase defaults to a **React Native (Expo)** or modern **PWA (React + Vite)** approach depending on deployment targets.

## Repository Structure

```text
superapp-frontend/
├── src/
│   ├── assets/             # Icons, images, Lottie animations, fonts
│   ├── components/         # Reusable UI component library (MD3 compliant)
│   │   ├── core/           # Buttons, Cards, Inputs, Dialogs, BottomSheets
│   │   ├── layout/         # NavigationRail, BottomNavigation, Drawer
│   │   └── shared/         # Skeletons, ErrorStates, Avatars
│   ├── config/             # Environment variables, Theme config (MD3)
│   ├── features/           # Feature-based modular structure
│   │   ├── auth/           # Login, Biometrics, OTP
│   │   ├── chat/           # ChatList, ChatConversation, MediaPicker
│   │   ├── feed/           # Moments, Stories, PostCreation
│   │   ├── groups/         # Group settings, Member lists, Admin tools
│   │   ├── miniapps/       # Store grid, WebView Sandbox bridge
│   │   ├── wallet/         # Balances, QR Scanner, Transactions
│   │   └── profile/        # Bios, Settings, Privacy
│   ├── hooks/              # Custom React hooks (e.g., useResponsive, useRealtime)
│   ├── navigation/         # React Navigation stacks, tabs, and rails
│   ├── services/           # API clients, WebSocket (InsForge Realtime), SDKs
│   ├── store/              # Global state (Zustand or Redux Toolkit)
│   ├── theme/              # Material Design 3 tokens, colors, typography
│   └── utils/              # Formatting, validators, error handlers
├── App.tsx                 # Entry point, ThemeProvider, NavigationContainer
├── package.json            # Dependencies
└── tailwind.config.js      # Base responsive breakpoints (if using NativeWind/Tailwind)
```

## State Management
- **Local State**: React `useState` and `useReducer` for component-level UI state.
- **Global State**: `Zustand` for lightweight, high-performance global states (user session, theme preference).
- **Server State**: `React Query` (TanStack Query) for API caching, pagination, infinite scroll (Social Feed), and synchronization.
- **Real-Time State**: InsForge WebSocket SDK context wrapping the chat and notification endpoints.

## Responsive Capabilities
We use a centralized custom hook `useResponsiveLayout()` that listens to React Native's `useWindowDimensions` or web media queries to determine the device class dynamically.

- `isPhone` (w < 600dp)
- `isTablet` (600dp <= w < 840dp)
- `isLargeTablet` (w >= 840dp)

This controls the structural rendering logic inside the `navigation/` folder.
