import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight, Zap } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Check email and password.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-bg-deep relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-lg relative z-10">
                <div className="glass p-12 rounded-[3rem] border border-white/10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in duration-700">

                    {/* Brand Header */}
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-white rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-white/10 group hover:rotate-12 transition-transform cursor-default">
                            <Zap className="fill-black text-black" size={36} />
                        </div>
                        <h1 className="text-5xl font-black text-white mb-3 tracking-tighter uppercase italic">Admin Portal</h1>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.2em]">Secure Intelligence Access</p>
                    </div>

                    <form onSubmit={handleAdminLogin} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    placeholder="admin@sydneyevents.com"
                                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 font-bold text-white outline-none focus:border-indigo-500/50 transition-all shadow-inner text-sm"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••••"
                                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/5 border border-white/5 font-bold text-white outline-none focus:border-indigo-500/50 transition-all shadow-inner text-sm"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-sm font-bold text-rose-400 text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-black py-5 px-6 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all shadow-2xl shadow-white/10 active:scale-95 flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em] disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>AUTHENTICATE</span>
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] bg-slate-950/60 rounded-full">OR CONTINUE WITH</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-4 bg-white/5 border border-white/10 text-white font-bold py-5 px-6 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        <span className="text-sm font-black uppercase tracking-widest">Sign in with Google</span>
                    </button>

                    <p className="text-center mt-10 text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">
                        Protected · Restricted Access · SydEvents Intel
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
