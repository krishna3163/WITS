import React, { useState, useEffect, useCallback } from 'react';

const SHAKE_THRESHOLD = 15; // Tweak this value to your liking

export const useShake = (onShake: () => void) => {
  const [lastX, setLastX] = useState<number | null>(null);
  const [lastY, setLastY] = useState<number | null>(null);
  const [lastZ, setLastZ] = useState<number | null>(null);
  const [lastShakeTime, setLastShakeTime] = useState(Date.now());

  const handleDeviceMotion = useCallback((event: DeviceMotionEvent) => {
    const { accelerationIncludingGravity } = event;
    const now = Date.now();

    if (accelerationIncludingGravity && (now - lastShakeTime) > 1000) {
        const { x, y, z } = accelerationIncludingGravity;
        
        if (lastX !== null && lastY !== null && lastZ !== null && x !== null && y !== null && z !== null) {
            const deltaX = Math.abs(x - lastX);
            const deltaY = Math.abs(y - lastY);
            const deltaZ = Math.abs(z - lastZ);

            if (deltaX + deltaY + deltaZ > SHAKE_THRESHOLD) {
                setLastShakeTime(now);
                onShake();
            }
        }

        setLastX(x);
        setLastY(y);
        setLastZ(z);
    }
  }, [lastX, lastY, lastZ, lastShakeTime, onShake]);

  useEffect(() => {
    // Request permission for iOS 13.3+ devices
    const requestPermission = () => {
        const typedDeviceMotionEvent = DeviceMotionEvent as any;
        if (typeof typedDeviceMotionEvent.requestPermission === 'function') {
            typedDeviceMotionEvent.requestPermission()
                .then((permissionState: string) => {
                    if (permissionState === 'granted') {
                        window.addEventListener('devicemotion', handleDeviceMotion);
                    } else {
                        console.warn('Permission for DeviceMotionEvent not granted.');
                    }
                })
                .catch(console.error);
        } else {
            // Handle non-iOS 13.3+ devices
            window.addEventListener('devicemotion', handleDeviceMotion);
        }
    };

    requestPermission();

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [handleDeviceMotion]);
};
