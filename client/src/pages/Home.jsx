import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Search, MapPin, Sparkles, Filter, ChevronRight, Calendar, Zap, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard';
import LeadModal from '../components/LeadModal';

const Home = () => {
    const [searchParams] = useSearchParams();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [activeCity, setActiveCity] = useState(searchParams.get('city') || 'Sydney');
    const [stats, setStats] = useState({ users: '24K+', clicks: '1.2M', events: '400+' });

    useEffect(() => {
        fetchEvents();
    }, [activeCity, searchParams]);

    useEffect(() => {
        const search = searchParams.get('search');
        if (search) {

            setTimeout(() => {
                const el = document.getElementById('lineup');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }, [searchParams]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const search = searchParams.get('search');
            const city = searchParams.get('city') || activeCity;

            const params = { city };
            if (search) params.search = search;

            const res = await api.get('/events', { params });
            setEvents(res.data.filter(e => e.status !== 'inactive'));
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-bg-deep selection:bg-indigo-500 selection:text-white">


            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/10 rounded-full blur-[150px] opacity-40"></div>
            </div>


            <header className="relative pt-48 pb-12 px-6 md:px-12 overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border-white/5 text-indigo-400 text-[10px] font-black tracking-[0.3em] uppercase mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <Zap size={14} className="fill-indigo-400" />
                        <span>Intelligence in Discovery</span>
                    </div>

                    <h1 className="text-7xl md:text-[10rem] font-black text-white mb-10 leading-[0.8] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-700 uppercase italic">
                        Experience <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500">The Pulse</span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        Curated intelligence for the urban explorer. We bypass the noise to deliver the city's most definitive moments.
                    </p>


                    <div className="max-w-4xl mx-auto glass p-4 rounded-[2.5rem] border border-white/10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] flex flex-col md:flex-row gap-4 animate-in fade-in zoom-in duration-1000">
                        <div className="flex-[2] flex items-center gap-5 px-8 py-5 rounded-[1.8rem] bg-white/5 border border-white/5 group focus-within:border-indigo-500/40 transition-all shadow-inner">
                            <Search className="text-slate-500 group-focus-within:text-indigo-400" size={24} />
                            <input
                                type="text"
                                placeholder="Search experiences, venues, vibes..."
                                className="w-full bg-transparent border-none outline-none text-white text-lg font-bold placeholder:text-slate-700"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 flex items-center gap-4 px-8 py-5 rounded-[1.8rem] bg-white/5 border border-white/5 focus-within:border-indigo-500/40 transition-all">
                            <MapPin className="text-slate-500" size={22} />
                            <select
                                className="bg-transparent border-none outline-none text-white font-black text-sm uppercase tracking-widest cursor-pointer appearance-none w-full"
                                value={activeCity}
                                onChange={e => setActiveCity(e.target.value)}
                            >
                                <option value="Sydney">Sydney Hub</option>
                                <option value="Melbourne">Melbourne Hub</option>
                            </select>
                        </div>
                        <button className="flex-1 bg-white text-black font-black px-10 py-5 rounded-[1.8rem] transition-all hover:bg-indigo-500 hover:text-white active:scale-95 shadow-2xl flex items-center justify-center gap-3 group">
                            INITIATE
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>


                    <div className="mt-20 flex justify-center gap-20 animate-in fade-in duration-1000 delay-500">
                        {Object.entries(stats).map(([key, val]) => (
                            <div key={key} className="text-center">
                                <p className="text-4xl font-black text-white tracking-tighter">{val}</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{key}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </header>


            <main id="lineup" className="max-w-7xl mx-auto px-6 py-32 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
                    <div className="max-w-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <Star className="text-amber-500 fill-amber-500" size={20} />
                            <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">Intelligence Verified</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.9]">
                            Curated <br /><span className="text-indigo-500 italic">Benchmarks.</span>
                        </h2>
                        <div className="h-1 w-24 bg-indigo-500/50 rounded-full"></div>
                    </div>

                    <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/5 backdrop-blur-md">
                        {['Sydney', 'Melbourne'].map(city => (
                            <button
                                key={city}
                                onClick={() => setActiveCity(city)}
                                className={`px-10 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all ${activeCity === city ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[520px] rounded-[3rem] bg-white/5 animate-pulse border border-white/10"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event, index) => (
                                <EventCard
                                    key={event._id}
                                    event={event}
                                    index={index}
                                    onGetTickets={() => setSelectedEvent(event)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-40 text-center glass rounded-[4rem] border-dashed border-2 border-white/10">
                                <Search size={64} className="mx-auto text-slate-800 mb-8" />
                                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">No Matches in Database</h3>
                                <p className="text-slate-500 max-w-sm mx-auto font-medium">Reset your filters or pivot your search parameters to find new experiences.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>


            <section className="bg-white/2 py-40 border-y border-white/5 relative">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter uppercase italic leading-none">
                            Discover <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">The Iconic.</span>
                        </h2>
                        <div className="space-y-10">
                            {[
                                { title: 'Verified Venues', desc: 'Secure direct access to the city\'s most prestigious event spaces.', icon: ShieldCheck },
                                { title: 'Direct Dispatch', desc: 'Real-time intelligence on flash sales and underground gig announcements.', icon: Zap },
                                { title: 'Urban Network', desc: 'Join an elite community of discovery-seekers in Sydney and Melbourne.', icon: Sparkles },
                            ].map((f, i) => (
                                <div key={i} className="flex gap-8 group">
                                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                                        <f.icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{f.title}</h4>
                                        <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-10 bg-indigo-500/20 rounded-full blur-[100px] opacity-20"></div>
                        <img
                            src="https://images.unsplash.com/photo-1549463599-2479382f44ab?auto=format&fit=crop&w=1200&q=80"
                            alt=""
                            className="rounded-[4rem] border border-white/10 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)] grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>
                </div>
            </section>


            <section className="max-w-7xl mx-auto px-6 py-40">
                <div className="glass p-20 md:p-32 rounded-[5rem] relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-rose-600/10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-[6rem] font-black text-white mb-10 tracking-tighter uppercase italic leading-[0.8]">
                            Join The <br />Curation.
                        </h2>
                        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-16 font-medium">
                            The definitive Sydney event guide, delivered to those who seek more. Secure your spot in the VIP network.
                        </p>
                        <div className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-[2] bg-white/5 border border-white/10 rounded-2xl px-10 py-5 text-white font-bold placeholder:text-slate-700 outline-none focus:border-indigo-500/50 transition-all"
                            />
                            <button className="flex-1 bg-white text-black font-black px-12 py-5 rounded-2xl hover:bg-slate-200 transition-all shadow-2xl">
                                SECURE
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {selectedEvent && (
                <LeadModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </div>
    );
};

export default Home;
