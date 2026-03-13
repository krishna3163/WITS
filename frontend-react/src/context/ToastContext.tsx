import React, { createContext, useCallback, useContext, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextValue {
    toasts: ToastItem[];
    addToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;
function nextId() {
    return `toast-${++toastId}-${Date.now()}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((type: ToastType, message: string, duration = 4000) => {
        const id = nextId();
        setToasts((prev) => [...prev, { id, type, message, duration }]);
        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastStack />
        </ToastContext.Provider>
    );
}

function ToastStack() {
    const { toasts, removeToast } = useContext(ToastContext)!;
    if (toasts.length === 0) return null;
    return (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[100] flex flex-col gap-2 pointer-events-none">
            <div className="flex flex-col gap-2 pointer-events-auto">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role="alert"
                        className={`rounded-2xl border shadow-lg px-4 py-3 text-sm font-medium flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4 fade-in duration-200 ${
                            t.type === 'success'
                                ? 'bg-green-500/95 text-white border-green-400/50'
                                : t.type === 'error'
                                    ? 'bg-red-500/95 text-white border-red-400/50'
                                    : t.type === 'warning'
                                        ? 'bg-amber-500/95 text-white border-amber-400/50'
                                        : 'bg-gray-800 text-white border-gray-600'
                        }`}
                    >
                        <span className="flex-1">{t.message}</span>
                        <button
                            type="button"
                            onClick={() => removeToast(t.id)}
                            className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
                            aria-label="Dismiss"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
