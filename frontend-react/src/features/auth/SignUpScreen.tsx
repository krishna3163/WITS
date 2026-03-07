import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Smartphone, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { insforge } from '../../lib/insforge';
import { useAuthStore } from '../../store/authStore';

const SignUpScreen = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const { checkSession } = useAuthStore();

    // Auth States
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (step === 1) {
            setStep(2);
        } else {
            if (password !== confirmPassword) {
                setErrorMsg("Passwords do not match");
                return;
            }

            setLoading(true);

            // Register with InsForge Backend
            const { data, error } = await insforge.auth.signUp({
                email: email,
                password: password,
                name: name,
            });

            if (error) {
                setLoading(false);
                setErrorMsg(error.message || 'Failed to create account');
                return;
            }

            if (data?.requireEmailVerification) {
                setLoading(false);
                alert("Please check your email to verify your account!");
                navigate('/auth/login');
            } else if (data?.accessToken) {
                // If verification is disabled, log them right in
                await checkSession();
                setLoading(false);
                navigate('/chats');
            } else {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex flex-col justify-center px-8 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-light/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>

            <div className="z-10 w-full max-w-md mx-auto">
                <button
                    onClick={() => step === 2 ? setStep(1) : navigate(-1)}
                    className="mb-8 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                        {step === 1 ? 'Create Account' : 'Almost There'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {step === 1 ? 'Start your journey with SuperApp today.' : 'Secure your account with a password.'}
                    </p>
                </div>

                <form onSubmit={handleNext} className="flex flex-col gap-5 animate-in slide-in-from-right-4 fade-in duration-300">

                    {/* Error Display */}
                    {errorMsg && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-3 rounded-2xl text-sm flex items-center gap-2">
                            <AlertCircle size={18} /> {errorMsg}
                        </div>
                    )}

                    {step === 1 && (
                        <>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={20} className="text-gray-400 group-focus-within:text-primary-light transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-surface-variant-light/50 dark:bg-surface-variant-dark bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-light/50 transition-all font-medium"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Smartphone size={20} className="text-gray-400 group-focus-within:text-primary-light transition-colors" />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number (Optional)"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full bg-surface-variant-light/50 dark:bg-surface-variant-dark bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-light/50 transition-all font-medium"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={20} className="text-gray-400 group-focus-within:text-primary-light transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-surface-variant-light/50 dark:bg-surface-variant-dark bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-light/50 transition-all font-medium"
                                />
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-gray-400 group-focus-within:text-primary-light transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Create Password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-surface-variant-light/50 dark:bg-surface-variant-dark bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-light/50 transition-all font-medium"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-gray-400 group-focus-within:text-primary-light transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    required
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="w-full bg-surface-variant-light/50 dark:bg-surface-variant-dark bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-light/50 transition-all font-medium"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-light dark:bg-primary-dark text-white rounded-2xl py-4 font-semibold text-lg flex items-center justify-center gap-2 mt-4 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (step === 1 ? 'Continue' : 'Create Account')} {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default SignUpScreen;
