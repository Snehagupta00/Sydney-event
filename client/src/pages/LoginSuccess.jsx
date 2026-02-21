import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginSuccess = ({ setUser }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    setUser(data);
                    navigate('/dashboard');
                });
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, setUser]);

    return (
        <div className="min-h-screen bg-[#0c0c0e] flex flex-col items-center justify-center px-6 overflow-hidden relative">

            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500/30 animate-[scan_3s_linear_infinite]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-16">
                    <div className="w-32 h-32 border border-indigo-500/10 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="text-indigo-500 fill-indigo-500/20 animate-pulse" size={32} />
                    </div>
                </div>

                <div className="text-center space-y-6 max-w-xs">
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                        Authorizing <br /><span className="text-indigo-500">Credentials.</span>
                    </h2>
                    
                    <div className="flex flex-col gap-2">
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[60%] animate-[progress_2s_ease-in-out_infinite]"></div>
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em]">
                            <span className="text-indigo-500">Handshaking</span>
                            <span className="text-slate-600">88%</span>
                        </div>
                    </div>

                    <p className="text-slate-500 font-bold tracking-[0.2em] uppercase text-[9px] animate-pulse">
                        Synchronizing with neural gateway...
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                @keyframes progress {
                    0% { transform: translateX(-100%); width: 30%; }
                    50% { width: 70%; }
                    100% { transform: translateX(350%); width: 30%; }
                }
            `}} />
        </div>
    );
};

export default LoginSuccess;
