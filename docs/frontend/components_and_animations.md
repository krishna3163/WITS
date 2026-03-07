# Components, Animation & Error Handling

## Component Library (Reusable MD3)
All inputs, buttons, and layout elements adhere to atomic design and strict MD3 constraints:
1. **Buttons**: Filled, Tonal, Outlined, Text, Elevated.
2. **Inputs**: Outlined text fields with label animations (floats to top left on focus).
3. **Dialogs**: Center-stacked modal cards (Extra-Large border radius) with a clear title, body, and right-aligned text action buttons.
4. **Bottom Sheets**: Used universally for context menus, emoji pickers, and sharing. Pull-bar indicator at the top center.

## Fluid Animation System 
Animations must operate at 60fps (or 120fps on pro-motion devices), utilizing native driver execution to prevent JS-thread blocking.
- **Page Transitions**: Standard Material Shared-Axis transitions (e.g., X-axis slide + fade when moving deep into a navigation stack).
- **Ripple Effects**: Every interactive surface explicitly defines an organic ink-ripple feedback response centered on the user's touch coordinate.
- **Micro-interactions**: 
  - **Like Button**: Heart scales down to 0, then pops to 1.3 scale colored primary, settling at 1.0.
  - **Message Sent**: Bubble slides up from the input bar and snaps into the list.
  - **Typing Indicator**: 3 dots bouncing sequentially on a sine wave.

## Performance Optimization Strategies
- **Lazy Loading**: Images rely on `blurhash` strings sent down by the API to render an immediate colored placeholder while the actual bytes load over the network.
- **Virtualization**: Deep chat histories are recycled and flattened. 
- **Memoization**: Excessive re-renders are prevented strictly through `React.memo`, `useMemo`, and `useCallback` on all list items and heavy components.

## Error Handling & Reliability
1. **Network Drops**: 
   - A subtle horizontal banner drops from below the top app bar: "Waiting for network..." (Background: Error Container).
   - Chat sends are queued locally via SQLite/AsyncStorage and marked with a clock icon. They sync automatically when WebSockets reconnect.
2. **UI Error Boundaries**:
   - If a specific component crashes (e.g., a Mini-App WebView sandbox violation), the rest of the application survives. The broken surface displays an MD3 fallback UI: "Something went wrong here" with a "Retry" localized action.
3. **Loading States**:
   - Full-screen loaders are banned.
   - Skeletons (shimmering grey surfaces mimicking the final layout shapes) are utilized universally for perceived speed.
