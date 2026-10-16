import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  caption?: string;
  onPrev?: () => void;
  onNext?: () => void;
  currentIndex?: number;
  total?: number;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  imageUrl,
  caption,
  onPrev,
  onNext,
  currentIndex,
  total
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 transition-all duration-200 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top bar */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/80 text-white text-xs md:text-sm font-medium px-3 py-1.5 rounded-full border border-slate-700">
          {currentIndex !== undefined && total !== undefined
            ? `${currentIndex + 1} / ${total}`
            : ''}
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto p-2 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full border border-slate-700 transition duration-150 cursor-pointer"
          aria-label="Close image viewer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Prev button */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full border border-slate-700 transition duration-150 z-10 cursor-pointer hidden sm:flex"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Container */}
      <div className="max-w-4xl max-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={caption || 'Hostel photo'}
          className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl transition duration-200"
        />
        {caption && (
          <p className="mt-3 text-center text-sm text-slate-200 bg-slate-900/70 px-4 py-1.5 rounded-full backdrop-blur-xs max-w-lg">
            {caption}
          </p>
        )}
      </div>

      {/* Next button */}
      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full border border-slate-700 transition duration-150 z-10 cursor-pointer hidden sm:flex"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
