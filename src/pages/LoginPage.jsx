import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { gsap } from '../animations/gsapConfig';

const CAMPUS_SLIDES = [
  {
    image: '/assets/images/college_login_hero.jpg',
    badge: 'Heritage Campus',
    title: "St. Philomena's Heritage",
    subtitle: 'Autonomous Institution • Est. 1946',
    authorName: 'Rev. Dr. Bernard Prakash',
    authorRole: 'Rector & Principal',
    authorAvatar: '/media/faculty/fac_dr_issac_george.jpg',
    bgPosition: 'center 40%'
  },
  {
    image: '/assets/images/college_login_bg.jpg',
    badge: 'Autonomous Campus',
    title: 'Main Academic Building',
    subtitle: 'Centre for Academic Excellence',
    authorName: "Dr. Ravi J. D'Souza",
    authorRole: 'Academic Dean & IQAC',
    authorAvatar: '/media/faculty/fac_mr_roshan_roy_dsouza.jpg',
    bgPosition: 'center'
  },
  {
    image: '/media/gallery/campus/campus_quadrangle_main.jpg',
    badge: 'Campus Quadrangle',
    title: 'Historic Quadrangle Complex',
    subtitle: 'Re-accredited with NAAC A+ Grade',
    authorName: 'Prof. Ronald Roche',
    authorRole: 'Controller of Examinations',
    authorAvatar: '/media/faculty/fac_dr_sachin_c_n.jpg',
    bgPosition: 'center'
  },
  {
    image: '/media/gallery/campus/heritage_campus_main.jpg',
    badge: 'Main Heritage Block',
    title: 'Gothic Architectural Wonder',
    subtitle: 'Centre for Academic Excellence',
    authorName: 'Prof. Ronald Roche',
    authorRole: 'Controller of Examinations',
    authorAvatar: '/media/faculty/fac_dr_sachin_c_n.jpg',
    bgPosition: 'center'
  },
  {
    image: '/media/gallery/campus/campus_admin_block.jpg',
    badge: 'Administrative & COE Block',
    title: 'Autonomous Exam Portal',
    subtitle: 'Centre for Continuous Assessment',
    authorName: 'Dr. Poornima',
    authorRole: 'Dean of Research & PG',
    authorAvatar: '/media/faculty/fac_dr_poornima_head_dept_of_hindi.jpeg',
    bgPosition: 'center'
  },
  {
    image: '/media/gallery/campus/campus_chapel.jpg',
    badge: 'Prayer Sanctuary',
    title: 'Sacred Heart Chapel',
    subtitle: 'Spiritual Haven of Peace & Reflection',
    authorName: 'Rev. Fr. Maria Xavier',
    authorRole: 'Campus Minister',
    authorAvatar: '/media/faculty/fac_dr_issac_george.jpg',
    bgPosition: 'center'
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef(null);

  const from = location.state?.from?.pathname || '/admin';

  // Prevent scrollbar on body during login
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Entrance GSAP animation
  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.login-card-container',
        { opacity: 0, scale: 0.96, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.login-left-content',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.7, delay: 0.2, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.login-form-content',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.7, delay: 0.3, ease: 'power2.out' }
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleGoogleLogin = () => {
    setError('Institutional Google Workspace SSO requires administrator configuration. Please sign in using your portal credentials.');
  };

  const currentSlide = CAMPUS_SLIDES[currentSlideIndex];

  return (
    <div 
      ref={cardRef} 
      className="h-screen max-h-screen w-full flex items-center justify-center p-3 sm:p-5 relative overflow-hidden font-sans select-none"
    >
      {/* 1. FULL-PAGE HD COLLEGE PHOTO BACKGROUND (IMAGE 2) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-100"
        style={{ 
          backgroundImage: `url('/assets/images/college_login_bg.jpg')`,
          backgroundPosition: 'center 42%'
        }}
      />
      {/* Transparent overlay without any blur for 100% HD sharpness and clarity */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      {/* Back to website shortcut (Top Left Floating) */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 sm:top-6 sm:left-8 z-30 inline-flex items-center space-x-2 text-xs font-semibold text-white bg-black/40 hover:bg-black/60 backdrop-blur-md px-4 py-2 rounded-full transition-all border border-white/30 shadow-lg"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Back to College Website</span>
        <span className="sm:hidden">Back</span>
      </Link>

      {/* 2. MAIN FLOATING HERO CARD (Rounded Card container) */}
      <div className="login-card-container relative z-10 w-full max-w-md md:max-w-3xl lg:max-w-[960px] max-h-[92vh] bg-white rounded-[2rem] sm:rounded-[2.5rem] p-3 sm:p-3.5 shadow-2xl border border-white/30 flex flex-col md:flex-row overflow-hidden my-auto">
        
        {/* ================= LEFT VISUAL HERO (COLLEGE PHOTO CARD) ================= */}
        <div className="relative hidden md:flex md:w-1/2 min-h-[460px] lg:min-h-[520px] rounded-[1.6rem] sm:rounded-[2.2rem] overflow-hidden flex-col justify-center p-6 sm:p-8 text-white select-none shadow-inner group">
          
          {/* Active College Photograph with smooth crossfade */}
          <div 
            key={currentSlide.image}
            className="absolute inset-0 bg-cover transition-all duration-700 ease-out transform scale-100 group-hover:scale-105"
            style={{ 
              backgroundImage: `url('${currentSlide.image}')`,
              backgroundPosition: currentSlide.bgPosition || 'center'
            }}
          />

          {/* Deep Cinematic Warm Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30" />

          {/* CENTER BRAND EMBLEM */}
          <div className="relative z-10 my-auto text-center flex flex-col items-center justify-center space-y-3 px-4">
            
            {/* Crest Emblem - Small, White, with Minimal Subtle Glow */}
            <div className="relative group/logo shrink-0">
              {/* Minimal subtle white aura */}
              <div 
                className="absolute -inset-1 rounded-2xl blur-md opacity-60 group-hover/logo:opacity-90 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
                }}
              />
              
              {/* Compact Frosted Glass Capsule */}
              <div 
                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center p-2.5 transition-all duration-300 group-hover/logo:scale-105 shadow-md"
                style={{
                  boxShadow: '0 0 14px rgba(255, 255, 255, 0.2), inset 0 0 8px rgba(255, 255, 255, 0.25)'
                }}
              >
                {/* Small White Glowing College Crest */}
                <img 
                  src="/assets/images/logo/crest_gold_hd.png" 
                  alt="St. Philomena's College Crest" 
                  className="w-full h-full object-contain brightness-0 invert opacity-95 transition-all duration-300"
                  style={{
                    filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.35))'
                  }}
                  onError={(e) => {
                    e.target.src = '/assets/college-header-logo.png';
                  }}
                />
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1.5 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-lg text-white font-sans">
                <span className="text-[#FF8A3D]">St.</span>
                <span>Philomena's</span>
              </div>
              <p className="text-xs sm:text-[13px] font-semibold tracking-wider text-amber-200/90 uppercase drop-shadow-md font-mono">
                {currentSlide.subtitle}
              </p>
            </div>
          </div>

        </div>

        {/* ================= RIGHT FORM PANEL (AUTHENTICATION) ================= */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-white text-slate-800">
          
          <div className="login-form-content max-w-sm sm:max-w-md mx-auto w-full space-y-6">
            
            {/* Top Brand Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F2856] to-[#1E56B4] p-2 shadow-xs flex items-center justify-center shrink-0">
                <img 
                  src="/assets/images/logo/crest_gold_hd.png" 
                  alt="St. Philomena's College Crest" 
                  className="w-full h-full object-contain filter drop-shadow-xs"
                  onError={(e) => {
                    e.target.src = '/assets/college-header-logo.png';
                  }}
                />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold font-serif text-[#0B1F4E] leading-tight tracking-tight">
                  St. Philomena's College
                </h2>
                <p className="text-[10px] font-bold tracking-widest text-[#C9A84C] uppercase font-mono">
                  Autonomous • Mysuru
                </p>
              </div>
            </div>

            {/* Greeting Header */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-[30px] font-extrabold text-[#111827] tracking-tight leading-tight">
                Sign In
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Access your administrative portal & dashboard
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold animate-shake">
                {error}
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Email Input */}
              <div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all shadow-2xs"
                />
              </div>

              {/* Password Input with Show/Hide toggle */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-4 pr-11 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot password link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => alert("Password reset instructions have been forwarded to the system administrator.")}
                  className="text-xs font-semibold text-[#E85D43] hover:underline cursor-pointer transition-colors"
                >
                  Forgot password ?
                </button>
              </div>

              {/* "or" Divider */}
              <div className="relative flex items-center py-1.5">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-xs text-slate-400 font-medium">or</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              {/* Google SSO Button (Royal Blue button with Google G icon) */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 sm:py-3 px-4 bg-[#1D58B5] hover:bg-[#184693] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2.5 cursor-pointer active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Login with Google</span>
              </button>

              {/* Primary Submit Button (Vibrant Coral Red/Orange button) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-3 px-4 bg-[#E85D43] hover:bg-[#D54D34] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-[0.99] disabled:opacity-75"
              >
                {loading ? 'Signing In...' : 'Login'}
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-xs text-slate-600 pt-1">
                Don't have an account?{' '}
                <Link to="/admissions" className="text-[#E85D43] font-bold hover:underline ml-0.5">
                  Sign Up
                </Link>
              </p>

              {/* Social Media Circular Icons */}
              <div className="pt-2 flex items-center justify-center space-x-3">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full border border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all hover:bg-slate-50 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="w-8 h-8 rounded-full border border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all hover:bg-slate-50 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full border border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all hover:bg-slate-50 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full border border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all hover:bg-slate-50 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
