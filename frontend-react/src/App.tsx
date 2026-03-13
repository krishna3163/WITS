import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import SplashScreen from './components/common/SplashScreen';
import { SettingsThemeApply } from './components/SettingsThemeApply';
import { motion } from 'framer-motion';

const App = () => {
    const [isLoading, setIsLoading] = useState(true);

    const handleLoadingComplete = () => {
        setIsLoading(false);
    };

    return (
        <React.Fragment>
            <SettingsThemeApply />
            <Router>
                {isLoading ? (
                    <SplashScreen onComplete={handleLoadingComplete} />
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="h-full"
                    >
                        <AppRoutes />
                    </motion.div>
                )}
            </Router>
        </React.Fragment>
    );
};

export default App;
