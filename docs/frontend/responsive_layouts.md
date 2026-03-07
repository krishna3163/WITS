# Responsive Layouts & Navigation System

## Breakpoints & Device States
The UI auto-adapts universally. 

| Device Class       | Breakpoint (dp) | Navigation UI                  | Master/Detail Behavior       |
|--------------------|-----------------|--------------------------------|------------------------------|
| **Phones**         | < 600           | Bottom Navigation Bar          | Stack (Push/Pop screens)     |
| **Tablets**        | 600 - 839       | Side Navigation Rail           | Split (List on Left)         |
| **Large/Foldable** | >= 840          | Standard Side Navigation Drawer | Split (List + Expanded View) |

## Navigation System Design
### 1. Phones (Compact)
- Uses a **Bottom Navigation Bar** with 4-5 core tabs.
- Tabs: Chat | Contacts | Discover (Moments) | Wallet | Me
- **FAB**: Floating Action button shifts to the bottom right for contextual primary actions (e.g., "New Chat").

### 2. Tablets (Medium)
- Replaces Bottom Navigation with a **Navigation Rail** anchored to the left edge of the screen.
- Rail contains Icons + compact labels.
- Layout splits: 35% width for Chat List, 65% width for Chat Conversation. 
- Prevents awkward stretching of text messages.

### 3. Foldables / Desktop (Expanded)
- Replaces Navigation Rail with a **Persistent Navigation Drawer**.
- Sidebar displays full names, nested menus, and profile summary.
- Multi-column feeds: Moments display in a masonry or 2-column grid instead of a single stacked feed to utilize horizontal real estate.

## Global Routing
Routing configuration utilizes declarative nested navigators.
- **Root Stack**: Contains `{ AuthNavigator, AppNavigator, MiniAppModal }`
- **App Navigator (Responsive)**: Checks width. Returns `BottomTabs` if mobile, `Row(NavRail, MainContent)` if tablet.
- **Mini-App Bridge Modal**: Opens as a full-screen or expanded bottom-sheet overlay using an embedded sandboxed WebView component, trapping focus and rendering a custom top-bar with a "Close App" and "Menu" button.
