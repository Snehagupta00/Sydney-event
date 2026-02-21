import { ArrowLeft, ChevronRight, Lock, Mail, ShieldCheck, Sparkles, User, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = isSignUp ? '/auth/signup' : '/auth/login';
      const payload = isSignUp ? { name, email, password } : { email, password };

      const res = await api.post(endpoint, payload);
      localStorage.setItem('token', res.data.token);

      if (isAdminMode && !isSignUp) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-bg-deep relative overflow-hidden font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative h-full overflow-hidden bg-slate-950 border-r border-white/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-500/10 rounded-full blur-[150px] opacity-40"></div>
        </div>
        <div className="relative z-10 p-8 md:p-16 pt-16 md:pt-24 flex flex-col justify-between h-full w-full">
          <div>
            <div className="space-y-4 max-w-md">
              <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase italic animate-in fade-in slide-in-from-left-8 duration-700">
                Access <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-rose-500">The Pulse.</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Join our inner circle for exclusive access to the city's most definitive experiences.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="p-5 rounded-2xl glass border-white/5">
              <Sparkles className="text-indigo-400 mb-2" size={20} />
              <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-1">Curated Benchmarks</h4>
              <p className="text-slate-600 text-[9px] font-bold leading-relaxed uppercase tracking-tighter">Verified by urban experts.</p>
            </div>
            <div className="p-5 rounded-2xl glass border-white/5">
              <ShieldCheck className="text-rose-400 mb-2" size={20} />
              <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-1">Secure Shell</h4>
              <p className="text-slate-600 text-[9px] font-bold leading-relaxed uppercase tracking-tighter">Enterprise-grade protection.</p>
            </div>
          </div>
        </div>


        <div className="absolute right-[-5%] bottom-[-5%] w-[110%] h-[50%] opacity-10 pointer-events-none overflow-hidden grayscale contrast-125">
          <img
            src="https://images.unsplash.com/photo-1549463599-2479382f44ab?auto=format&fit=crop&w=1200&q=80"
            alt=""
            className="w-full h-full object-cover rounded-[5rem]"
          />
        </div>
      </div>


      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center px-6 md:px-20 relative z-20 overflow-y-auto custom-scrollbar">

        <div className="w-full max-w-md py-12">

          <div className="mb-8 h-16 overflow-hidden">
            <div className={`transition-all duration-700 transform ${isSignUp ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none mb-1">
                Welcome <span className="text-indigo-500">Back.</span>
              </h2>
              <p className="text-slate-500 font-black text-[9px] uppercase tracking-[0.4em]">Initialize secure session</p>
            </div>
            <div className={`transition-all duration-700 transform ${isSignUp ? '-translate-y-full opacity-100' : 'translate-y-0 opacity-0'}`}>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none mb-1">
                Join The <span className="text-rose-500">Circle.</span>
              </h2>
              <p className="text-slate-500 font-black text-[9px] uppercase tracking-[0.4em]">Create discovery profile</p>
            </div>
          </div>


          {!isSignUp && (
            <div className="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/5 w-fit">
              <button
                onClick={() => setIsAdminMode(false)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${!isAdminMode ? 'bg-white text-black shadow-lg' : 'text-slate-600 hover:text-white'}`}
              >
                <User size={12} /> User
              </button>
              <button
                onClick={() => setIsAdminMode(true)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isAdminMode ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-600 hover:text-white'}`}
              >
                <Lock size={12} /> Admin
              </button>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">

            <div className={`space-y-1.5 transition-all duration-500 ${isSignUp ? 'opacity-100' : 'hidden'}`}>
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Identity Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-white/3 border border-white/10 font-bold text-white outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all text-sm placeholder:text-slate-800"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required={isSignUp}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Universal ID</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                <input
                  type="email"
                  placeholder="agent@intel.net"
                  className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-white/3 border border-white/10 font-bold text-white outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all text-sm placeholder:text-slate-800"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Cipher Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-white/3 border border-white/10 font-bold text-white outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all text-sm placeholder:text-slate-800"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="py-3 px-4 rounded-xl bg-rose-500/5 border border-rose-500/20 text-[10px] font-black text-rose-400 text-center uppercase tracking-wider">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-black py-4 px-6 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.3em] disabled:opacity-50 ${isSignUp ? 'bg-rose-500 text-white shadow-lg' : 'bg-white text-black shadow-lg hover:bg-indigo-500 hover:text-white'}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-current/20 border-t-current rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'INITIALIZE PROFILE' : 'AUTHENTICATE'}</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>


          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-5 text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] bg-bg-deep rounded-full">Secure Linkage</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 bg-white/5 border border-white/10 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98] group"
          >
            <div className="w-4 h-4 bg-white rounded flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">Authorize with SSO</span>
          </button>


          <div className="mt-8 text-center">
            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-3">
              {isSignUp ? "Already part of the pulse?" : "New to the discovery network?"}
            </p>
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="flex items-center justify-center gap-2 mx-auto text-indigo-500 hover:text-white transition-colors group"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                {isSignUp ? "Authenticate Existing Profile" : "Request New Dossier"}
              </span>
              {isSignUp ? <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> : <UserPlus size={14} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </div>

          <p className="mt-8 text-[8px] text-slate-800 font-black uppercase tracking-[0.4em] text-center">
            Secure Environment · IP Logged · Privacy Shield
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
