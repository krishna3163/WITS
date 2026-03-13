import React, { useState, useEffect } from 'react';
import { Smartphone, RefreshCcw, UserPlus, Music, Zap, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

export default function ShakeFeature() {
    const navigate = useNavigate();
    const [isShaking, setIsShaking] = useState(false);
    const [foundUser, setFoundUser] = useState<any>(null);
    const [shakeCount, setShakeCount] = useState(0);

    const simulateShake = () => {
        setIsShaking(true);
        setFoundUser(null);

        // Play mock sound or haptic feedback if possible
        if (window.navigator.vibrate) window.navigator.vibrate(200);

        setTimeout(() => {
            setIsShaking(false);
            setShakeCount(prev => prev + 1);
            setFoundUser({
                name: ['Alex Rivera', 'Sarah Chen', 'Marco Rossi', 'Yuki Tanaka'][Math.floor(Math.random() * 4)],
                distance: (Math.random() * 5).toFixed(1) + ' km',
                time: 'Just now'
            });
        }, 1500);
    };

    // Real device orientation/motion logic would go here
    useEffect(() => {
        // Limited browser support for auto-listening without permission
        // So we keep a button as well
    }, []);

    return (
        <div className="fixed inset-0 bg-[#0A0A0A] z-[100] flex flex-col items-center overflow-hidden">
            {/* Dark Header */}
            <div className="w-full h-16 flex items-center px-4 shrink-0">
                <button onClick={() => navigate(-1)} className="p-2 text-white/50 hover:text-white">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="flex-1 text-center text-white font-black uppercase tracking-[0.3em] text-[10px]">Shake</h1>
                <div className="w-10" />
            </div>

            {/* Shake Animation Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative w-full">
                {/* Background Glows */}
                <div className={classNames(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-light/20 rounded-full blur-[100px] transition-opacity duration-1000",
                    isShaking ? "opacity-100 scale-150" : "opacity-40 scale-100"
                )} />

                <div
                    onClick={simulateShake}
                    className={classNames(
                        "relative w-40 h-40 flex items-center justify-center transition-all duration-300",
                        isShaking ? "animate-bounce scale-110" : "hover:scale-105 cursor-pointer"
                    )}
                >
                    <div className="absolute inset-0 bg-white/5 rounded-[48px] border border-white/10" />
                    <Smartphone
                        size={64}
                        className={classNames(
                            "text-primary-light transition-transform duration-75",
                            isShaking ? "rotate-12 scale-110" : "rotate-0"
                        )}
                    />

                    {/* Ripple Effects */}
                    {isShaking && (
                        <>
                            <div className="absolute inset-0 border-2 border-primary-light/50 rounded-[48px] animate-ping" />
                            <div className="absolute inset-0 border border-primary-light/30 rounded-[48px] animate-pulse delay-75" />
                        </>
                    )}
                </div>

                <div className="mt-12 text-center">
                    <h2 className="text-white font-black text-xl mb-2">
                        {isShaking ? "Searching..." : "Shake your phone"}
                    </h2>
                    <p className="text-white/40 text-xs font-medium uppercase tracking-widest">
                        To find people shaking at the same time
                    </p>
                </div>
            </div>

            {/* Result Panel */}
            <div className={classNames(
                "absolute bottom-0 w-full bg-white dark:bg-[#1A1C1E] rounded-t-[40px] p-8 shadow-2xl transition-all duration-700 ease-out z-20",
                foundUser ? "translate-y-0" : "translate-y-full"
            )}>
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-8" />

                {foundUser && (
                    <div className="flex items-center gap-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
                        <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-primary-light to-blue-500 flex items-center justify-center text-white text-3xl font-black shadow-xl">
                            {foundUser.name[0]}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-black dark:text-white mb-1">{foundUser.name}</h3>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-primary-light uppercase tracking-widest">{foundUser.distance} away</span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{foundUser.time}</span>
                            </div>
                        </div>
                        <button className="w-14 h-14 rounded-2xl bg-primary-light text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                            <UserPlus size={24} />
                        </button>
                    </div>
                )}

                <div className="mt-10 grid grid-cols-2 gap-4">
                    <button onClick={simulateShake} className="flex items-center justify-center gap-2 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl font-black uppercase text-[10px] tracking-widest dark:text-white">
                        <RefreshCcw size={16} /> Shake Again
                    </button>
                    <button className="flex items-center justify-center gap-2 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl font-black uppercase text-[10px] tracking-widest dark:text-white">
                        <Music size={16} /> Shake Music
                    </button>
                </div>
            </div>

            {/* Bottom Bar Icons */}
            <div className="w-full flex justify-around p-8 shrink-0 relative z-10 border-t border-white/5">
                {[
                    { icon: Smartphone, label: 'People' },
                    { icon: Music, label: 'Music' },
                    { icon: RefreshCcw, label: 'TV' }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 cursor-pointer transition-all">
                        <item.icon size={22} className="text-white" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
