import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { gsap } from '../animations/gsapConfig';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@stphilos.ac.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pageRef = useRef(null);

  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (!pageRef.current) return;
    let ctx = gsap.context(() => {
      gsap.fromTo(
        '.login-left-panel',
        { opacity: 0, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.login-right-panel',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid admin credentials. Please check your details.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await login('admin.google@stphilos.ac.in', 'oauth');
      navigate(from, { replace: true });
    } catch (err) {
      setError('Google Sign-In is restricted to verified administrators.');
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen w-full flex flex-col md:flex-row bg-slate-900 overflow-hidden font-sans">
      
      {/* 1. LEFT PANEL (~55% WIDTH) — MINIMAL PREMIUM HERITAGE PHOTOGRAPHY */}
      <div className="login-left-panel relative md:w-[55%] min-h-[35vh] md:min-h-screen bg-[#071A33] overflow-hidden flex flex-col justify-end p-8 sm:p-12 text-white border-r border-blue-400/20">
        
        {/* Uploaded Campus Heritage Building Photograph with Subtle Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/admin-login-hero.jpg"
            alt="St. Philomena's College Heritage Campus Building"
            className="w-full h-full object-cover filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/90 via-[#071A33]/20 to-transparent"></div>
        </div>

        {/* Minimal Bottom-Left Institutional Identification */}
        <div className="relative z-10 space-y-0.5">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-wide drop-shadow-md">
            St. Philomena's College
          </h2>
          <p className="text-xs text-[#FFD84A] font-semibold tracking-wider uppercase drop-shadow-md">
            (Autonomous), Mysuru
          </p>
        </div>

      </div>

      {/* 2. RIGHT PANEL (~45% WIDTH) — CLEAN WHITE AUTHENTICATION FORM */}
      <div className="login-right-panel md:w-[45%] bg-white flex flex-col justify-between p-8 sm:p-14 text-[#071A33] overflow-y-auto">
        
        {/* Top Header */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFC928]"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#071A33]">Admin Portal</span>
            </div>
            <Link to="/" className="text-xs font-bold text-blue-700 hover:underline flex items-center group">
              <ArrowLeft className="w-3.5 h-3.5 mr-1 group-hover:-translate-x-1 transition-transform" />
              <span>Back to College Website</span>
            </Link>
          </div>

          <div className="space-y-2">
            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#071A33]">Welcome Back</h2>
            <p className="text-xs text-slate-600">Sign in to manage St. Philomena's College digital content & CMS data layer.</p>
          </div>
        </div>

        {/* Form Controls */}
        <div className="my-8 space-y-6">
          
          {/* Primary Outlined Google Sign-In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 border border-slate-300 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-50 hover:border-[#1C5496] transition-all flex items-center justify-center space-x-3 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or email credentials</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Administrator Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071A33] font-semibold focus:outline-none focus:border-[#1C5496] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#071A33] font-semibold focus:outline-none focus:border-[#1C5496] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-300 text-[#1C5496] focus:ring-[#1C5496]"
                />
                <span className="text-slate-600 font-medium">Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to admin email."); }} className="font-bold text-blue-700 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3 rounded-xl text-xs font-bold text-[#071A33] shadow-md flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In to CMS Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="border-t pt-4 text-[11px] text-slate-500 flex justify-between items-center">
          <p>© {new Date().getFullYear()} St. Philomena's College (Autonomous), Mysuru</p>
          <Link to="/contact" className="hover:text-blue-700 hover:underline">Contact Us</Link>
        </div>

      </div>

    </div>
  );
}
