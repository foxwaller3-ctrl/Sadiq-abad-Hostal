import React, { useState, useEffect, useRef } from 'react';
import { Pause, Play } from 'lucide-react';

interface BannerSlide {
  id: number;
  src: string;
  alt: string;
  animationType: 'fade-in' | 'white-flash' | 'diagonal-cut';
}

const BANNERS: BannerSlide[] = [
  {
    id: 1,
    src: '/assets/aistudio/Sadiqabad_Student_Hostel__Home_Away_From_Home_c5880427.png',
    alt: 'Sadiqabad Student Hostel - Your Home Away From Home',
    animationType: 'fade-in'
  },
  {
    id: 2,
    src: '/assets/aistudio/Comfort__Convenience___Better_Living_ca57239f.png',
    alt: 'Sadiqabad Student Hostel - Comfort, Convenience & Better Living',
    animationType: 'white-flash'
  },
  {
    id: 3,
    src: '/assets/aistudio/Sadiqabad_Student_Hostel__Find_Your_Perfect_Stay_3f62ef98.png',
    alt: 'Sadiqabad Student Hostel - Find Your Perfect Student Stay',
    animationType: 'diagonal-cut'
  }
];

export const AnimatedHeroBanners: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Auto rotation: 1 -> 2 -> 3 -> 1... every 4.5 seconds
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4500);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const currentBanner = BANNERS[currentIndex];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 aspect-[16/9] sm:aspect-[2/1] lg:aspect-[16/10] w-full min-h-[260px] shadow-2xl group select-none"
      aria-label="Hostel Visual Showcase"
    >
      {/* Banner Slides with Distinct Keyframe Transitions */}
      {BANNERS.map((banner, idx) => {
        const isActive = idx === currentIndex;
        if (!isActive) return null;

        let animClass = 'anim-fade-in';
        if (banner.animationType === 'white-flash') {
          animClass = 'anim-white-flash';
        } else if (banner.animationType === 'diagonal-cut') {
          animClass = 'anim-diagonal-cut';
        }

        return (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full flex items-center justify-center bg-slate-950 ${animClass}`}
          >
            <img
              src={banner.src}
              alt={banner.alt}
              className="w-full h-full object-contain object-center"
              loading={idx === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
          </div>
        );
      })}

      {/* Clean Pause / Resume Button for Visitors (No bars, no text clutter) */}
      <div className="absolute bottom-3 right-3 z-20">
        <button
          type="button"
          onClick={togglePause}
          aria-label={isPaused ? 'Resume auto-rotating banner' : 'Pause banner rotation'}
          title={isPaused ? 'Resume Banner (چلائیں)' : 'Pause Banner (روکیں)'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-600/70 text-xs font-medium shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>Pause</span>
            </>
          )}
        </button>
      </div>

      {/* Subtle indicator dots (non-cluttering, accessible) */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-700/60">
        {BANNERS.map((b, i) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setCurrentIndex(i)}
            aria-label={`Switch to banner ${i + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === currentIndex
                ? 'w-5 h-1.5 bg-amber-400'
                : 'w-1.5 h-1.5 bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
