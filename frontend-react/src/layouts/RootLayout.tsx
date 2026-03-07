import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useResponsive } from '../hooks/useResponsive';
import BottomNav from '../components/navigation/BottomNav';
import NavRail from '../components/navigation/NavRail';

const RootLayout = () => {
    const { isCompact } = useResponsive();
    const location = useLocation();

    // Hide bottom nav on specific immersive screens (e.g. active chat conversation)
    const hideNav = location.pathname.includes('/chat/') && isCompact;

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-surface-light dark:bg-surface-dark transition-colors duration-200">

            {/* Tablet/Desktop Navigation Rail */}
            {!isCompact && <NavRail />}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative h-full">
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            {isCompact && !hideNav && <BottomNav />}

        </div>
    );
};

export default RootLayout;
