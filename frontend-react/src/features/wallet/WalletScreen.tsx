import React, { useState } from 'react';
import { Eye, EyeOff, QrCode, ArrowUpRight, ArrowDownLeft, ScanLine, History, Plus, ChevronRight } from 'lucide-react';
import classNames from 'classnames';

const TRANSACTIONS = [
    { id: 1, title: 'Coffee Shop', date: 'Today, 8:45 AM', amount: -4.50, type: 'merchant' },
    { id: 2, title: 'Salary Transfer', date: 'Yesterday', amount: +4500.00, type: 'receive' },
    { id: 3, title: 'Alice (Dinner split)', date: 'Oct 24', amount: -35.20, type: 'send' },
    { id: 4, title: 'App Store Purchase', date: 'Oct 22', amount: -1.99, type: 'merchant' },
    { id: 5, title: 'Red Packet 🧧', date: 'Oct 15', amount: +50.00, type: 'receive' },
];

const WalletScreen = () => {
    const [showBalance, setShowBalance] = useState(true);
    const balance = "$ 4,510.30";

    return (
        <div className="h-full w-full bg-[#f4f6f8] dark:bg-[#0A0A0A] overflow-y-auto pb-24 relative">

            {/* Background Gradient */}
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary-light to-[#f4f6f8] dark:from-primary-container-dark dark:to-[#0A0A0A] z-0 opacity-80" />

            {/* Main Container */}
            <div className="relative z-10 px-6 pt-12 animate-in slide-in-from-bottom-4 duration-500 fade-in">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-[32px] font-bold text-gray-900 dark:text-white tracking-tight">Wallet</h1>
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
                        <History size={20} className="text-gray-800 dark:text-gray-200" />
                    </button>
                </div>

                {/* Hero Card containing Balance */}
                <div className="w-full bg-white dark:bg-[#1A1C1E] rounded-[32px] p-6 shadow-xl border border-white/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary-light/10 dark:bg-primary-dark/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>

                    <div className="flex justify-between items-start mb-6">
                        <span className="text-gray-500 dark:text-gray-400 font-medium tracking-wide text-sm">TOTAL BALANCE</span>
                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        >
                            {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>

                    <h2 className="text-[44px] font-bold text-gray-900 dark:text-white tracking-tighter mb-8 font-mono">
                        {showBalance ? balance : '••••••••'}
                    </h2>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { label: 'Pay', icon: ArrowUpRight, color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' },
                            { label: 'Request', icon: ArrowDownLeft, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
                            { label: 'Top Up', icon: Plus, color: 'bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' },
                            { label: 'Scan', icon: ScanLine, color: 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' },
                        ].map((action, i) => (
                            <button key={i} className="flex flex-col items-center gap-2 group/btn cursor-pointer">
                                <div className={classNames(
                                    "w-14 h-14 rounded-full flex items-center justify-center shadow-sm border border-black/5 transition-transform duration-200 group-active/btn:scale-90 group-hover/btn:shadow-md",
                                    action.color
                                )}>
                                    <action.icon size={22} strokeWidth={2.5} />
                                </div>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Payment QR Code Box */}
                <div className="mt-8 bg-black dark:bg-[#1A1C1E] rounded-[24px] p-5 flex items-center justify-between shadow-lg cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <QrCode size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-lg">My Payment Code</h3>
                            <p className="text-gray-400 text-sm">Show to merchant to pay</p>
                        </div>
                    </div>
                    <ChevronRight className="text-gray-500" />
                </div>

                {/* Transactions List */}
                <div className="mt-8 bg-white dark:bg-[#1A1C1E] rounded-t-[32px] shadow-sm -mx-6 px-6 pt-8 pb-32 h-[50vh]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>

                    <div className="flex flex-col gap-5">
                        {TRANSACTIONS.map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/20 p-2 -mx-2 rounded-xl transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={classNames(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105",
                                        tx.type === 'receive' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20'
                                            : tx.type === 'send' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20'
                                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                                    )}>
                                        {tx.type === 'receive' ? <ArrowDownLeft size={20} className="dark:text-emerald-400" /> : tx.type === 'send' ? <ArrowUpRight size={20} className="dark:text-rose-400" /> : <ScanLine size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white dark:font-medium">{tx.title}</h4>
                                        <span className="text-xs text-gray-500">{tx.date}</span>
                                    </div>
                                </div>
                                <span className={classNames(
                                    "font-bold font-mono tracking-tight",
                                    tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white '
                                )}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletScreen;
