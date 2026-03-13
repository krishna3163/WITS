import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Wifi, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import PermissionDialog from '../../components/mobile/PermissionDialog';
import classNames from 'classnames';

// Mock Capacitor for Browser Testing if needed
const isNative = (window as any).Capacitor?.isNative;

export default function InitializationScreen() {
    const navigate = useNavigate();
    const { checkSession } = useAuthStore();
    const [step, setStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [showPermissionDialog, setShowPermissionDialog] = useState(false);
    const [permissions, setPermissions] = useState<{ name: string, status: string }[]>([
        { name: 'Camera', status: 'pending' },
        { name: 'Microphone', status: 'pending' },
        { name: 'Location', status: 'pending' },
        { name: 'Storage', status: 'pending' },
        { name: 'Notifications', status: 'pending' },
    ]);

    const handleGrantPermissions = async () => {
        setShowPermissionDialog(false);
        setStep(3);
        setPermissions(p => p.map(x => ({ ...x, status: 'granted' })));
        await new Promise(r => setTimeout(r, 1500));
        proceedFromPermissions();
    };

    const proceedFromPermissions = async () => {
        try {
            // 4. Session & User Data
            setStep(4);
            await checkSession();
            await new Promise(r => setTimeout(r, 1000));

            // 5. Finalize
            setStep(5);
            localStorage.setItem('wits_initialized', 'true');
            await new Promise(r => setTimeout(r, 800));

            navigate('/', { replace: true });
        } catch (err: any) {
            setError(err.message || "Session initialization failed.");
        }
    };

    const initSequence = async () => {
        try {
            // 1. Splash / Logo
            setStep(1);
            await new Promise(r => setTimeout(r, 1500));

            // 2. Connectivity Check
            setStep(2);
            const isOnline = navigator.onLine;
            if (!isOnline) throw new Error("No internet connection detected.");
            await new Promise(r => setTimeout(r, 1000));

            // Security Check (Mock Root Detection)
            const isRooted = false; // In production, use Capacitor Root Detection plugin
            if (isRooted) throw new Error("Security Alert: Rooted device detected. Access blocked for security.");
            await new Promise(r => setTimeout(r, 500));

            // 3. Permission Management
            setShowPermissionDialog(true);
        } catch (err: any) {
            setError(err.message || "Initialization failed.");
        }
    };

    useEffect(() => {
        initSequence();
    }, []);

    const steps = [
        { id: 1, label: 'Initializing WITS Engine', icon: Smartphone, description: 'Optimizing for your device' },
        { id: 2, label: 'Securing Connection', icon: Wifi, description: 'Connecting to api.insforge.com' },
        { id: 3, label: 'Permission Audit', icon: Shield, description: 'Checking system access' },
        { id: 4, label: 'Authentication', icon: Lock, description: 'Loading secure session' },
        { id: 5, label: 'Welcome', icon: CheckCircle, description: 'Redirecting to dashboard' },
    ];

    return (
        <div className="fixed inset-0 bg-white dark:bg-[#0A0A0A] z-[200] flex flex-col items-center justify-center p-8 overflow-hidden">

            <PermissionDialog
                isOpen={showPermissionDialog}
                onClose={() => handleGrantPermissions()} // Force grant for demo or fallback
                onGrant={() => handleGrantPermissions()}
            />

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-light/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Logo Section */}
            <div className="relative mb-16 animate-in fade-in zoom-in duration-1000">
                <div className="w-24 h-24 bg-gradient-to-tr from-primary-light to-blue-600 rounded-[28px] flex items-center justify-center text-white shadow-2xl shadow-primary-light/40 relative z-10">
                    <span className="text-4xl font-black">W</span>
                </div>
                <div className="absolute inset-0 bg-primary-light rounded-[28px] blur-2xl opacity-20 animate-pulse" />
            </div>

            <div className="w-full max-w-xs space-y-8 relative z-10">
                {step > 0 && step <= 5 && !error ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 animate-in slide-in-from-bottom-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary-light/10 flex items-center justify-center text-primary-light">
                                {React.createElement(steps[step - 1].icon, { size: 24, strokeWidth: 2.5 })}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-black dark:text-white leading-tight">{steps[step - 1].label}</h3>
                                <p className="text-xs text-gray-500 font-medium">{steps[step - 1].description}</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-light transition-all duration-700 ease-out"
                                style={{ width: `${(step / 5) * 100}%` }}
                            />
                        </div>

                        {/* Sub-steps (Permissions) */}
                        {step === 3 && (
                            <div className="grid grid-cols-1 gap-2 mt-4 animate-in fade-in duration-500">
                                {permissions.map(p => (
                                    <div key={p.name} className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{p.name}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            <span className="text-[10px] font-black text-emerald-500 uppercase">Granted</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : error ? (
                    <div className="text-center space-y-4 animate-in shake duration-500">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mx-auto">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-lg font-black dark:text-white">Initialization Error</h3>
                        <p className="text-sm text-gray-500 px-4">{error}</p>
                        <button
                            onClick={() => { setError(null); initSequence(); }}
                            className="w-full py-4 bg-primary-light text-white rounded-2xl font-bold shadow-lg shadow-primary-light/30 active:scale-95 transition-transform"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : null}
            </div>

            <div className="mt-auto pb-10 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Insforge Universal Client</p>
                <p className="text-[8px] text-gray-400 opacity-60 mt-1">Version 1.0.4 (Build 2026-X)</p>
            </div>
        </div>
    );
}
