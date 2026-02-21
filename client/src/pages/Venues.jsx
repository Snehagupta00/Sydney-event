import { ArrowRight, Building2, MapPin, Star, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Venues = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await api.get('/events');
        const uniqueVenues = [...new Set(res.data.map(e => e.venue))].map(name => {
          const event = res.data.find(e => e.venue === name);
          return {
            name,
            city: event.city,
            count: res.data.filter(e => e.venue === name).length,
            image: event.imageUrl
          };
        });
        setVenues(uniqueVenues);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  return (
    <div className="min-h-screen bg-bg-deep pt-48 pb-24 px-4 sm:px-6 md:px-12 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto">

        <div className="mb-32 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border-white/5 text-indigo-400 text-[10px] font-black tracking-[0.4em] uppercase mb-10 relative z-10 transition-all hover:scale-105 cursor-default">
            <Building2 size={14} />
            <span>Elite Infrastructure</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-[10rem] font-black text-white mb-6 md:mb-10 tracking-tighter leading-[0.85] italic uppercase relative z-10">
            Iconic <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">Domains.</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed relative z-10">
            The architectural soul of the city. From high-gravity stadium anthems to the whispered secrets of underground basements.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[500px] rounded-[3rem] bg-white/5 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {venues.map((venue, idx) => (
              <div key={idx} className="group relative h-[520px] rounded-[3.5rem] overflow-hidden glass border-white/5 hover:border-indigo-500/30 transition-all duration-700 shadow-2xl">
                <div className="absolute inset-0 z-0">
                  <img src={venue.image} alt="" className="w-full h-full object-cover opacity-50 group-hover:scale-110 group-hover:opacity-60 transition-all duration-1000 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/20 to-transparent"></div>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-12 z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="px-4 py-1.5 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-widest shadow-xl">
                      {venue.count} ACTIVE SESSIONS
                    </div>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-white mb-2 md:mb-3 leading-none italic uppercase tracking-tighter group-hover:text-indigo-400 transition-colors">{venue.name}</h3>

                  <div className="flex items-center gap-2 text-slate-400 mb-6 md:mb-10 font-bold text-xs md:text-sm tracking-tight">
                    <MapPin size={16} className="text-indigo-500/60" />
                    {venue.city}, AU_REG_01
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-10 border-t border-white/10 pt-8">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <Star size={14} className="text-amber-500" /> Verified
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <Users size={14} className="text-indigo-500" /> High Cap
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/?search=${encodeURIComponent(venue.name)}&city=${venue.city}`)}
                    className="w-full py-5 rounded-[1.5rem] bg-white text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xl active:scale-95"
                  >
                    INSPECT LINEUP
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}


        <div className="mt-32 md:mt-48 glass p-8 md:p-32 rounded-3xl md:rounded-[5rem] relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 md:gap-24 group shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)]">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[200px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <div className="flex-1 relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-indigo-400 text-[10px] font-black tracking-[0.4em] uppercase mb-8">
              <Zap size={14} />
              <span>Partnership Hub</span>
            </div>
            <h2 className="text-3xl md:text-[6rem] font-black text-white mb-6 md:mb-10 tracking-tighter leading-[0.85] italic uppercase">
              Your Venue, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">Our Intel.</span>
            </h2>
            <p className="text-slate-500 text-xl font-medium mb-12 max-w-xl leading-relaxed">
              Integrate your infrastructure with the SydEvents intelligence network. Direct access to 24,000+ active urban discovery-seekers.
            </p>
            <button className="bg-white text-black font-black px-16 py-6 rounded-[1.8rem] hover:scale-105 transition-all shadow-2xl hover:bg-indigo-500 hover:text-white flex items-center gap-3 mx-auto lg:mx-0">
              PARTNER INQUIRY
              <ArrowRight size={20} />
            </button>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center relative z-10">
            <div className="w-80 h-80 md:w-[450px] md:h-[450px] rounded-[4rem] bg-gradient-to-tr from-indigo-500 to-rose-500 p-0.5 rotate-[8deg] group-hover:rotate-0 transition-all duration-1000 shadow-[0_64px_128px_-32px_rgba(99,102,241,0.4)]">
              <div className="w-full h-full rounded-[3.9rem] bg-bg-card overflow-hidden">
                <img src="https://images.unsplash.com/photo-1514525253361-bee8a19740c1?auto=format&fit=crop&w=1200&q=80" alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Venues;
