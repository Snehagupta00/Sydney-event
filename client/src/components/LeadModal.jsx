import React, { useState } from 'react';
import api from '../services/api';
import { X, Mail, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

const LeadModal = ({ event, onClose }) => {
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!consent) return setError('Authorization required to proceed');

        setLoading(true);
        setError('');
        try {
            const res = await api.post('/events/lead', {
                email,
                consent,
                eventId: event._id
            });

            // Trigger success animation then redirect
            setTimeout(() => {
                window.location.href = res.data.redirectUrl;
            }, 800);
        } catch (err) {
            console.error(err);
            setLoading(false);
            setError('System timeout. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose}>
            <div className="w-full max-w-xl glass rounded-[3rem] border border-white/10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] overflow-hidden relative animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>

                {/* Visual Header */}
                <div className="relative h-48">
                    <img src={event.imageUrl} alt="" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent"></div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-3 rounded-2xl bg-black/40 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all border border-white/10"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-6 left-10">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 w-fit">
                            <Zap size={12} className="fill-indigo-400" />
                            Direct Access
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Unlock Experience</h2>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-10 pb-12">
                    <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                        To access ticket booking for <strong className="text-white font-black">{event.title}</strong>, please authenticate your request below. You'll be redirected to the provider's official gateway.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dispatch Intelligence To</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    placeholder="yourname@experience.com"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-white/5 border border-white/5 font-bold text-white outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 group transition-all hover:bg-indigo-500/5">
                            <label className="flex gap-4 cursor-pointer items-start">
                                <div className="mt-1 relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={consent}
                                        onChange={e => setConsent(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-6 h-6 rounded-lg border-2 border-white/10 bg-slate-800 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all"></div>
                                    <ShieldCheck className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={14} />
                                </div>
                                <span className="text-sm text-slate-400 font-medium leading-relaxed group-hover:text-slate-300 transition-colors">
                                    I authorize SydEvents to curate and send future premium experiences and VIP invitations to my inbox.
                                </span>
                            </label>
                        </div>

                        {error && <p className="text-rose-500 text-sm font-black text-center animate-bounce">{error}</p>}

                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 rounded-[1.5rem] bg-white text-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_-12px_rgba(255,255,255,0.2)] hover:bg-indigo-500 hover:text-white transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        SECURE REDIRECT
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                            <button type="button" onClick={onClose} className="text-[10px] font-black text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors">
                                ABORT REQUEST
                            </button>
                        </div>
                    </form>
                </div>

                {/* Success Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-indigo-600 flex flex-col items-center justify-center z-50 animate-in fade-in duration-500">
                        <div className="w-20 h-20 rounded-full border-4 border-white/30 border-t-white animate-spin mb-8"></div>
                        <h3 className="text-2xl font-black text-white tracking-widest uppercase">Authorizing...</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadModal;
