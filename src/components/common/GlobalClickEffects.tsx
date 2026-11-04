import React, { useEffect } from 'react';
import { soundEffects } from '../../utils/soundEffects.ts';
import { bubbleAnimation } from '../../utils/bubbleAnimation.ts';

/**
 * Global Button Click Effects
 * Listens for clicks on any button, action link, interactive card or clickable element across the website.
 * On click:
 * 1. Spawns floating, translucent, glassy popping bubbles at the click coordinates.
 * 2. Plays a crisp, satisfying, organic bubble pop sound via Web Audio API.
 */
export const GlobalClickEffects: React.FC = () => {
  useEffect(() => {
    // Initialize the bubble canvas
    bubbleAnimation.init();

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Match any button, link, role=button, tab, card or clickable element
      const interactiveEl = target.closest<HTMLElement>(
        'button, a, input[type="button"], input[type="submit"], [role="button"], [data-clickable], .cursor-pointer, select, [tabindex="0"]'
      );

      if (interactiveEl) {
        let x = e.clientX;
        let y = e.clientY;

        // If triggered via keyboard (Enter/Space on focused button)
        if (x === 0 && y === 0) {
          const rect = interactiveEl.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        }

        // Spawn glossy bubbles at click point
        bubbleAnimation.spawnBubbles(x, y, 12);

        // Play crisp bubble pop sound
        soundEffects.playBubblePop();
      }
    };

    window.addEventListener('mousedown', handlePointerDown, { capture: true, passive: true });

    return () => {
      window.removeEventListener('mousedown', handlePointerDown, { capture: true });
    };
  }, []);

  return null;
};
