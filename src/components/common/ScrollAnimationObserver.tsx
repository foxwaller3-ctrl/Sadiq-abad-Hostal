import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal Scroll & Font Animation Engine
 * Automatically assigns and re-triggers mixed animations across all fonts, headings,
 * paragraphs, badges, buttons, cards, numbers, and icons.
 * Re-triggers on scroll in both directions (downwards & upwards) in real-time.
 */
export const ScrollAnimationObserver: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }

    let intersectionObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    // Helper: forces DOM reflow to restart CSS keyframe cleanly
    const triggerAnim = (el: HTMLElement, animClass: string) => {
      el.classList.remove(animClass);
      void el.offsetWidth;
      el.classList.add(animClass);
    };

    const setupObserver = () => {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }

      // 1. Tag Headings (Mix of spin-in and spin-in-alt)
      const headings = document.querySelectorAll<HTMLElement>(
        'h1, h2, h3, h4, h5, h6, [data-scroll-spin]'
      );
      headings.forEach((el, idx) => {
        // Skip header nav brand to preserve layout
        if (el.closest('header') || el.closest('nav')) return;
        if (!el.dataset.animAssigned) {
          el.dataset.animAssigned = idx % 2 === 0 ? 'anim-spin-in-active' : 'anim-spin-in-alt-active';
        }
      });

      // 2. Tag Paragraphs & Lead Texts (Mix of text-pop and font-glow)
      const paragraphs = document.querySelectorAll<HTMLElement>(
        'p:not(.no-anim), blockquote, .text-lead'
      );
      paragraphs.forEach((el, idx) => {
        if (el.closest('header') || el.closest('nav')) return;
        if (!el.dataset.animAssigned) {
          el.dataset.animAssigned = idx % 2 === 0 ? 'anim-text-pop-active' : 'anim-font-glow-active';
        }
      });

      // 3. Tag Badges, Spans & Kickers (Mix of badge-bounce and light-expand)
      const badges = document.querySelectorAll<HTMLElement>(
        '.badge, [data-badge], span.text-xs.font-semibold, span.text-sm.font-semibold'
      );
      badges.forEach((el, idx) => {
        if (el.closest('header') || el.closest('nav')) return;
        if (!el.dataset.animAssigned) {
          el.dataset.animAssigned = idx % 2 === 0 ? 'anim-badge-bounce-active' : 'anim-light-expand-active';
        }
      });

      // 4. Tag Pricing & Numbers (Mix of star-flash and spin-in)
      const numbers = document.querySelectorAll<HTMLElement>(
        '.num-ltr, [data-price], strong.tabular-nums, .metric-value'
      );
      numbers.forEach((el, idx) => {
        if (!el.dataset.animAssigned) {
          el.dataset.animAssigned = idx % 2 === 0 ? 'anim-star-flash-active' : 'anim-spin-in-active';
        }
      });

      // 5. Tag Buttons & Interactive Action Links
      const buttons = document.querySelectorAll<HTMLElement>(
        'main button:not([data-no-anim]), main a.btn, main a[role="button"]'
      );
      buttons.forEach((el, idx) => {
        if (!el.dataset.animAssigned) {
          el.dataset.animAssigned = idx % 2 === 0 ? 'anim-light-expand-active' : 'anim-frame-shake-active';
        }
      });

      // 6. Tag Cards & Content Containers
      const cards = document.querySelectorAll<HTMLElement>(
        '.card, [data-card], article, .hover-frame-shake, .hover-light-expand'
      );
      cards.forEach((el, idx) => {
        if (!el.dataset.animAssigned) {
          el.dataset.animAssigned = idx % 2 === 0 ? 'anim-frame-shake-active' : 'anim-light-expand-active';
        }
      });

      // 7. Tag Icons & Stars
      const icons = document.querySelectorAll<HTMLElement>(
        'main svg.lucide, .anim-star-flash, [data-scroll-star]'
      );
      icons.forEach((el) => {
        if (!el.dataset.animAssigned) {
          el.dataset.animAssigned = 'anim-star-flash-active';
        }
      });

      // Observe all elements that have an assigned or explicit animation class
      const allTargets = document.querySelectorAll<HTMLElement>(
        '[data-anim-assigned], .anim-spin-in, .anim-spin-in-alt, .anim-light-expand, .anim-star-flash, .anim-frame-shake, .anim-text-pop, .anim-font-glow, .anim-badge-bounce'
      );

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const target = entry.target as HTMLElement;
            const assignedClass = target.dataset.animAssigned;

            if (entry.isIntersecting) {
              // Element is entering viewport (scrolling down OR scrolling up)
              if (assignedClass) {
                triggerAnim(target, assignedClass);
              }
              if (target.classList.contains('anim-spin-in')) {
                triggerAnim(target, 'anim-spin-in-active');
              }
              if (target.classList.contains('anim-spin-in-alt')) {
                triggerAnim(target, 'anim-spin-in-alt-active');
              }
              if (target.classList.contains('anim-light-expand') || target.classList.contains('hover-light-expand')) {
                triggerAnim(target, 'anim-light-expand-active');
              }
              if (target.classList.contains('anim-star-flash')) {
                triggerAnim(target, 'anim-star-flash-active');
              }
              if (target.classList.contains('anim-frame-shake') || target.classList.contains('hover-frame-shake')) {
                triggerAnim(target, 'anim-frame-shake-active');
              }
              if (target.classList.contains('anim-text-pop')) {
                triggerAnim(target, 'anim-text-pop-active');
              }
              if (target.classList.contains('anim-font-glow')) {
                triggerAnim(target, 'anim-font-glow-active');
              }
              if (target.classList.contains('anim-badge-bounce')) {
                triggerAnim(target, 'anim-badge-bounce-active');
              }
            } else {
              // Element left viewport: clear active class so next scroll in re-triggers it
              if (assignedClass) {
                target.classList.remove(assignedClass);
              }
              target.classList.remove(
                'anim-spin-in-active',
                'anim-spin-in-alt-active',
                'anim-light-expand-active',
                'anim-star-flash-active',
                'anim-frame-shake-active',
                'anim-text-pop-active',
                'anim-font-glow-active',
                'anim-badge-bounce-active'
              );
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -25px 0px',
          threshold: 0.12
        }
      );

      allTargets.forEach((el) => intersectionObserver?.observe(el));
    };

    // Debounced schedule for DOM updates
    const scheduleSetup = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(setupObserver, 100);
    };

    // Run initially and after short delays for Suspense chunks
    scheduleSetup();
    const timer1 = setTimeout(setupObserver, 300);
    const timer2 = setTimeout(setupObserver, 800);

    // Watch for DOM mutations (route changes, fetched items, modals)
    mutationObserver = new MutationObserver(() => {
      const untagged = document.querySelector('h2:not([data-anim-assigned]), p:not([data-anim-assigned])');
      if (untagged) {
        scheduleSetup();
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (intersectionObserver) intersectionObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
};
