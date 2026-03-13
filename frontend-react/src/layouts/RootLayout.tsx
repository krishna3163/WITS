import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useResponsive } from '../hooks/useResponsive';
import BottomNav from '../components/navigation/BottomNav';
import NavRail from '../components/navigation/NavRail';
import MiniAppContainer from '../components/miniapps/MiniAppContainer';
import GlobalHeader from '../components/navigation/GlobalHeader';

const RootLayout = () => {
    const { isCompact } = useResponsive();
    const location = useLocation();

    // Hide bottom nav on specific immersive screens (e.g. active chat conversation)
    const hideNav = (location.pathname.includes('/chat/') && isCompact) || location.pathname.includes('/auth/');

    // Some pages might want to hide the global header
    const hideHeader = location.pathname.includes('/chat/');

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-surface-light dark:bg-surface-dark transition-colors duration-200">

            {/* Tablet/Desktop Navigation Rail */}
            {!isCompact && <NavRail />}

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Global Header */}
                {!hideHeader && <GlobalHeader />}

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
