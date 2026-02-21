import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginSuccess = ({ setUser }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            fetch('http://localhost:5000/api/auth/me', {
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
        <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-full animate-pulse"></div>
                </div>
            </div>
            <h2 className="text-3xl font-black text-white mt-12 tracking-widest uppercase animate-pulse">Establishing Session</h2>
            <p className="text-slate-500 mt-4 font-medium tracking-widest uppercase text-[10px]">Secure handshaking in progress...</p>
        </div>
    );
};

export default LoginSuccess;
