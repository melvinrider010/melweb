import React from 'react';
import { Eye, BookOpen } from 'lucide-react';
import { useFlipbook } from '../../context/FlipbookContext';

/**
 * Single Unified "View" Button
 * Opens any PDF in realistic 3D book flipbook viewer.
 */
export default function ViewAsBookButton({
  pdfUrl,
  title,
  label = "View",
  variant = "primary", // "primary" | "gold" | "outline" | "blue" | "minimal"
  className = "",
  size = "sm",
  icon: CustomIcon = Eye,
  options = {}
}) {
  const { openFlipbook } = useFlipbook();

  if (!pdfUrl) return null;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openFlipbook(pdfUrl, title || "Document Viewer", options);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "gold":
        return "bg-gradient-to-r from-[#C9A84C] to-[#E5C158] hover:from-[#B8963B] hover:to-[#D4B047] text-[#071A33] shadow-xs font-bold border border-[#C9A84C]/50";
      case "blue":
        return "btn-primary-blue font-bold shadow-xs";
      case "outline":
        return "border border-[#1C5496] text-[#1C5496] hover:bg-[#1C5496] hover:text-white font-bold bg-white transition-all";
      case "minimal":
        return "text-[#1C5496] hover:text-[#0B1F4E] font-bold p-0 bg-transparent hover:underline";
      case "primary":
      default:
        return "bg-[#1C5496] hover:bg-[#0B1F4E] text-white font-bold shadow-xs border border-transparent";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "xs":
        return "py-1 px-3 text-[11px] rounded-lg";
      case "lg":
        return "py-3 px-6 text-sm rounded-xl";
      case "icon":
        return "p-2 rounded-lg";
      case "sm":
      default:
        return "py-1.5 px-4 text-xs rounded-lg";
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      title={`View ${title || 'Document'} in 3D Book Reader`}
    >
      {CustomIcon && <CustomIcon className="w-3.5 h-3.5 shrink-0" />}
      {size !== "icon" && <span>{label}</span>}
    </button>
  );
}
