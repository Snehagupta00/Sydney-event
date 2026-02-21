import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import LoginSuccess from './pages/LoginSuccess';
import Venues from './pages/Venues';
import About from './pages/About';
import Leads from './pages/Leads';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import api from './services/api';


const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};


const LayoutWrapper = ({ user, setUser, children }) => {
  const location = useLocation();
  const hideFooterPaths = ['/dashboard', '/leads', '/login', '/login-success'];
  const shouldHideFooter = hideFooterPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <ScrollToTop />
      <div className="pt-2">
        {children}
      </div>
      {!shouldHideFooter && <Footer />}
    </>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => {
          if (!res.data.message) setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-indigo-500/10 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-8 animate-pulse">Establishing Intel Link</p>
    </div>
  );

  return (
    <Router>
      <LayoutWrapper user={user} setUser={setUser}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<LoginSuccess setUser={setUser} />} />


          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/leads"
            element={user ? <Leads /> : <Navigate to="/login" />}
          />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
