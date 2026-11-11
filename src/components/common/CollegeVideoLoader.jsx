import React, { useRef, useEffect } from 'react';

/**
 * CollegeVideoLoader
 * 
 * Clean, restrained institutional loading component that displays the user's
 * actual video asset in a rotating circular frame centered in the viewport.
 * 
 * - Background: 100% transparent across all wrappers (underlying page remains visible)
 * - Video: Directly plays user's video asset (no logo/crest/SVG substitution)
 * - Animation: Smooth 1.3s rotation applied directly to the video element/frame
 * - No unwanted decoration: Zero decorative orbiting arcs, zero oversized borders, zero spinner rings
 * - Composition: Centered in viewport with clear spacing for text label below
 * - Accessibility: Halts rotation gracefully under prefers-reduced-motion
 */
export default function CollegeVideoLoader({ 
  label = "Loading St. Philomena's Portal...",
  isFullScreen = true,
  videoSrcWebm = "/assets/videos/site-loader-transparent.webm",
  videoSrcMp4 = "/assets/videos/site-loader.mp4" 
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [videoSrcWebm, videoSrcMp4]);

  const containerClasses = isFullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-transparent pointer-events-none"
    : "w-full flex flex-col items-center justify-center bg-transparent py-8 select-none";

  return (
    <div 
      className={containerClasses} 
      role="status" 
      aria-live="polite"
      style={{ backgroundColor: 'transparent' }}
    >
      <div 
        className="flex flex-col items-center justify-center bg-transparent select-none"
        style={{ backgroundColor: 'transparent' }}
      >
        {/* Video Element inside Rotating Circular Frame (1.3s smooth rotation, NO borders, NO arcs, TRUE ALPHA) */}
        <div 
          className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden animate-college-loader-spin bg-transparent shrink-0"
          style={{ backgroundColor: 'transparent' }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover bg-transparent"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              backgroundColor: 'transparent' 
            }}
          >
            <source src={videoSrcWebm} type="video/webm; codecs=vp9" />
            <source src={videoSrcMp4} type="video/mp4" />
          </video>
        </div>

        {/* Clean, Restrained Institutional Typography with St. Philomena's Navy & Gold Branding */}
        {label && (
          <div className="mt-6 flex flex-col items-center bg-transparent select-none">
            <span 
              className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#0B1F4E] text-center"
              style={{ backgroundColor: 'transparent' }}
            >
              {label}
            </span>
            <div className="w-10 h-0.5 bg-[#C9A84C] mt-2 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
