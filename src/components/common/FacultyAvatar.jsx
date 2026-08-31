import React, { useState } from 'react';

export default function FacultyAvatar({ 
  src, 
  alt = '', 
  name = '', 
  className = 'w-12 h-12 rounded-xl object-cover border border-slate-300',
  fallbackSize = 'text-sm'
}) {
  const [error, setError] = useState(false);

  // Derive initials for rare fallback
  const initials = name
    ? name
        .replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.|Rev\.|Fr\.)\s+/i, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase()
    : 'FC';

  if (error || !src) {
    return (
      <div 
        className={`${className} bg-gradient-to-br from-[#1C5496] to-[#071A33] text-[#FFD84A] flex items-center justify-center font-serif font-bold ${fallbackSize} shadow-inner select-none shrink-0`}
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || name}
      onError={() => setError(true)}
      className={`${className} object-cover`}
      loading="lazy"
    />
  );
}
