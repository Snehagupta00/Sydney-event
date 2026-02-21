import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Instagram, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-bg-deep border-t border-white/5 pt-24 pb-12 px-6 md:px-12 overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">

                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center shadow-xl">
                            <Zap className="fill-black" size={20} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">
                            SYD<span className="text-indigo-400">EVENTS</span>
                        </span>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                        The ultimate destination for curation, discovery, and experience in the heart of Australia's most dynamic cities.
                    </p>
                    <div className="flex gap-4">
                        {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-white hover:text-black transition-all">
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>


                <div>
                    <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-10">Platform</h4>
                    <ul className="space-y-4">
                        {['Experiences', 'Venues', 'Discovery', 'Collaborate'].map((link) => (
                            <li key={link}>
                                <Link to={link === 'Experiences' ? '/' : `/${link.toLowerCase()}`} className="text-slate-500 hover:text-white font-bold transition-colors">
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>


                <div>
                    <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-10">Integrity</h4>
                    <ul className="space-y-4">
                        {['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Security'].map((link) => (
                            <li key={link}>
                                <a href="#" className="text-slate-500 hover:text-white font-bold transition-colors">
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>


                <div className="col-span-1 md:col-span-1">
                    <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-10">Direct Dispatch</h4>
                    <p className="text-slate-500 font-bold mb-6 text-sm">Join the curated movement.</p>
                    <div className="relative group">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-6 pr-12 text-sm text-white focus:border-indigo-500/40 outline-none transition-all"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all">
                            <ArrowUpRight size={18} />
                        </button>
                    </div>
                </div>
            </div>


            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 gap-8">
                <p>© 2026 SYDNEY EVENTS INTEL. ALL RIGHTS RESERVED.</p>
                <div className="flex gap-8">
                    <span>Coded with Pride in Sydney</span>
                    <span className="text-indigo-500/50 italic font-medium">Lajawab Version 4.0</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
