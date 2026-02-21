import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Layout, Zap, Menu, X, ArrowUpRight, UserCheck, Settings } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;
    const isAdminPath = location.pathname === '/dashboard' || location.pathname === '/leads';

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 md:px-12 py-8 ${scrolled || isAdminPath ? 'bg-bg-deep/70 backdrop-blur-3xl border-b border-white/5 py-4' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8">

                <Link to="/" className="group flex items-center gap-4 relative">
                    <div className="absolute -inset-2 bg-indigo-500/10 rounded-2xl blur-lg group-hover:bg-indigo-500/20 transition-all opacity-0 group-hover:opacity-100"></div>
                    <div className="w-11 h-11 bg-white text-black rounded-xl flex items-center justify-center shadow-2xl transition-all group-hover:rotate-[15deg] relative z-10">
                        <Zap className="fill-black" size={22} />
                    </div>
                    <div className="flex flex-col relative z-10">
                        <span className="text-2xl font-black tracking-tighter text-white leading-none">
                            SYD<span className="text-indigo-400">EVENTS</span>
                        </span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Prime Discovery</span>
                    </div>
                </Link>


                {!isAdminPath && (
                    <div className="hidden lg:flex items-center gap-12">
                        {[
                            { name: 'Experiences', path: '/' },
                            { name: 'Venues', path: '/venues' },
                            { name: 'Discovery', path: '/about' }
                        ].map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`group relative py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${isActive(link.path) ? 'text-white' : 'text-slate-500 hover:text-indigo-400'}`}
                            >
                                {link.name}
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 transition-all duration-500 origin-left ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                        ))}
                    </div>
                )}


                <div className="flex items-center gap-8">
                    {user ? (
                        <div className="flex items-center gap-6">

                            <div className="hidden xl:flex items-center bg-white/5 border border-white/10 rounded-2xl p-1.5 backdrop-blur-md">
                                <Link to="/dashboard" className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive('/dashboard') ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                                    <Layout size={14} />
                                    Pipeline
                                </Link>
                                <Link to="/leads" className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive('/leads') ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                                    <UserCheck size={14} />
                                    Leads
                                </Link>
                            </div>

                            <div className="h-8 w-px bg-white/10 hidden xl:block"></div>

                            <div className="flex items-center gap-4 group">
                                <div className="flex items-center gap-4 cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-0.5">Admin Ops</p>
                                        <p className="text-sm font-black text-white">{user.name.split(' ')[0]}</p>
                                    </div>
                                    <div className="relative">
                                        <img src={user.avatar} alt="" className="w-12 h-12 rounded-2xl border-2 border-indigo-500/30 object-cover shadow-2xl group-hover:border-indigo-500 transition-colors" />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-bg-deep rounded-full"></div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-xl hidden lg:flex items-center justify-center group/logout"
                                    title="Terminate Session"
                                >
                                    <LogOut size={18} className="group-hover/logout:-translate-x-0.5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-500 hover:text-white transition-all shadow-2xl hover:shadow-indigo-500/20 active:scale-95">
                            MEMBERS ACCESS
                            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Link>
                    )}

                    <button className="lg:hidden p-2 text-white bg-white/5 rounded-xl border border-white/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>


            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-bg-deep/98 backdrop-blur-3xl z-[200] p-12 lg:hidden flex flex-col justify-between animate-in fade-in duration-500">
                    <div className="flex justify-between items-center mb-12">
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black text-white tracking-tighter">SYD<span className="text-indigo-400">EVENTS</span></Link>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-4 bg-white/5 rounded-2xl text-white">
                            <X size={32} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-8">
                        {['Experiences', 'Venues', 'Discovery'].map((name, i) => (
                            <Link
                                key={name}
                                to={name === 'Experiences' ? '/' : `/${name.toLowerCase()}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-5xl font-black text-white hover:text-indigo-400 transition-colors uppercase tracking-tighter italic"
                            >
                                {name}
                            </Link>
                        ))}
                    </div>

                    {user && (
                        <div className="pt-12 border-t border-white/5 grid grid-cols-2 gap-4">
                            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex flex-col gap-4 p-8 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20">
                                <Layout size={32} className="text-indigo-400" />
                                <span className="text-xl font-black text-white uppercase">Pipeline</span>
                            </Link>
                            <Link to="/leads" onClick={() => setMobileMenuOpen(false)} className="flex flex-col gap-4 p-8 rounded-[2rem] bg-rose-500/10 border border-rose-500/20">
                                <UserCheck size={32} className="text-rose-400" />
                                <span className="text-xl font-black text-white uppercase">Leads</span>
                            </Link>
                            <button onClick={handleLogout} className="col-span-2 py-6 rounded-3xl bg-white/5 text-rose-500 font-black flex items-center justify-center gap-3">
                                <LogOut size={20} /> LOGOUT
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
