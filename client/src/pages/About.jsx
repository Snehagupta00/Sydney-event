import { ArrowUpRight, Globe, Heart, ShieldCheck, Sparkles, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-bg-deep pt-36 pb-24 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col items-center text-center mb-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-indigo-500/20 text-indigo-400 text-xs font-black tracking-widest uppercase mb-8">
            <Sparkles size={14} />
            <span>The Vision</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-none italic uppercase">
            Syd<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">Events</span>
          </h1>
          <p className="max-w-3xl text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
            We don't just list events. We curate the soul of Sydney. From underground jazz dens to stadium spectacles, we are your gateway to the moments that define the city.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          {[
            {
              title: 'Hyper-Curated',
              desc: 'Every event on our platform is hand-reviewed (or intelligently verified) for quality and authenticity.',
              icon: Zap,
              color: 'text-indigo-500'
            },
            {
              title: 'Community First',
              desc: 'We prioritize local artists, independent venues, and community-driven movements that keep Sydney alive.',
              icon: Heart,
              color: 'text-rose-500'
            },
            {
              title: 'Secure Access',
              desc: 'Direct, verified links to official ticket providers. No bots, no scams, just the experience.',
              icon: ShieldCheck,
              color: 'text-emerald-500'
            },
          ].map((item, i) => (
            <div key={i} className="glass p-12 rounded-[3rem] border border-white/5 group hover:border-indigo-500/30 transition-all duration-500">
              <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-8 group-hover:scale-110 transition-transform ${item.color}`}>
                <item.icon size={32} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>


        <div className="flex flex-col lg:flex-row gap-20 items-center mb-40">
          <div className="flex-1 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
            <img
              src="https://images.unsplash.com/photo-1549463599-2479382f44ab?auto=format&fit=crop&w=1200"
              className="w-full rounded-[4rem] border border-white/10 shadow-2xl relative z-10"
              alt="Sydney Harbour"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tighter uppercase leading-none">
              Born in the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Heart of Sydney.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">
              SydEvents started with a simple problem: too many websites, too much noise, and no "soul". We wanted a place that looked as good as the events it hosted.
            </p>
            <p className="text-slate-400 text-lg mb-12 leading-relaxed font-medium">
              Today, we serve over 20,000 active discovery-seekers monthly, bridging the gap between digital discovery and real-world experience. Our mission is to ensure no Sydneysider ever says "there's nothing to do" again.
            </p>
            <div className="flex items-center gap-12">
              <div>
                <h4 className="text-4xl font-black text-white mb-1">20K+</h4>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Users</p>
              </div>
              <div>
                <h4 className="text-4xl font-black text-white mb-1">500+</h4>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Venues</p>
              </div>
              <div>
                <h4 className="text-4xl font-black text-white mb-1">1.2M</h4>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Ticket Clicks</p>
              </div>
            </div>
          </div>
        </div>


        <div className="relative glass p-16 md:p-32 rounded-[5rem] overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.1)_0%,_transparent_70%)] opacity-50"></div>
          <Globe className="text-indigo-500 opacity-20 mx-auto mb-10" size={80} />
          <h2 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter uppercase leading-none relative z-10">
            Join the <br />Movement.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <button className="bg-white text-black font-black px-12 py-5 rounded-3xl hover:bg-slate-200 transition-all shadow-xl">
              EXPLORE EVENTS
            </button>
            <button className="glass flex items-center justify-center gap-3 text-white font-black px-12 py-5 rounded-3xl hover:bg-white/10 transition-all border border-white/10">
              CONTACT US
              <ArrowUpRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
