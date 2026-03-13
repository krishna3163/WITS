
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react'; // Using a placeholder icon

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); // Total animation time + delay

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, transition: { delay: 3.5, duration: 0.5 } }}
      className="fixed inset-0 bg-black flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.2, 1], opacity: 1, rotate: [0, 10, -10, 0] }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 10,
          duration: 1.5,
          times: [0, 0.4, 0.8, 1],
        }}
      >
        <ShieldCheck size={128} className="text-primary" />
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
