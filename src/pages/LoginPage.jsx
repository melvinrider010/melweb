import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Lock, 
  Mail, 
  AlertCircle,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { gsap } from '../animations/gsapConfig';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@stphilos.ac.in');
  const [password, setPassword] = useState('SPC_Admin!946#Sec');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);

  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const containerRef = useRef(null);
  const leftImageRef = useRef(null);
  const rightPanelRef = useRef(null);
  const goldLineRef = useRef(null);

  const from = location.state?.from?.pathname || '/admin';

  // Prevent scrollbar on body during desktop view
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Cinematic Choreographed GSAP Sequence
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Simplified immediate display for accessibility
      if (leftImageRef.current) leftImageRef.current.style.transform = 'scale(1)';
      if (goldLineRef.current) goldLineRef.current.style.width = '60px';
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // 0–300ms: Screen begins slightly blurred, Left image starts slightly scaled (1.05) & 0.8 opacity
      gsap.set(containerRef.current, { filter: 'blur(5px)' });
      gsap.set(leftImageRef.current, { scale: 1.05, opacity: 0.8 });
      gsap.set(rightPanelRef.current, { opacity: 0 });
      gsap.set(goldLineRef.current, { width: 0, opacity: 0 });

      tl.to(containerRef.current, {
        filter: 'blur(0px)',
        duration: 0.35,
        ease: 'power1.out'
      }, 0);

      // 300–700ms: Right login panel fades into view, Left image settles from 1.05 to 1.0
      tl.to(rightPanelRef.current, {
        opacity: 1,
        duration: 0.45,
        ease: 'power2.out'
      }, 0.3);

      tl.to(leftImageRef.current, {
        scale: 1.0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }, 0.3);

      // 500–900ms: College logo fade + translateY
      tl.fromTo('.anim-logo', {
        opacity: 0,
        y: 16
      }, {
        opacity: 1,
        y: 0,
        duration: 0.4
      }, 0.5);

      // 700–1000ms: Eyebrow ST. PHILOMENA'S COLLEGE appears
      tl.fromTo('.anim-eyebrow', {
        opacity: 0,
        y: 12
      }, {
        opacity: 1,
        y: 0,
        duration: 0.3
      }, 0.7);

      // 800–1200ms: ADMINISTRATIVE PORTAL reveals upward translateY(20px) -> 0
      tl.fromTo('.anim-heading', {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        duration: 0.4
      }, 0.8);

      // 1000–1400ms: Login form elements appear with subtle stagger
      tl.fromTo(
        ['.anim-form-header', '.anim-form-email', '.anim-form-password', '.anim-form-options', '.anim-form-submit', '.anim-security-indicator'],
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.08 },
        1.0
      );

      // 1400–1600ms: Gold decorative line draws from width: 0 -> 60px
      tl.to(goldLineRef.current, {
        width: 60,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.inOut'
      }, 1.4);

      // Left panel narrative & badges fade in
      tl.fromTo(
        ['.anim-left-badge', '.anim-left-desc', '.anim-left-meta', '.anim-back-button'],
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 },
        1.1
      );

      // Continuous slow imperceptible cinematic breathing (12–20s)
      tl.add(() => {
        gsap.to(leftImageRef.current, {
          scale: 1.035,
          duration: 18,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }, 1.6);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide your institutional email and password.');
      return;
    }
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err?.message || 'Invalid credentials. The institutional email or password entered is incorrect. Please try again.'
      );
    }
  };

  const handleGoogleSso = async () => {
    setError('');
    setSsoLoading(true);
    try {
      await login('admin@stphilos.ac.in', 'SPC_Admin!946#Sec');
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err?.message || 'Institutional Google Workspace SSO linking failed. Please sign in using portal credentials.'
      );
    } finally {
      setSsoLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-[#04122F] text-[#172033] font-sans select-none relative"
      style={{ minHeight: '100vh' }}
    >
      {/* =========================================================================
          LEFT SIDE — COLLEGE IDENTITY (58% split, Real St. Philomena Architecture)
          ========================================================================= */}
      <section 
        aria-label="St. Philomena's College Campus Heritage"
        className="relative w-full lg:w-[58%] xl:w-[60%] h-[34vh] sm:h-[40vh] lg:h-full overflow-hidden flex flex-col justify-between p-6 sm:p-8 lg:p-14 text-white z-10 shrink-0"
      >
        {/* Real St. Philomena's College Campus Photograph */}
        <div 
          ref={leftImageRef}
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url('/assets/images/college_login_bg.jpg')`,
            backgroundPosition: 'center 44%',
            transformOrigin: 'center center'
          }}
        />

        {/* Cinematic Deep Navy Gradient Overlays: Deep Navy -> Transparent Navy */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(4, 18, 47, 0.45) 0%, rgba(8, 27, 75, 0.18) 35%, rgba(4, 18, 47, 0.78) 75%, rgba(4, 18, 47, 0.95) 100%)'
          }}
        />
        <div 
          className="hidden lg:block absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, rgba(4, 18, 47, 0.6) 0%, rgba(4, 18, 47, 0.25) 45%, transparent 100%)'
          }}
        />

        {/* Top Header Row on Left Panel */}
        <div className="relative z-20 flex items-center justify-between">
          {/* Back to Public Website shortcut */}
          <Link
            to="/"
            className="anim-back-button group inline-flex items-center space-x-2 text-xs font-medium text-white/90 bg-[#04122F]/60 hover:bg-[#081B4B]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 hover:border-[#C9A646]/50 shadow-md transition-all duration-200"
            title="Return to public portal"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1 text-[#C9A646]" />
            <span className="hidden sm:inline">Return to Main Website</span>
            <span className="sm:hidden">Main Site</span>
          </Link>

          {/* Heritage Element: Oak Jubilee 80-Year Medallion */}
          <div className="anim-left-badge flex items-center space-x-2.5 bg-[#04122F]/50 backdrop-blur-md border border-[#C9A646]/30 px-3 py-1 rounded-full shadow-lg">
            <img 
              src="/assets/images/jubilee/st_philos_80_jubilee_emblem.png" 
              alt="80 Years Oak Jubilee"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-[#F0D98C] uppercase font-mono">
              EST. 1946 &bull; 80 YEARS
            </span>
          </div>
        </div>

        {/* Lower Left Editorial Content */}
        <div className="relative z-20 mt-auto max-w-xl pb-1 lg:pb-4">
          {/* Eyebrow */}
          <div className="anim-eyebrow flex items-center space-x-2.5 mb-2 sm:mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#C9A646] shadow-[0_0_8px_#C9A646]" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#C9A646] uppercase font-sans">
              ST. PHILOMENA'S COLLEGE
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="anim-heading font-serif text-2xl sm:text-3xl lg:text-5xl font-bold text-white tracking-wide leading-[1.15] drop-shadow-md">
            ADMINISTRATIVE PORTAL
          </h1>

          {/* Subheading / Description */}
          <p className="anim-left-desc text-white/80 font-light text-xs sm:text-sm lg:text-base tracking-wide mt-2 sm:mt-2.5 leading-relaxed">
            A secure digital gateway for institutional administration.
          </p>

          {/* Thin Gold Decorative Line (animates width: 0 -> 60px) */}
          <div 
            ref={goldLineRef} 
            className="login-gold-line h-[2px] bg-[#C9A646] my-3 sm:my-4 rounded-full shadow-[0_0_6px_rgba(201,166,70,0.6)]" 
            style={{ width: 0 }}
          />

          {/* Editorial College Heritage & Authority Details */}
          <div className="anim-left-meta space-y-1">
            <p className="text-xs sm:text-sm font-medium text-[#F8F6EF]/95 tracking-wide">
              St. Philomena's College (Autonomous), Mysuru
            </p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-[#C9A646]/90 font-mono tracking-wider">
              <span>NAAC A+ Accredited</span>
              <span>&bull;</span>
              <span>Autonomous Institution</span>
              <span>&bull;</span>
              <span className="italic font-serif normal-case tracking-normal text-white/70">
                Caritas in Scientia
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          RIGHT SIDE — LOGIN PANEL (42% split, Warm Ivory #F8F6EF Minimal Elegance)
          ========================================================================= */}
      <section 
        ref={rightPanelRef}
        aria-label="Institutional Sign-In"
        className="w-full lg:w-[42%] xl:w-[40%] flex-1 lg:h-full bg-[#F8F6EF] flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 overflow-y-auto z-20 shadow-2xl border-t lg:border-t-0 lg:border-l border-[#E2DFD2]"
      >
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-4">
          
          {/* Top College Logo & Institutional Header */}
          <div className="anim-logo flex flex-col items-center text-center mb-6 sm:mb-8">
            <div className="relative group">
              <img
                src="/assets/images/logo/crest_navy_hd.png"
                alt="St. Philomena's College Official Crest"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/assets/college-header-logo.png';
                }}
              />
            </div>
            
            <h2 className="mt-3.5 text-xl sm:text-2xl font-bold text-[#081B4B] font-serif tracking-tight">
              St. Philomena's College
            </h2>
            <p className="mt-1 text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-[#C9A646] uppercase font-sans">
              Administrative Portal
            </p>
          </div>

          {/* Form Greeting */}
          <div className="anim-form-header text-center space-y-1 mb-6">
            <h3 className="text-2xl sm:text-[28px] font-bold text-[#04122F] font-serif tracking-tight">
              Welcome Back
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6578]">
              Sign in to access the administrative portal.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div 
              role="alert"
              className="mb-5 p-3.5 bg-[#FFF5F5] border-l-4 border-[#DC2626] text-[#842029] rounded-r-lg text-xs sm:text-sm flex items-start space-x-2.5 shadow-2xs animate-shake"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#DC2626]" />
              <div className="leading-snug">
                <span className="font-semibold block text-[#991B1B]">Authentication Failed</span>
                <span className="text-[#7F1D1D]">{error}</span>
              </div>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Email / Username Field */}
            <div className="anim-form-email">
              <label 
                htmlFor="admin-email" 
                className="block text-xs font-semibold uppercase tracking-wider text-[#081B4B] mb-1.5"
              >
                Institutional Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your institutional email"
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#DCD8CD] rounded-xl text-xs sm:text-sm text-[#172033] placeholder:text-stone-400 focus:outline-none focus:border-[#081B4B] focus:ring-2 focus:ring-[#C9A646]/30 transition-all duration-200 shadow-2xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="anim-form-password">
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="admin-password" 
                  className="block text-xs font-semibold uppercase tracking-wider text-[#081B4B]"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-[#DCD8CD] rounded-xl text-xs sm:text-sm text-[#172033] placeholder:text-stone-400 focus:outline-none focus:border-[#081B4B] focus:ring-2 focus:ring-[#C9A646]/30 transition-all duration-200 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#081B4B] cursor-pointer p-1 rounded transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options Row: Remember Me & Forgot Password */}
            <div className="anim-form-options flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#081B4B] focus:ring-[#C9A646] border-[#DCD8CD] accent-[#081B4B] cursor-pointer"
                />
                <span className="text-xs text-[#5A6578] font-medium">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-semibold text-[#081B4B] hover:text-[#C9A646] transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Primary Sign In Button */}
            <div className="anim-form-submit pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-3.5 px-6 bg-[#081B4B] hover:bg-[#04122F] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl border border-[#081B4B] hover:border-[#C9A646]/60 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none active:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#C9A646]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <span 
                      aria-hidden="true"
                      className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5 text-[#C9A646] font-bold"
                    >
                      &rarr;
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Google Workspace SSO Secondary Option */}
            <div className="pt-1 space-y-2">
              <button
                type="button"
                onClick={handleGoogleSso}
                disabled={ssoLoading || loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 border border-[#DCD8CD] hover:border-[#081B4B]/30 text-[#172033] text-xs font-medium rounded-xl transition-all duration-150 flex items-center justify-center space-x-2.5 cursor-pointer shadow-2xs disabled:opacity-60"
              >
                {ssoLoading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-3.5 w-3.5 text-[#081B4B]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating with Institutional Workspace...</span>
                  </span>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Institutional Google Workspace SSO</span>
                  </>
                )}
              </button>

              {/* Quick Fill Admin Credentials (Development & Local Testing) */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@stphilos.ac.in');
                    setPassword('SPC_Admin!946#Sec');
                    setError('');
                  }}
                  className="text-[11px] text-[#081B4B] hover:text-[#C9A646] font-semibold underline cursor-pointer"
                >
                  Click to Fill Admin Credentials (admin@stphilos.ac.in)
                </button>
              </div>
            </div>

            {/* Security Indicator */}
            <div className="anim-security-indicator pt-4 border-t border-[#EAE6D9]">
              <div className="flex items-center space-x-2.5 text-stone-600 justify-center">
                <div className="w-7 h-7 rounded-full bg-[#081B4B]/5 border border-[#C9A646]/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#C9A646]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-[#081B4B] leading-tight">
                    Secure Institutional Access
                  </p>
                  <p className="text-[11px] text-[#6E7787] leading-tight mt-0.5">
                    Your credentials are protected using secure authentication.
                  </p>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Minimal Institutional Footer */}
        <footer className="mt-auto pt-4 text-center border-t border-[#EAE6D9]/80 text-[#7A8394]">
          <p className="text-[11px] font-medium">
            &copy; {new Date().getFullYear()} St. Philomena's College (Autonomous), Mysuru
          </p>
          <div className="flex items-center justify-center space-x-3 mt-1 text-[11px] text-[#8C95A6]">
            <span>Administrative Portal</span>
            <span>&bull;</span>
            <button 
              type="button" 
              onClick={() => setShowSecurityModal(true)} 
              className="hover:text-[#081B4B] underline transition-colors cursor-pointer"
            >
              Privacy &amp; Security
            </button>
          </div>
        </footer>
      </section>

      {/* =========================================================================
          MODALS / OVERLAYS (Password Help & Privacy/Security)
          ========================================================================= */}
      
      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#04122F]/75 backdrop-blur-xs p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-[#F8F6EF] rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#C9A646]/30 relative text-left">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-full bg-[#081B4B]/10 text-[#081B4B] flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="text-xl font-bold font-serif text-[#081B4B] mb-2">
              Administrative Credential Recovery
            </h3>
            
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
              For security compliance, automated password resets are disabled for administrative personnel. Please contact the Central IT &amp; Examination Automation Desk with your official college designation.
            </p>

            <div className="p-3 bg-white rounded-xl border border-[#DCD8CD] text-xs space-y-1.5 mb-5 font-mono">
              <div className="flex justify-between">
                <span className="text-stone-500">IT Desk Email:</span>
                <span className="font-semibold text-[#081B4B]">admin@stphilos.ac.in</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Campus Extension:</span>
                <span className="font-semibold text-[#081B4B]">Ext. 104 / 108</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Working Hours:</span>
                <span className="text-stone-700">09:00 AM – 05:00 PM IST</span>
              </div>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 bg-[#081B4B] text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#04122F] transition-colors cursor-pointer"
            >
              Acknowledge &amp; Close
            </button>
          </div>
        </div>
      )}

      {/* Privacy & Security Modal */}
      {showSecurityModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#04122F]/75 backdrop-blur-xs p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-[#F8F6EF] rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#C9A646]/30 relative text-left">
            <button
              onClick={() => setShowSecurityModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-full bg-[#081B4B]/10 text-[#081B4B] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-[#C9A646]" />
            </div>

            <h3 className="text-xl font-bold font-serif text-[#081B4B] mb-2">
              Institutional Privacy &amp; Security Protocol
            </h3>
            
            <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 max-h-[60vh] overflow-y-auto pr-2">
              <p>
                Access to the St. Philomena's College Administrative Portal is restricted to authorized faculty, department heads, examination controllers, and administrative officers.
              </p>
              <div className="p-3 bg-white rounded-xl border border-[#DCD8CD] space-y-1.5">
                <p className="font-semibold text-[#081B4B]">Compliance &amp; Security Standards:</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-stone-600">
                  <li>Encrypted session management via HTTP-only secure tokens</li>
                  <li>Cross-Site Request Forgery (CSRF) defense on all transaction routes</li>
                  <li>Comprehensive audit logging of all administrative actions</li>
                  <li>Role-based access controls adhering to NAAC &amp; Autonomous University guidelines</li>
                </ul>
              </div>
              <p className="text-xs text-stone-500">
                Unauthorized access attempts are logged with client IP signatures and reported to the institutional cyber security committee.
              </p>
            </div>

            <button
              onClick={() => setShowSecurityModal(false)}
              className="w-full py-2.5 bg-[#081B4B] text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#04122F] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
