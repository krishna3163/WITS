import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

const WelcomeScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex flex-col justify-between p-8 relative overflow-hidden">

            {/* Dynamic Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-light/20 via-purple-500/10 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-teal-500/10 to-transparent rounded-full blur-3xl translate-y-1/4 -translate-x-1/4"></div>

            <div className="z-10 mt-16 animate-in slide-in-from-bottom-8 duration-700 fade-in">
                <div className="w-20 h-20 bg-primary-light dark:bg-primary-dark rounded-[28px] flex items-center justify-center mb-8 shadow-xl shadow-primary-light/20">
                    <span className="text-white font-bold text-4xl">W</span>
                </div>
                <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4">
                    Connect your<br />world, simply.
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-sm mb-12">
                    Messaging, payments, and micro-apps all in one unified ecosystem.
                </p>

                <div className="space-y-6">
                    {[
                        { icon: ShieldCheck, title: 'End-to-End Encryption', desc: 'Your data is secured with enterprise-grade crypto.' },
                        { icon: Globe, title: 'Global Discover', desc: 'Browse feeds, channels, and mini-applications.' },
                        { icon: Zap, title: 'Instant Payments', desc: 'Send and receive money seamlessly.' }
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm p-4 rounded-3xl border border-gray-100 dark:border-gray-800">
                            <div className="w-12 h-12 rounded-2xl bg-primary-container-light dark:bg-primary-container-dark text-primary-light dark:text-primary-dark flex items-center justify-center">
                                <feature.icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-md">{feature.title}</h3>
                                <p className="text-xs text-gray-500">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="z-10 mt-12 w-full animate-in slide-in-from-bottom-4 duration-700 fade-in delay-200">
                <button
                    onClick={() => navigate('/auth/signup')}
                    className="w-full bg-primary-light dark:bg-primary-dark text-white rounded-3xl py-4 font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary-light/30 transition-all duration-200 mb-4"
                >
                    Get Started <ArrowRight size={20} />
                </button>
                <button
                    onClick={() => navigate('/auth/login')}
                    className="w-full bg-white dark:bg-[#1A1C1E] text-gray-900 dark:text-white rounded-3xl py-4 font-bold text-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    Log In to Account
                </button>
            </div>

        </div>
    );
};

export default WelcomeScreen;
