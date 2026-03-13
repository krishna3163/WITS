import React from 'react';
import { Shield, Camera, Mic, MapPin, Bell, Smartphone, X } from 'lucide-react';
import classNames from 'classnames';

interface PermissionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onGrant: () => void;
}

export default function PermissionDialog({ isOpen, onClose, onGrant }: PermissionDialogProps) {
    if (!isOpen) return null;

    const items = [
        { icon: Camera, label: 'Camera', desc: 'Required for QR Scanning and Profile Photos.' },
        { icon: Mic, label: 'Microphone', desc: 'Needed for Voice Messages and AI Voice Search.' },
        { icon: MapPin, label: 'Location', desc: 'Provides local services and travel apps relevance.' },
        { icon: Bell, label: 'Notifications', desc: 'Stay updated with messages and alerts.' },
        { icon: Smartphone, label: 'Phone State', desc: 'Ensures secure device binding and compatibility.' },
    ];

    return (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#1A1C1E] w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl relative animate-in slide-in-from-bottom-10 duration-500">

                <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 bg-primary-light/10 rounded-2xl flex items-center justify-center text-primary-light mb-4">
                        <Shield size={32} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-black dark:text-white">Full System Access</h2>
                    <p className="text-gray-500 text-sm font-medium mt-1">To provide a true Super App experience, WITS requires several permissions.</p>
                </div>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar pr-2 mb-8">
                    {items.map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-gray-800">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-primary-light shrink-0">
                                <item.icon size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.label}</h4>
                                <p className="text-[11px] text-gray-500 font-medium">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onGrant}
                        className="w-full py-4 bg-primary-light text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-light/30 active:scale-[0.98] transition-all"
                    >
                        Allow All Permissions
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-4 text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        Maybe Later
                    </button>
                </div>

                <p className="text-[9px] text-gray-400 text-center mt-6 uppercase tracking-widest font-medium">
                    You can manage these anytime in System Settings.
                </p>
            </div>
        </div>
    );
}
