import React from 'react';

interface ToggleProps {
    checked: boolean;
    onChange: (val: boolean) => void;
    disabled?: boolean;
    size?: 'sm' | 'md';
}

export const SettingsToggle: React.FC<ToggleProps> = ({ checked, onChange, disabled, size = 'md' }) => {
    const h = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11';
    const dot = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    const translate = size === 'sm' ? 'translate-x-4' : 'translate-x-5';

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent ${h} ${checked
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30'
                    : 'bg-gray-600/50'
                } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <span
                className={`inline-block ${dot} rounded-full bg-white shadow-md transform transition-transform duration-300 ${checked ? translate : 'translate-x-0.5'
                    }`}
            />
        </button>
    );
};

interface SettingsRowProps {
    icon?: React.ReactNode;
    label: string;
    description?: string;
    checked?: boolean;
    onToggle?: (val: boolean) => void;
    children?: React.ReactNode;
    onClick?: () => void;
    badge?: string;
    disabled?: boolean;
    danger?: boolean;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
    icon, label, description, checked, onToggle, children, onClick, badge, disabled, danger
}) => (
    <div
        className={`flex items-center justify-between px-4 py-3.5 group transition-colors duration-150 ${onClick || onToggle ? 'cursor-pointer hover:bg-white/5' : ''
            } ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
        onClick={onToggle ? () => onToggle(!checked) : onClick}
    >
        <div className="flex items-center gap-3 flex-1 min-w-0">
            {icon && (
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${danger ? 'bg-red-500/15 text-red-400' : 'bg-indigo-500/15 text-indigo-400'
                    }`}>
                    {icon}
                </div>
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium leading-tight truncate ${danger ? 'text-red-400' : 'text-white'}`}>
                        {label}
                    </p>
                    {badge && (
                        <span className="text-[9px] font-black uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-full tracking-wider">
                            {badge}
                        </span>
                    )}
                </div>
                {description && (
                    <p className="text-xs text-white/40 mt-0.5 leading-relaxed line-clamp-2">{description}</p>
                )}
            </div>
        </div>
        <div className="flex-shrink-0 ml-3">
            {typeof checked !== 'undefined' && onToggle ? (
                <SettingsToggle checked={checked} onChange={onToggle} />
            ) : children ? (
                children
            ) : onClick ? (
                <svg className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            ) : null}
        </div>
    </div>
);

interface SettingsSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children, className }) => (
    <div className={`mb-6 ${className || ''}`}>
        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-400/70 px-4 pb-2">
            {title}
        </h3>
        <div className="bg-white/5 backdrop-blur-sm border border-white/8 rounded-2xl overflow-hidden divide-y divide-white/5">
            {children}
        </div>
    </div>
);

interface SliderRowProps {
    icon?: React.ReactNode;
    label: string;
    description?: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (val: number) => void;
    format?: (val: number) => string;
}

export const SliderRow: React.FC<SliderRowProps> = ({
    icon, label, description, value, min, max, step = 0.1, onChange, format
}) => (
    <div className="px-4 py-3.5">
        <div className="flex items-center gap-3 mb-2">
            {icon && (
                <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-500/15 text-indigo-400">
                    {icon}
                </div>
            )}
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-white">{label}</p>
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg">
                        {format ? format(value) : value}
                    </span>
                </div>
                {description && <p className="text-xs text-white/40 mt-0.5">{description}</p>}
            </div>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[10px] text-white/20 mt-1 px-0.5">
            <span>{format ? format(min) : min}</span>
            <span>{format ? format(max) : max}</span>
        </div>
    </div>
);
