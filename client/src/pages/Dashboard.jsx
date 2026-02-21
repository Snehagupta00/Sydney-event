import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Search, RefreshCw, X, ArrowUpRight, Clock, MapPin,
    Database, CheckCircle2, Calendar, Zap, ShieldCheck, Filter
} from 'lucide-react';

const STATUS_STYLES = {
    new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    updated: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    inactive: 'bg-red-500/10 text-red-400 border-red-500/20',
    imported: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
};

const Dashboard = ({ user }) => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [search, setSearch] = useState('');
    const [cityFilter, setCityFilter] = useState('Sydney');
    const [statusFilter, setStatusFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [importNotes, setImportNotes] = useState('');
    const [importSuccess, setImportSuccess] = useState(false);
    const [stats, setStats] = useState({ total: 0, new: 0, updated: 0, imported: 0 });

    useEffect(() => {
        fetchEvents();
    }, [search, cityFilter, statusFilter, startDate, endDate]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params = { city: cityFilter };
            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await api.get('/events', { params });
            setEvents(res.data);
            setStats({
                total: res.data.length,
                new: res.data.filter(e => e.status === 'new').length,
                updated: res.data.filter(e => e.status === 'updated').length,
                imported: res.data.filter(e => e.status === 'imported').length,
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleScrape = async () => {
        setSyncing(true);
        try {
            await api.post('/events/scrape');
            await fetchEvents();
        } catch (err) {
            console.error(err);
        }
        setSyncing(false);
    };

    const handleImport = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/events/import/${selectedEvent._id}`, {
                notes: importNotes,
                userId: user?.name || 'Admin'
            });
            setImportSuccess(true);
            setSelectedEvent(res.data);
            setImportNotes('');
            fetchEvents();
        } catch (err) {
            console.error(err);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('');
        setStartDate('');
        setEndDate('');
    };

    const hasFilters = search || statusFilter || startDate || endDate;

    return (
        <div className="min-h-screen bg-bg-deep pt-36 pb-12 px-4 md:px-10 selection:bg-rose-500/30">
            <div className="max-w-screen-2xl mx-auto">


                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-4 py-1.5 rounded-full bg-white text-black text-[10px] font-black tracking-[0.3em] uppercase shadow-xl">Command Center</span>
                            <div className="h-px flex-1 bg-white/5 max-w-xs"></div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic uppercase leading-none">
                            Event <span className="text-indigo-500">Pipeline.</span>
                        </h1>
                        <p className="text-slate-500 font-bold mt-3 text-sm uppercase tracking-widest">
                            Logged in as <span className="text-indigo-400">{user?.name}</span>
                        </p>
                    </div>

                    <div className="flex gap-3 items-center flex-wrap">
                        <div className="glass px-5 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Engine: Live</span>
                        </div>
                        <button
                            onClick={handleScrape}
                            disabled={syncing}
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
                            {syncing ? 'SYNCING...' : 'SYNC DATA'}
                        </button>
                    </div>
                </div>


                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Total Events', value: stats.total, color: 'text-white', icon: Database, bg: 'bg-white/5' },
                        { label: 'New / Unverified', value: stats.new, color: 'text-blue-400', icon: Clock, bg: 'bg-blue-500/5' },
                        { label: 'Changed / Updated', value: stats.updated, color: 'text-amber-400', icon: Zap, bg: 'bg-amber-500/5' },
                        { label: 'Imported / Live', value: stats.imported, color: 'text-emerald-400', icon: ShieldCheck, bg: 'bg-emerald-500/5' },
                    ].map((s, i) => (
                        <div key={i} className={`p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all ${s.bg}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-white/5">
                                    <s.icon className={s.color} size={20} />
                                </div>
                                <ArrowUpRight size={16} className="text-slate-800" />
                            </div>
                            <h3 className={`text-4xl font-black ${s.color} tracking-tighter leading-none mb-1`}>{s.value}</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
                        </div>
                    ))}
                </div>


                <div className="glass rounded-3xl border border-white/5 p-5 mb-8 flex flex-wrap gap-4 items-end">

                    <div className="flex-[2] min-w-[200px] relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search title, venue, description..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/5 font-bold text-sm tracking-tight outline-none focus:border-indigo-500/40 text-white"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>


                    <div className="relative min-w-[160px]">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
                        <select
                            className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white/5 border border-white/5 font-black text-[11px] uppercase tracking-widest appearance-none cursor-pointer outline-none focus:border-indigo-500/40 text-white"
                            value={cityFilter}
                            onChange={e => setCityFilter(e.target.value)}
                        >
                            <option value="Sydney">Sydney</option>
                            <option value="Melbourne">Melbourne</option>
                        </select>
                    </div>


                    <div className="relative min-w-[160px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <select
                            className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white/5 border border-white/5 font-black text-[11px] uppercase tracking-widest appearance-none cursor-pointer outline-none focus:border-indigo-500/40 text-white"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="new">New</option>
                            <option value="updated">Updated</option>
                            <option value="imported">Imported</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>


                    <div className="flex items-center gap-2 min-w-[240px]">
                        <div className="relative flex-1">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                            <input
                                type="date"
                                className="w-full pl-9 pr-3 py-4 rounded-2xl bg-white/5 border border-white/5 font-bold text-xs text-slate-400 outline-none focus:border-indigo-500/40 cursor-pointer"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                            />
                        </div>
                        <span className="text-slate-600 font-black text-xs">→</span>
                        <div className="relative flex-1">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                            <input
                                type="date"
                                className="w-full pl-9 pr-3 py-4 rounded-2xl bg-white/5 border border-white/5 font-bold text-xs text-slate-400 outline-none focus:border-indigo-500/40 cursor-pointer"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>


                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                        >
                            <X size={14} />
                            CLEAR
                        </button>
                    )}
                </div>


                <div className="flex flex-col xl:flex-row gap-8" style={{ height: '760px' }}>


                    <div className="flex-1 flex flex-col glass rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                        <div className="px-8 py-5 bg-white/3 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                {events.length} records · {cityFilter} Region
                            </span>
                            {loading && <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>}
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-slate-950/80 backdrop-blur-sm z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Event / Source</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest hidden md:table-cell">Date</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest hidden lg:table-cell">Venue</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Ref</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {events.length === 0 && !loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-24 text-center">
                                                <Search size={40} className="mx-auto text-slate-800 mb-4" />
                                                <p className="text-slate-600 font-black uppercase text-xs tracking-widest">No records match your filters</p>
                                            </td>
                                        </tr>
                                    ) : events.map((event) => (
                                        <tr
                                            key={event._id}
                                            onClick={() => { setSelectedEvent(event); setImportSuccess(false); }}
                                            className={`group cursor-pointer transition-all duration-200 ${selectedEvent?._id === event._id ? 'bg-indigo-500/8 border-l-2 border-l-indigo-500' : 'hover:bg-white/2'}`}
                                        >
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_STYLES[event.status] || STATUS_STYLES.new}`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                                                        <img src={event.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={e => { e.target.style.display = 'none' }} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-sm text-white truncate max-w-[220px] group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{event.title}</p>
                                                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-wider mt-0.5">{event.sourceName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 hidden md:table-cell">
                                                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                                                    <Calendar size={12} className="text-slate-600" />
                                                    {event.date || '—'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 hidden lg:table-cell">
                                                <p className="text-slate-500 font-bold text-xs truncate max-w-[140px]">{event.venue}</p>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <code className="text-[9px] font-black text-slate-700 bg-white/5 px-2 py-1 rounded-lg">
                                                    {event._id.slice(-6).toUpperCase()}
                                                </code>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>


                    {selectedEvent ? (
                        <div className="w-full xl:w-[500px] flex-shrink-0 flex flex-col glass rounded-[3rem] border border-white/5 overflow-hidden animate-in slide-in-from-right-12 duration-500 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.9)]">


                            <div className="p-8 bg-white/3 flex justify-between items-center border-b border-white/5 flex-shrink-0">
                                <div>
                                    <p className="text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.3em] mb-1">Record Inspector</p>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tight italic">Event Detail</h2>
                                </div>
                                <button className="p-3 hover:bg-white/10 rounded-2xl transition-all text-slate-500 hover:text-white" onClick={() => setSelectedEvent(null)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">

                                <div className="relative h-56 flex-shrink-0">
                                    <img src={selectedEvent.imageUrl} alt="" className="w-full h-full object-cover opacity-60" onError={e => { e.target.parentNode.style.display = 'none' }} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/30 to-transparent"></div>
                                    <div className="absolute bottom-6 left-8 right-8">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {(selectedEvent.category || []).map((c, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-indigo-600 text-[9px] font-black text-white uppercase tracking-widest">{c}</span>
                                            ))}
                                        </div>
                                        <h3 className="text-2xl font-black text-white leading-tight italic uppercase tracking-tighter">{selectedEvent.title}</h3>
                                    </div>
                                </div>

                                <div className="p-8 space-y-6">

                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Date', value: selectedEvent.date || '—' },
                                            { label: 'Venue', value: selectedEvent.venue || '—' },
                                            { label: 'City', value: selectedEvent.city || '—' },
                                            { label: 'Source', value: selectedEvent.sourceName || '—' },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="p-4 rounded-2xl bg-white/3 border border-white/5">
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</p>
                                                <p className="text-sm font-black text-white truncate">{value}</p>
                                            </div>
                                        ))}
                                    </div>


                                    {selectedEvent.address && (
                                        <div className="p-4 rounded-2xl bg-white/3 border border-white/5">
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Address</p>
                                            <p className="text-sm font-medium text-slate-300">{selectedEvent.address}</p>
                                        </div>
                                    )}


                                    <div>
                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Description</p>
                                        <p className="text-sm text-slate-400 font-medium leading-relaxed bg-white/3 p-5 rounded-2xl border border-white/5 italic">
                                            "{selectedEvent.description || selectedEvent.summary || 'No description available.'}"
                                        </p>
                                    </div>


                                    <a
                                        href={selectedEvent.originalUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between p-4 rounded-2xl bg-white/3 border border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all group"
                                    >
                                        <span className="text-xs font-black text-slate-400 group-hover:text-indigo-400 transition-colors uppercase tracking-widest">View Original Source</span>
                                        <ArrowUpRight size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                    </a>


                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest text-center">
                                        Last synced: {new Date(selectedEvent.lastScrapedAt).toLocaleString()}
                                    </p>

                                    <div className="border-t border-white/5 pt-6">
                                        {selectedEvent.status === 'imported' || importSuccess ? (
                                            <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in duration-500">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                                                        <CheckCircle2 size={24} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Status</p>
                                                        <p className="text-xl font-black text-emerald-400 uppercase italic">Imported to Platform</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest border-t border-emerald-500/10 pt-4">
                                                    <div>
                                                        <p className="text-emerald-600 mb-1">Imported By</p>
                                                        <p className="text-emerald-300">{selectedEvent.importedBy || 'Admin'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-emerald-600 mb-1">Date</p>
                                                        <p className="text-emerald-300">{selectedEvent.importedAt ? new Date(selectedEvent.importedAt).toLocaleDateString() : '—'}</p>
                                                    </div>
                                                </div>
                                                {selectedEvent.importNotes && (
                                                    <p className="mt-4 text-xs text-emerald-200/70 italic bg-white/5 p-4 rounded-xl font-medium leading-relaxed">
                                                        "{selectedEvent.importNotes}"
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <form onSubmit={handleImport} className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Import Notes (optional)</label>
                                                <textarea
                                                    placeholder="Add curation notes before publishing to platform..."
                                                    className="w-full h-28 p-5 rounded-3xl bg-white/5 border border-white/5 font-medium text-sm text-white outline-none focus:border-indigo-500/40 resize-none"
                                                    value={importNotes}
                                                    onChange={e => setImportNotes(e.target.value)}
                                                />
                                                <button
                                                    type="submit"
                                                    className="w-full py-5 rounded-3xl bg-white text-black font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3"
                                                >
                                                    <ShieldCheck size={18} />
                                                    IMPORT TO PLATFORM
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full xl:w-[500px] flex-shrink-0 glass rounded-[3rem] border border-white/5 flex flex-col items-center justify-center text-center p-12 shadow-2xl border-dashed">
                            <div className="w-24 h-24 rounded-full bg-white/3 flex items-center justify-center mb-8 border border-white/5">
                                <Database size={40} className="text-slate-800" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Select a Record</h3>
                            <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-xs">
                                Click any event in the pipeline to inspect its data, review details, and authorize import to the live platform.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
