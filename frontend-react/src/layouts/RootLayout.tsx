import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useResponsive } from '../hooks/useResponsive';
import BottomNav from '../components/navigation/BottomNav';
import NavRail from '../components/navigation/NavRail';
import SideNav from '../components/navigation/SideNav';
import MiniAppContainer from '../components/miniapps/MiniAppContainer';
import GlobalHeader from '../components/navigation/GlobalHeader';

const RootLayout = () => {
    const { isCompact, isMedium, isExpanded } = useResponsive();
    const location = useLocation();

    // Hide bottom nav on specific immersive screens (e.g. active chat conversation)
    const hideNav = (location.pathname.includes('/chat/') && isCompact) || location.pathname.includes('/auth/');

    // Show the global header ONLY on compact (mobile) screens, and not even then on certain pages.
    const showHeader = isCompact && !location.pathname.includes('/chat/');

    const renderNav = () => {
      if (isExpanded) return <SideNav />;
      if (isMedium) return <NavRail />;
      return null; // Compact view uses BottomNav rendered below
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-surface-light dark:bg-surface-dark transition-colors duration-200">

            {/* Render NavRail for tablet and SideNav for desktop */}
            {renderNav()}

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Global Header is now only for mobile */}
                {showHeader && <GlobalHeader />}

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto relative h-full">
                    <Outlet />
                </main>

                {/* Mobile Bottom Navigation */}
                {isCompact && !hideNav && <BottomNav />}
            </div>

            {/* Global MiniApp Tabbed Shell */}
            <MiniAppContainer />
        </div>
    );
};

export default RootLayout;
