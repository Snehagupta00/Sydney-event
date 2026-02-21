import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Mail, Calendar, ExternalLink, UserCheck, Search, Filter, Database, CheckCircle, Clock } from 'lucide-react';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await api.get('/events/leads');
                setLeads(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    const filteredLeads = leads.filter(l =>
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-bg-deep pt-36 pb-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                <UserCheck size={20} />
                            </div>
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Administrative Tools</span>
                        </div>
                        <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Conversion <span className="text-indigo-500">Intelligence</span></h1>
                    </div>

                    <div className="flex-1 max-w-md w-full relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Filter by email or event title..."
                            className="w-full pl-14 pr-6 py-4 rounded-2xl glass font-medium outline-none focus:border-indigo-500/40"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Leads', value: leads.length, icon: Database, color: 'text-indigo-400' },
                        { label: 'Verified', value: leads.filter(l => l.consent).length, icon: CheckCircle, color: 'text-emerald-400' },
                        { label: 'New Today', value: leads.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length, icon: Clock, color: 'text-amber-400' },
                        { label: 'Opt-in Rate', value: leads.length ? Math.round((leads.filter(l => l.consent).length / leads.length) * 100) + '%' : '0%', icon: Filter, color: 'text-rose-400' },
                    ].map((stat, i) => (
                        <div key={i} className="glass p-8 rounded-3xl border border-white/5">
                            <stat.icon className={`${stat.color} mb-4`} size={24} />
                            <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/5">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Lead Identity</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Event Interest</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Consent Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Captured At</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="5" className="px-10 py-8 bg-white/5 border-b border-white/5"></td>
                                        </tr>
                                    ))
                                ) : filteredLeads.length > 0 ? (
                                    filteredLeads.map((lead, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-white font-black text-xs uppercase">
                                                        {lead.email[0]}
                                                    </div>
                                                    <span className="font-bold text-white text-sm">{lead.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div>
                                                    <p className="font-bold text-indigo-400 text-sm group-hover:text-indigo-300 transition-colors truncate max-w-[200px]">{lead.eventTitle}</p>
                                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter mt-1">ID: {lead.eventRef.slice(-8)}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                {lead.consent ? (
                                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">Verified Opt-in</span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-black uppercase tracking-widest">Single Entry</span>
                                                )}
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                                                    <Clock size={14} className="text-slate-600" />
                                                    {new Date(lead.createdAt).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <a href={lead.originalUrl} target="_blank" className="p-3 bg-white/5 border border-white/5 rounded-xl text-slate-500 hover:text-indigo-400 hover:bg-white/10 transition-all inline-block">
                                                    <ExternalLink size={18} />
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-10 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs opacity-40">No lead records found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leads;
