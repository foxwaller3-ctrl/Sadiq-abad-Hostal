/**
 * Pastel Bomb Celebration Effect
 * Spawns soft pastel confetti particles, floating balloons, and glowing ring ripples
 * when room details or admin details are opened.
 */

export interface PastelParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'ring' | 'star';
  rotation: number;
  vRot: number;
  opacity: number;
}

const PASTEL_PALETTE = [
  '#FDE68A', // soft pastel yellow
  '#FCA5A5', // soft pastel coral/rose
  '#A7F3D0', // soft pastel mint
  '#BAE6FD', // soft pastel sky blue
  '#DDD6FE', // soft pastel lavender
  '#FBCFE8', // soft pastel pink
  '#FED7AA', // soft pastel peach
  '#C7D2FE'  // soft pastel periwinkle
];

export function triggerPastelBomb(originX?: number, originY?: number): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.className = 'fixed inset-0 pointer-events-none z-[100]';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '9999';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const startX = originX !== undefined && originX > 0 ? originX : width / 2;
  const startY = originY !== undefined && originY > 0 ? originY : height / 2;

  const particles: PastelParticle[] = [];
  const particleCount = 48;

  const shapes: PastelParticle['shape'][] = ['circle', 'square', 'ring', 'star'];

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
    const speed = 4 + Math.random() * 9;
    particles.push({
      id: i,
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.5,
      color: PASTEL_PALETTE[i % PASTEL_PALETTE.length],
      size: 6 + Math.random() * 8,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      opacity: 1
    });
  }

  // Large expanding pastel shockwave ring
  let shockwaveRadius = 10;
  let shockwaveOpacity = 0.8;

  let animFrameId: number;
  const startTime = performance.now();
  const maxDuration = 1200; // ms

  const render = (now: number) => {
    const elapsed = now - startTime;
    if (elapsed > maxDuration) {
      cancelAnimationFrame(animFrameId);
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Draw shockwave ring
    if (shockwaveOpacity > 0.02) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(startX, startY, shockwaveRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(253, 230, 138, ${shockwaveOpacity * 0.7})`;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      shockwaveRadius += 6;
      shockwaveOpacity *= 0.94;
    }

    // Draw pastel particles
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // gentle gravity
      p.vx *= 0.97;
      p.rotation += p.vRot;
      p.opacity = Math.max(0, 1 - elapsed / maxDuration);

      if (p.opacity <= 0) return;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'square') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else if (p.shape === 'ring') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (p.shape === 'star') {
        ctx.beginPath();
        const spikes = 4;
        const outer = p.size;
        const inner = p.size / 2;
        for (let j = 0; j < spikes * 2; j++) {
          const r = j % 2 === 0 ? outer : inner;
          const a = (j * Math.PI) / spikes;
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    });

    animFrameId = requestAnimationFrame(render);
  };

  animFrameId = requestAnimationFrame(render);
}
