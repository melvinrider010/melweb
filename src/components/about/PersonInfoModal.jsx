import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';

export default function PersonInfoModal({ person, anchorElement, anchorRect, onClose }) {
  const popoverRef = useRef(null);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 360,
    placement: 'top',
    caretStyle: {},
    visible: false
  });

  // Calculate and update position based on clicked image anchor
  const updatePosition = () => {
    if (!anchorElement && !anchorRect) return;

    const rect = anchorElement
      ? anchorElement.getBoundingClientRect()
      : anchorRect;

    if (!rect || (rect.width === 0 && rect.height === 0)) return;

    const popupWidth = Math.min(360, window.innerWidth - 24);
    const popupHeight = popoverRef.current ? popoverRef.current.offsetHeight : 280;
    const gap = 12; // Gap between image edge and popup
    const pad = 12; // Margin from viewport boundaries

    const anchorCenterX = rect.left + rect.width / 2;
    const anchorCenterY = rect.top + rect.height / 2;

    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;

    let placement = 'top';
    let top = 0;
    let left = 0;

    // 1. Preferred: If enough room ABOVE, place popup above clicked image
    if (spaceAbove >= popupHeight + gap + pad) {
      placement = 'top';
      top = rect.top - popupHeight - gap;
      left = anchorCenterX - popupWidth / 2;
    }
    // 2. Otherwise: if enough room BELOW, place popup below clicked image
    else if (spaceBelow >= popupHeight + gap + pad) {
      placement = 'bottom';
      top = rect.bottom + gap;
      left = anchorCenterX - popupWidth / 2;
    }
    // 3. If vertical space tight, check if RIGHT fits
    else if (spaceRight >= popupWidth + gap + pad) {
      placement = 'right';
      left = rect.right + gap;
      top = anchorCenterY - popupHeight / 2;
    }
    // 4. Check if LEFT fits
    else if (spaceLeft >= popupWidth + gap + pad) {
      placement = 'left';
      left = rect.left - popupWidth - gap;
      top = anchorCenterY - popupHeight / 2;
    }
    // 5. Fallback: whichever vertical side has more room
    else {
      if (spaceBelow >= spaceAbove) {
        placement = 'bottom';
        top = rect.bottom + gap;
      } else {
        placement = 'top';
        top = Math.max(pad, rect.top - popupHeight - gap);
      }
      left = anchorCenterX - popupWidth / 2;
    }

    // Clamp coordinates to strictly stay inside the visible viewport
    left = Math.max(pad, Math.min(left, window.innerWidth - popupWidth - pad));
    top = Math.max(pad, Math.min(top, window.innerHeight - popupHeight - pad));

    // Calculate caret / arrow coordinates relative to the popup container
    let caretStyle = {};
    if (placement === 'top' || placement === 'bottom') {
      const caretX = Math.max(22, Math.min(anchorCenterX - left, popupWidth - 22));
      if (placement === 'top') {
        caretStyle = {
          bottom: '-6px',
          left: `${Math.round(caretX)}px`,
          transform: 'translateX(-50%) rotate(45deg)',
          borderBottom: '1px solid #cbd5e1',
          borderRight: '1px solid #cbd5e1',
          backgroundColor: '#ffffff'
        };
      } else {
        caretStyle = {
          top: '-6px',
          left: `${Math.round(caretX)}px`,
          transform: 'translateX(-50%) rotate(45deg)',
          borderTop: '1px solid #cbd5e1',
          borderLeft: '1px solid #cbd5e1',
          backgroundColor: '#ffffff'
        };
      }
    } else {
      const caretY = Math.max(22, Math.min(anchorCenterY - top, popupHeight - 22));
      if (placement === 'right') {
        caretStyle = {
          left: '-6px',
          top: `${Math.round(caretY)}px`,
          transform: 'translateY(-50%) rotate(45deg)',
          borderTop: '1px solid #cbd5e1',
          borderLeft: '1px solid #cbd5e1',
          backgroundColor: '#ffffff'
        };
      } else {
        caretStyle = {
          right: '-6px',
          top: `${Math.round(caretY)}px`,
          transform: 'translateY(-50%) rotate(45deg)',
          borderBottom: '1px solid #cbd5e1',
          borderRight: '1px solid #cbd5e1',
          backgroundColor: '#ffffff'
        };
      }
    }

    setCoords({
      top: Math.round(top),
      left: Math.round(left),
      width: Math.round(popupWidth),
      placement,
      caretStyle,
      visible: true
    });
  };

  // Synchronous layout calculation on mount or anchor change
  useLayoutEffect(() => {
    updatePosition();
  }, [anchorElement, anchorRect, person]);

  // Scroll and Resize handlers: keep popup glued to the clicked image
  useEffect(() => {
    const handleScroll = () => {
      updatePosition();
    };
    const handleResize = () => {
      updatePosition();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [anchorElement, anchorRect, person]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Click outside handler (No backdrop needed; allows clicking other cards directly)
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        (!anchorElement || !anchorElement.contains(e.target))
      ) {
        onClose();
      }
    };
    const timer = setTimeout(() => {
      window.addEventListener('pointerdown', handlePointerDown);
    }, 10);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [onClose, anchorElement]);

  if (!person) return null;

  // Resolve photo source
  const photoSrc = person?.assetPath || person?.imageUrl || person?.image || "/assets/images/campus/intro_heritage_building.jpg";

  // Resolve leadership link
  const personId = (person?.id || '').toLowerCase();
  const personName = (person?.name || '').toLowerCase();
  
  const leadershipLink = person?.link || (
    personId === 'rector' || personName.includes('lourdu') ? '/leadership/rector'
    : personId === 'principal' || personName.includes('ravi') ? '/leadership/principal'
    : personId === 'bishop-president' || personId === 'president-mdes' || personId === 'bishop' || personName.includes('francis') ? '/leadership/bishop'
    : personId === 'financial' || personId === 'finance-officer' || personName.includes('roshan') ? '/leadership/financial-officer'
    : personId === 'iqac-coord' || personName.includes('thomas') || personName.includes('gunaseelan') ? '/leadership/iqac-coordinator'
    : personId === 'pg-coordinator' || personName.includes('noor') || personName.includes('mubasheer') ? '/leadership/pg-coordinator'
    : null
  );

  const categoryLabel = person?.role || person?.title || 'LEADERSHIP';
  const descriptionText = person?.biography || person?.description || '';

  // Determine custom object-position to preserve optimal head framing
  const objectPosition = 
    personId === 'bishop-president' || personId === 'president-mdes' || personName.includes('francis') ? '50% 12%'
    : personId === 'rector' || personName.includes('lourdu') ? '50% 18%'
    : personId === 'principal' || personName.includes('ravi') ? '50% 15%'
    : personId === 'financial' || personId === 'finance-officer' || personName.includes('roshan') ? '50% 15%'
    : personId === 'dean-academic' || personName.includes('anand') ? '50% 15%'
    : personId === 'pg-coordinator' || personName.includes('mubasheer') ? '50% 15%'
    : '50% 15%';

  // Dynamic transform origin to animate directly from the clicked image anchor
  const transformOrigin = 
    coords.placement === 'top' ? 'center bottom'
    : coords.placement === 'bottom' ? 'center top'
    : coords.placement === 'right' ? 'left center'
    : 'right center';

  const popoverElement = (
    <div
      ref={popoverRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="popover-person-name"
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: `${coords.width}px`,
        zIndex: 9999,
        transformOrigin,
        opacity: coords.visible ? 1 : 0,
        pointerEvents: coords.visible ? 'auto' : 'none',
        transition: 'opacity 150ms cubic-bezier(0.16, 1, 0.3, 1), transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        transform: coords.visible ? 'scale(1)' : 'scale(0.95)',
      }}
      className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Physical Caret / Arrow connecting popup to clicked image */}
      <div
        aria-hidden="true"
        className="absolute w-3 h-3 z-20 pointer-events-none"
        style={coords.caretStyle}
      />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100 rounded-t-2xl shrink-0">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#a88530]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
            {categoryLabel}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Popover Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start space-x-3.5">
          {/* Photo: compact 84px x 104px */}
          <div className="w-[84px] h-[104px] shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
            <img
              src={photoSrc}
              alt={person.name}
              style={{ objectPosition }}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "/assets/images/campus/intro_heritage_building.jpg"; }}
            />
          </div>

          {/* Name & Designation */}
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 
              id="popover-person-name"
              className="font-serif font-bold text-base text-slate-900 leading-snug"
            >
              {person.name}
            </h3>
            <p className="text-xs font-semibold text-[#a88530] mt-1">
              {person.designation}
            </p>
          </div>
        </div>

        {/* Biography Excerpt */}
        {descriptionText && (
          <p className="text-[11.5px] text-slate-600 leading-relaxed line-clamp-3 pt-2 border-t border-slate-100">
            {descriptionText}
          </p>
        )}

        {/* View Official Message Link */}
        {leadershipLink && (
          <div className="pt-1">
            <Link
              to={leadershipLink}
              onClick={onClose}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0B1F4E] hover:text-[#153275] hover:underline"
            >
              <span>View Official Message</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(popoverElement, document.body);
}
