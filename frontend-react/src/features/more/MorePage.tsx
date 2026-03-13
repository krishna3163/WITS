import React from 'react';
import {
    User, Settings, Shield, LogOut,
    QrCode, FileText, FolderOpen, Cloud,
    Calendar, CheckSquare, ListTodo, Clipboard,
    Mic, Wallet, History, CreditCard, Send,
    Banknote, MessageSquare, Phone, Video,
    Users, MapPin, Code, Cpu, Hammer,
    Settings2, Layout, Sliders, Palette,
    LayoutGrid, Star, Trash2, Edit3, MessageCircle, BarChart3, Terminal, Rocket
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import classNames from 'classnames';

interface MoreItemProps {
    icon: any;
    label: string;
    description: string;
    onClick?: () => void;
    color: string;
}

const MoreItem = ({ icon: Icon, label, description, onClick, color }: MoreItemProps) => (
    <div
        onClick={onClick}
        className="flex items-center gap-4 p-4 bg-white dark:bg-[#1A1C1E] rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
    >
        <div className={classNames(
            "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20 group-hover:rotate-6 transition-transform",
            color
        )}>
            <Icon size={24} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{label}</h4>
            <p className="text-[11px] text-gray-500 truncate">{description}</p>
        </div>
    </div>
);

const SectionHeader = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-8 first:mt-0 transition-all">
        <Icon size={18} className="text-gray-400" />
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{label}</h3>
    </div>
);

const MorePage = () => {
    const { user, logout } = useAuthStore();
    const { settings, updateSettings } = useSettingsStore();

    return (
        <div className="h-full w-full bg-gray-50 dark:bg-[#121212] overflow-y-auto pb-40 no-scrollbar">
            <div className="max-w-4xl mx-auto p-6 space-y-2">

                {/* Profile Banner */}
                <div className="bg-gradient-to-br from-primary-light to-blue-600 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl mb-10 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                        <div className="w-24 h-24 rounded-[32px] bg-white text-primary-light flex items-center justify-center text-4xl font-black shadow-2xl transition-transform group-hover:scale-105">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black">{user?.email?.split('@')[0]}</h2>
                            <p className="text-white/70 font-medium mb-4">{user?.email}</p>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold hover:bg-white/30 transition-all flex items-center gap-2">
                                    <Edit3 size={14} /> Edit Profile
                                </button>
                                <button className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold hover:bg-white/30 transition-all flex items-center gap-2">
                                    <Shield size={14} /> Premium Status
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => logout()}
                            className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:border-transparent transition-all"
                        >
                            <LogOut size={22} />
                        </button>
                    </div>
                </div>

                {/* Accountability */}
                <SectionHeader icon={User} label="Account" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <MoreItem icon={Settings} label="Settings" description="Customize experience" color="bg-slate-500" />
                    <MoreItem icon={Shield} label="Security" description="Password and privacy" color="bg-emerald-500" />
                    <MoreItem icon={Palette} label="Theme" description="Dark and light mode" color="bg-purple-500" />
                </div>

                {/* Super App Tools */}
                <SectionHeader icon={LayoutGrid} label="Super App Tools" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <MoreItem icon={QrCode} label="Scanner" description="Scan QR or documents" color="bg-orange-500" />
                    <MoreItem icon={FolderOpen} label="Files" description="Local file manager" color="bg-amber-500" />
                    <MoreItem icon={Cloud} label="Cloud" description="Backup your data" color="bg-sky-500" />
                    <MoreItem icon={Calendar} label="Calendar" description="Events and reminders" color="bg-teal-500" />
                    <MoreItem icon={ListTodo} label="Tasks" description="Detailed task manager" color="bg-rose-500" />
                </div>

                {/* Productivity */}
                <SectionHeader icon={Rocket} label="Productivity" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <MoreItem icon={Clipboard} label="Quick Notes" description="Fast text capturing" color="bg-yellow-500" />
                    <MoreItem icon={Mic} label="Voices" description="Audio recordings" color="bg-violet-500" />
                    <MoreItem icon={Star} label="Bookmarks" description="Saved mini apps" color="bg-amber-400" />
                </div>

                {/* Finance */}
                <SectionHeader icon={Wallet} label="Finance" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <MoreItem icon={Wallet} label="Wallet" description="Manage balance" color="bg-emerald-600" />
                    <MoreItem icon={History} label="Transactions" description="Payment history" color="bg-indigo-600" />
                    <MoreItem icon={Send} label="Send Money" description="Quick transfers" color="bg-blue-600" />
                </div>

                {/* Social & Communication */}
                <SectionHeader icon={MessageSquare} label="Communication" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <MoreItem icon={MessageCircle} label="Group Chats" description="Rooms and topics" color="bg-green-500" />
                    <MoreItem icon={Users} label="Communities" description="Find your tribe" color="bg-cyan-600" />
                    <MoreItem icon={Video} label="Meetings" description="HD video calling" color="bg-blue-500" />
                </div>

                {/* Developer Suite */}
                <SectionHeader icon={Code} label="Developer tools" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <MoreItem icon={Cpu} label="Mini-App Engine" description="Builder and console" color="bg-gray-800" />
                    <MoreItem icon={BarChart3} label="Analytics" description="Usage and insights" color="bg-indigo-800" />
                    <MoreItem icon={Terminal} label="Debugger" description="App console logs" color="bg-slate-900" />
                </div>

                {/* App Customization (Personalization) */}
                <SectionHeader icon={Settings2} label="Layout & Feel" />
                <div className="flex gap-4 p-4 bg-white dark:bg-[#1A1C1E] rounded-3xl border border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar">
                    {['Classic', 'Grid', 'Modern', 'Compact'].map(style => (
                        <button key={style} className="shrink-0 px-6 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-500 font-bold text-xs hover:bg-primary-light hover:text-white transition-all">
                            {style} Style
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default MorePage;
