import { useState, useEffect } from 'react';

/**
 * Custom hook to determine Material Design 3 breakpoint classes.
 */
export const useResponsive = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        isCompact: windowWidth < 600,         // Phones
        isMedium: windowWidth >= 600 && windowWidth < 840, // Tablets
        isExpanded: windowWidth >= 840        // Desktop/Foldables
    };
};
