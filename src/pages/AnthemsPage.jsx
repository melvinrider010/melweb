import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  FileText, 
  ExternalLink, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  BookOpen, 
  Flag,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { animatePageIn } from '../animations/pageTransitions';

export default function AnthemsPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    animatePageIn(containerRef);
  }, []);

  // Audio players state
  const [philoPlaying, setPhiloPlaying] = useState(false);
  const [philoCurrentTime, setPhiloCurrentTime] = useState(0);
  const [philoDuration, setPhiloDuration] = useState(0);
  const [philoMuted, setPhiloMuted] = useState(false);
  const philoAudioRef = useRef(null);

  const [activeNationalTrack, setActiveNationalTrack] = useState('state'); // 'state' | 'national'
  const [nationalPlaying, setNationalPlaying] = useState(false);
  const [nationalCurrentTime, setNationalCurrentTime] = useState(0);
  const [nationalDuration, setNationalDuration] = useState(0);
  const [nationalMuted, setNationalMuted] = useState(false);
  const nationalAudioRef = useRef(null);

  // Tabs for lyrics viewing
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'philo' | 'national'
  const [showLyricsPhilo, setShowLyricsPhilo] = useState(true);
  const [showLyricsNational, setShowLyricsNational] = useState(true);

  // Philo audio handlers
  const togglePlayPhilo = () => {
    if (!philoAudioRef.current) return;
    if (philoPlaying) {
      philoAudioRef.current.pause();
      setPhiloPlaying(false);
    } else {
      // Pause other player if playing
      if (nationalAudioRef.current && nationalPlaying) {
        nationalAudioRef.current.pause();
        setNationalPlaying(false);
      }
      philoAudioRef.current.play().catch(() => {});
      setPhiloPlaying(true);
    }
  };

  const handlePhiloTimeUpdate = () => {
    if (philoAudioRef.current) {
      setPhiloCurrentTime(philoAudioRef.current.currentTime);
    }
  };

  const handlePhiloLoadedMetadata = () => {
    if (philoAudioRef.current) {
      setPhiloDuration(philoAudioRef.current.duration);
    }
  };

  const handlePhiloSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (philoAudioRef.current) {
      philoAudioRef.current.currentTime = time;
      setPhiloCurrentTime(time);
    }
  };

  const togglePhiloMute = () => {
    if (philoAudioRef.current) {
      philoAudioRef.current.muted = !philoMuted;
      setPhiloMuted(!philoMuted);
    }
  };

  const restartPhilo = () => {
    if (philoAudioRef.current) {
      philoAudioRef.current.currentTime = 0;
      setPhiloCurrentTime(0);
      if (!philoPlaying) {
        philoAudioRef.current.play().catch(() => {});
        setPhiloPlaying(true);
      }
    }
  };

  // National audio handlers
  const nationalTracks = {
    state: {
      title: 'State Anthem (Naada Geethe)',
      subtitle: 'Jaya Bharatha Jananiya Tanujate · ಜಯ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ',
      composer: 'Rashtrakavi Kuvempu',
      src: '/anthems/01-JAYA-BHARATHA-JANANIYA.mp3',
      filename: '01-JAYA-BHARATHA-JANANIYA.mp3'
    },
    national: {
      title: 'Indian National Anthem',
      subtitle: 'Jana Gana Mana · ಜನ ಗಣ ಮನ',
      composer: 'Gurudev Rabindranath Tagore',
      src: '/anthems/Indian-National-Anthem.mp3',
      filename: 'Indian-National-Anthem.mp3'
    }
  };

  const currentNational = nationalTracks[activeNationalTrack];

  const switchNationalTrack = (trackKey) => {
    if (trackKey === activeNationalTrack) return;
    if (nationalAudioRef.current) {
      nationalAudioRef.current.pause();
    }
    setActiveNationalTrack(trackKey);
    setNationalPlaying(false);
    setNationalCurrentTime(0);
  };

  const togglePlayNational = () => {
    if (!nationalAudioRef.current) return;
    if (nationalPlaying) {
      nationalAudioRef.current.pause();
      setNationalPlaying(false);
    } else {
      // Pause other player if playing
      if (philoAudioRef.current && philoPlaying) {
        philoAudioRef.current.pause();
        setPhiloPlaying(false);
      }
      nationalAudioRef.current.play().catch(() => {});
      setNationalPlaying(true);
    }
  };

  const handleNationalTimeUpdate = () => {
    if (nationalAudioRef.current) {
      setNationalCurrentTime(nationalAudioRef.current.currentTime);
    }
  };

  const handleNationalLoadedMetadata = () => {
    if (nationalAudioRef.current) {
      setNationalDuration(nationalAudioRef.current.duration);
    }
  };

  const handleNationalSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (nationalAudioRef.current) {
      nationalAudioRef.current.currentTime = time;
      setNationalCurrentTime(time);
    }
  };

  const toggleNationalMute = () => {
    if (nationalAudioRef.current) {
      nationalAudioRef.current.muted = !nationalMuted;
      setNationalMuted(!nationalMuted);
    }
  };

  const restartNational = () => {
    if (nationalAudioRef.current) {
      nationalAudioRef.current.currentTime = 0;
      setNationalCurrentTime(0);
      if (!nationalPlaying) {
        nationalAudioRef.current.play().catch(() => {});
        setNationalPlaying(true);
      }
    }
  };

  // Helper formatting for timestamps
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 text-[#071A33]">
      
      {/* 1. BREADCRUMBS BAR */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-8">
        <div className="max-w-[1400px] mx-auto flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-[#1C5496] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/about" className="hover:text-[#1C5496] transition-colors">About Us</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#1C5496] font-bold">Anthems</span>
        </div>
      </div>

      {/* 2. HERO / INSTITUTIONAL BANNER */}
      <section className="bg-gradient-to-r from-[#071A33] via-[#0F3B70] to-[#1C5496] text-white py-12 px-4 sm:px-8 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD84A]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-[#FFD84A] border border-white/15">
            <Music className="w-3.5 h-3.5 text-[#FFD84A]" />
            <span>Heritage & Institutional Traditions</span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            Institutional & National Anthems
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed">
            The hymns and anthems embodying the founding vision of St. Philomena's College (Autonomous), Mysuru, celebrating brotherhood, enlightenment, ethical purpose, and patriotism.
          </p>

          <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-slate-300">
            <span className="flex items-center space-x-1.5 bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD84A]" />
              <span>Motto: <em className="text-[#FFD84A] font-serif not-italic">Caritas in Scientia</em> (Love and Knowledge)</span>
            </span>
            <span className="flex items-center space-x-1.5 bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Established 1946 · Mysuru</span>
            </span>
          </div>
        </div>
      </section>

      {/* 3. MAIN RESOURCE CARDS CONTAINER */}
      <main className="max-w-[1400px] mx-auto py-10 px-4 sm:px-8 space-y-10">
        
        {/* Navigation Tabs / Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#071A33] text-[#FFD84A] shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Anthems
            </button>
            <button
              onClick={() => setActiveTab('philo')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'philo'
                  ? 'bg-[#071A33] text-[#FFD84A] shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Philo's College Anthem
            </button>
            <button
              onClick={() => setActiveTab('national')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'national'
                  ? 'bg-[#071A33] text-[#FFD84A] shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              National & State Anthems
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            2 Official Media Collections · Local Institutional Repository
          </div>
        </div>

        {/* RESOURCE CARDS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* CARD 1: PHILO'S ANTHEM */}
          {/* ======================================================== */}
          {(activeTab === 'all' || activeTab === 'philo') && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md border-t-4 border-t-[#1C5496]">
              
              {/* Card Header */}
              <div className="p-6 sm:p-7 space-y-3 bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#1C5496] border border-blue-200/60 uppercase tracking-wider">
                    <Music className="w-3 h-3 mr-1.5 text-[#1C5496]" />
                    Institutional Anthem
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    MP3 Audio & Lyrics
                  </span>
                </div>

                <div>
                  <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
                    Philo's College Anthem
                  </h2>
                  <p className="text-xs font-semibold text-[#1C5496] mt-0.5">
                    "As Philomenites We Sing" · Official Alma Mater Song
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The inspiring collegiate hymn of St. Philomena's College, sung by generations of students and faculty since 1946. It celebrates the guiding motto <strong className="text-slate-800 font-semibold">"Caritas in Scientia"</strong> (Knowledge with Love) and spreading enlightenment across the globe.
                </p>
              </div>

              {/* Card Body: HTML5 Audio Player */}
              <div className="p-6 sm:p-7 space-y-5 bg-white flex-1">
                
                {/* Hidden Native Audio Element */}
                <audio
                  ref={philoAudioRef}
                  src="/anthems/AUD-20240111-WA0003.mp3"
                  onTimeUpdate={handlePhiloTimeUpdate}
                  onLoadedMetadata={handlePhiloLoadedMetadata}
                  onEnded={() => setPhiloPlaying(false)}
                  preload="metadata"
                />

                {/* Custom Stylized Audio Player Interface */}
                <div className="bg-[#071A33] text-white p-5 rounded-xl space-y-4 shadow-inner">
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${philoPlaying ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
                      <span className="font-mono text-slate-300">
                        {philoPlaying ? 'Playing Audio' : 'Ready to Play'}
                      </span>
                    </div>
                    <span className="font-mono text-[#FFD84A] font-bold">
                      {formatTime(philoCurrentTime)} / {formatTime(philoDuration || 150)}
                    </span>
                  </div>

                  {/* Seekbar */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="0"
                      max={philoDuration || 150}
                      step="0.1"
                      value={philoCurrentTime}
                      onChange={handlePhiloSeek}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FFD84A]"
                      aria-label="Seek Philo's Anthem audio"
                    />
                  </div>

                  {/* Player Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={togglePlayPhilo}
                        className="btn-gold p-3 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
                        aria-label={philoPlaying ? "Pause Philo's Anthem" : "Play Philo's Anthem"}
                        title={philoPlaying ? "Pause" : "Play"}
                      >
                        {philoPlaying ? (
                          <Pause className="w-5 h-5 text-[#071A33] fill-[#071A33]" />
                        ) : (
                          <Play className="w-5 h-5 text-[#071A33] fill-[#071A33] ml-0.5" />
                        )}
                      </button>

                      <button
                        onClick={restartPhilo}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                        title="Replay from beginning"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Restart</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={togglePhiloMute}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title={philoMuted ? "Unmute" : "Mute"}
                        aria-label={philoMuted ? "Unmute" : "Mute"}
                      >
                        {philoMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#FFD84A]" />}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Primary Actions: Play & View / Open in New Tab */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  
                  {/* Action 1: Main Play / Pause Button */}
                  <button
                    onClick={togglePlayPhilo}
                    className="btn-primary-blue px-4 py-2.5 rounded-lg text-xs font-bold inline-flex items-center space-x-2 cursor-pointer shadow-xs"
                  >
                    {philoPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Pause Anthem</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Play Anthem Audio</span>
                      </>
                    )}
                  </button>

                  {/* Action 2: Open Audio In New Browser Tab (No forced download, local only) */}
                  <a
                    href="/anthems/AUD-20240111-WA0003.mp3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-[#1C5496] inline-flex items-center space-x-1.5 transition-colors shadow-xs"
                    title="Open MP3 file in a new browser player tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Audio File ↗</span>
                  </a>

                  {/* Action 3: View Heritage PDF in Browser Viewer */}
                  <a
                    href="/anthems/college-anthem.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 inline-flex items-center space-x-1.5 transition-colors shadow-xs"
                    title="View official College Anthem & Daily Prayer document in browser tab"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>View Heritage PDF ↗</span>
                  </a>

                </div>

                {/* Lyrics Display Accordion / Box */}
                <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
                  <button
                    onClick={() => setShowLyricsPhilo(!showLyricsPhilo)}
                    className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 flex justify-between items-center text-xs font-bold text-slate-800 transition-colors cursor-pointer text-left"
                  >
                    <span className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-[#1C5496]" />
                      <span>Official Anthem Lyrics (English)</span>
                    </span>
                    <span className="text-[11px] text-[#1C5496]">
                      {showLyricsPhilo ? 'Hide Lyrics ▲' : 'Show Lyrics ▼'}
                    </span>
                  </button>

                  {showLyricsPhilo && (
                    <div className="p-5 bg-slate-50/50 space-y-4 text-xs sm:text-sm text-slate-700 font-sans leading-relaxed border-t border-slate-200">
                      <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-3">
                        <p className="font-semibold text-slate-900">
                          As Philomenites we sing, Philomenites we are! <span className="text-slate-400 font-normal">(2)</span><br />
                          Hailing from within and countries afar,<br />
                          As Philomenites we stand, our hearts are high with pride!
                        </p>
                        
                        <p className="italic text-[#1C5496] font-medium border-l-2 border-[#FFD84A] pl-3 py-1">
                          Abundantly, blessed by the almighty God above,<br />
                          "Caritas-in-scientia" — spreading knowledge with love!
                        </p>

                        <p className="font-semibold text-slate-900">
                          The ocean of wisdom, letting tributaries round the world <span className="text-slate-400 font-normal">(2)</span><br />
                          Deep rooted with ethics our motto is unfurled! <span className="text-slate-400 font-normal">(2)</span>
                        </p>

                        <p className="text-slate-800">
                          Just to mere, classroom walls, we're not confined<br />
                          But to leave a mark and to benefit all mankind.<br />
                          We do learn for joy, we learn for life, all that comes on our way<br />
                          To bring a smile on someone's face, each and every day!
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Source: Official MDES Heritage & Anthems Archive</span>
                        <span className="font-mono text-slate-400">AUD-20240111-WA0003.mp3</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* CARD 2: NATIONAL & STATE ANTHEMS */}
          {/* ======================================================== */}
          {(activeTab === 'all' || activeTab === 'national') && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md border-t-4 border-t-[#D4AF37]">
              
              {/* Card Header */}
              <div className="p-6 sm:p-7 space-y-3 bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 uppercase tracking-wider">
                    <Flag className="w-3 h-3 mr-1.5 text-amber-700" />
                    National & State Anthems
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Official MP3 Audio
                  </span>
                </div>

                <div>
                  <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
                    National Anthem & Naada Geethe
                  </h2>
                  <p className="text-xs font-semibold text-amber-800 mt-0.5">
                    Karnataka State Anthem & Indian National Anthem
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  The official national and state anthems rendered during formal assemblies, convocations, national celebrations (Independence Day, Republic Day, and Karnataka Rajyotsava), and institutional ceremonies.
                </p>

                {/* Track Selector Tabs */}
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    onClick={() => switchNationalTrack('state')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeNationalTrack === 'state'
                        ? 'bg-[#071A33] text-[#FFD84A] shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    1. Jaya Bharatha Jananiya (State)
                  </button>
                  <button
                    onClick={() => switchNationalTrack('national')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeNationalTrack === 'national'
                        ? 'bg-[#071A33] text-[#FFD84A] shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    2. Jana Gana Mana (National)
                  </button>
                </div>
              </div>

              {/* Card Body: HTML5 Audio Player for National Tracks */}
              <div className="p-6 sm:p-7 space-y-5 bg-white flex-1">
                
                {/* Active Track Title Display */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-slate-900">{currentNational.title}</h4>
                    <p className="text-[11px] text-slate-500">{currentNational.subtitle}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#1C5496] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {currentNational.composer}
                  </span>
                </div>

                {/* Hidden Native Audio Element */}
                <audio
                  key={currentNational.src}
                  ref={nationalAudioRef}
                  src={currentNational.src}
                  onTimeUpdate={handleNationalTimeUpdate}
                  onLoadedMetadata={handleNationalLoadedMetadata}
                  onEnded={() => setNationalPlaying(false)}
                  preload="metadata"
                />

                {/* Stylized Audio Player Interface */}
                <div className="bg-[#071A33] text-white p-5 rounded-xl space-y-4 shadow-inner">
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${nationalPlaying ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
                      <span className="font-mono text-slate-300">
                        {nationalPlaying ? `Playing: ${currentNational.title}` : 'Ready to Play'}
                      </span>
                    </div>
                    <span className="font-mono text-[#FFD84A] font-bold">
                      {formatTime(nationalCurrentTime)} / {formatTime(nationalDuration || 180)}
                    </span>
                  </div>

                  {/* Seekbar */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="0"
                      max={nationalDuration || 180}
                      step="0.1"
                      value={nationalCurrentTime}
                      onChange={handleNationalSeek}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FFD84A]"
                      aria-label={`Seek ${currentNational.title} audio`}
                    />
                  </div>

                  {/* Player Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={togglePlayNational}
                        className="btn-gold p-3 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
                        aria-label={nationalPlaying ? `Pause ${currentNational.title}` : `Play ${currentNational.title}`}
                        title={nationalPlaying ? "Pause" : "Play"}
                      >
                        {nationalPlaying ? (
                          <Pause className="w-5 h-5 text-[#071A33] fill-[#071A33]" />
                        ) : (
                          <Play className="w-5 h-5 text-[#071A33] fill-[#071A33] ml-0.5" />
                        )}
                      </button>

                      <button
                        onClick={restartNational}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                        title="Replay from beginning"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Restart</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleNationalMute}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title={nationalMuted ? "Unmute" : "Mute"}
                        aria-label={nationalMuted ? "Unmute" : "Mute"}
                      >
                        {nationalMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#FFD84A]" />}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Primary Actions: Play & View / Open in New Tab */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  
                  {/* Action 1: Main Play / Pause Button */}
                  <button
                    onClick={togglePlayNational}
                    className="btn-primary-blue px-4 py-2.5 rounded-lg text-xs font-bold inline-flex items-center space-x-2 cursor-pointer shadow-xs"
                  >
                    {nationalPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Pause Track</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Play {activeNationalTrack === 'state' ? 'Naada Geethe' : 'National Anthem'}</span>
                      </>
                    )}
                  </button>

                  {/* Action 2: Open Audio in New Tab (No forced download, local only) */}
                  <a
                    href={currentNational.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-[#1C5496] inline-flex items-center space-x-1.5 transition-colors shadow-xs"
                    title={`Open ${currentNational.filename} in browser player tab`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Audio File ↗</span>
                  </a>

                </div>

                {/* Lyrics / Verse Information Display */}
                <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
                  <button
                    onClick={() => setShowLyricsNational(!showLyricsNational)}
                    className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 flex justify-between items-center text-xs font-bold text-slate-800 transition-colors cursor-pointer text-left"
                  >
                    <span className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-amber-700" />
                      <span>{activeNationalTrack === 'state' ? 'Naada Geethe Lyrics (Kannada & English)' : 'National Anthem Lyrics'}</span>
                    </span>
                    <span className="text-[11px] text-[#1C5496]">
                      {showLyricsNational ? 'Hide Lyrics ▲' : 'Show Lyrics ▼'}
                    </span>
                  </button>

                  {showLyricsNational && (
                    <div className="p-5 bg-slate-50/50 space-y-4 text-xs sm:text-sm text-slate-700 font-sans leading-relaxed border-t border-slate-200">
                      {activeNationalTrack === 'state' ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                            <h5 className="font-serif font-bold text-sm text-slate-900">ಜಯ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ (ಕನ್ನಡ)</h5>
                            <p className="text-slate-800 leading-relaxed font-serif text-sm">
                              ಜಯ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ, ಜಯ ಹೇ ಕರ್ನಾಟಕ ಮಾತೆ!<br />
                              ಜಯ ಸುಂದರ ನದಿ ವನಗಳ ನಾಡೇ, ಜಯ ಹೇ ರಸಋಷಿಗಳ ಬೀಡೇ!<br />
                              ಭೂದೇವಿಯ ಮಕುಟದ ನವಮಣಿಯೆ, ಗಂಧದ ಚಂದದ ಹೊನ್ನಿನ ಗಣಿಯೆ;<br />
                              ರಾಘವ ಮಧುಸೂಧನರವತರಿಸಿದ ಪಾವನ ಭಾರತ ಜನನಿಯ ತನುಜಾತೆ,<br />
                              ಜಯ ಹೇ ಕರ್ನಾಟಕ ಮಾತೆ!
                            </p>
                          </div>

                          <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
                            <h5 className="font-serif font-bold text-sm text-slate-900">Transliteration & Meaning</h5>
                            <p className="text-slate-700 leading-relaxed text-xs">
                              <em>"Victory to you O Mother Karnataka, the daughter of Mother India! Victory to the land of beautiful rivers and forests, the abode of enlightened sages!"</em>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-3">
                          <h5 className="font-serif font-bold text-sm text-slate-900">Jana Gana Mana (National Anthem of India)</h5>
                          <p className="text-slate-800 leading-relaxed font-serif text-sm">
                            Jana-gana-mana-adhināyaka jaya hē<br />
                            Bhārata-bhāgya-vidhātā.<br />
                            Panjāba-Sindhu-Gujarāta-Marāthā<br />
                            Drāvida-Utkala-Banga<br />
                            Vindhya-Himāchala-Yamunā-Gangā<br />
                            Uchchhala-jaladhi-taranga.<br />
                            Tava śubha nāmē jāgē,<br />
                            Tava śubha āśiṣa māgē,<br />
                            Gāhē tava jaya-gāthā.<br />
                            Jana-gana-mangala-dāyaka jaya hē<br />
                            Bhārata-bhāgya-vidhātā.<br />
                            Jaya hē, jaya hē, jaya hē,<br />
                            Jaya jaya jaya, jaya hē!
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Official St. Philomena's Media Repository</span>
                        <span className="font-mono text-slate-400">{currentNational.filename}</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* 4. INSTITUTIONAL PROTOCOL & USAGE GUIDELINES */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-[#1C5496]">
            <CheckCircle2 className="w-5 h-5 text-[#1C5496]" />
            <h3 className="font-serif font-bold text-xl text-slate-900">Institutional Protocol & Usage</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block text-xs">Collegiate Functions</span>
              <p>Philo's Anthem is sung at the opening of all academic assemblies, student union inaugurations, and inter-collegiate festivals.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block text-xs">State & Regional Dignity</span>
              <p>The State Anthem (Naada Geethe) precedes formal state university convocations, MDES patron days, and cultural observances.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block text-xs">Solemn National Honour</span>
              <p>The National Anthem is rendered at the conclusion of all statutory convocations, flag hoisting ceremonies, and institutional gatherings.</p>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
}
