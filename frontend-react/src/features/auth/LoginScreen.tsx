import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Smartphone, ArrowRight, AlertCircle } from 'lucide-react';
import { insforge } from '../../lib/insforge';
import { useAuthStore } from '../../store/authStore';

const LoginScreen = () => {
    const navigate = useNavigate();
    const { checkSession } = useAuthStore();
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

    // Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        const { data, error } = await insforge.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setLoading(false);
            setErrorMsg(error.message || 'Failed to login');
            return;
        }

        if (data) {
            // Update the global auth state!
            await checkSession();
            setLoading(false);
            navigate('/chats');
        } else {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex flex-col justify-center px-8 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="z-10 w-full max-w-md mx-auto">
                <div className="mb-12">
                    <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <span className="text-white font-bold text-3xl">W</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-gray-500 dark:text-gray-400">Sign in to continue to SuperApp.</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    {/* Error Display */}
                    {errorMsg && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-3 rounded-2xl text-sm flex items-center gap-2">
                            <AlertCircle size={18} /> {errorMsg}
                        </div>
                    )}

                    {loginMethod === 'phone' ? (
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Smartphone size={20} className="text-gray-400 group-focus-within:text-primary-light transition-colors" />
                            </div>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-surface-variant-light/50 dark:bg-surface-variant-dark bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-light/50 transition-all font-medium"
                            />
                        </div>
                    ) : (
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={20} className="text-gray-400 group-focus-within:text-primary-light transition-colors" />
                            </div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-surface-variant-light/50 dark:bg-surface-variant-dark bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-light/50 transition-all font-medium"
                            />
                        </div>
                    )}

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock size={20} className="text-gray-400 group-focus-within:text-primary-light transition-colors" />
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-surface-variant-light/50 dark:bg-surface-variant-dark bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-light/50 transition-all font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-light dark:bg-primary-dark text-white rounded-2xl py-4 font-semibold text-lg flex items-center justify-center gap-2 mt-4 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'} {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <div className="mt-8 flex flex-col items-center gap-4">
                    <button
                        onClick={() => setLoginMethod(prev => prev === 'phone' ? 'email' : 'phone')}
                        className="text-primary-light dark:text-primary-dark font-medium hover:underline"
                    >
                        Use {loginMethod === 'phone' ? 'Email Address' : 'Phone Number'} instead
                    </button>

                    <p className="text-gray-500">
                        Don't have an account? <button onClick={() => navigate('/auth/signup')} className="text-primary-light font-medium ml-1">Sign Up</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
