/**
 * Interactive Bubble Burst Animation System
 * Renders glossy, translucent, floating & popping 3D bubbles on click.
 * High performance HTML5 Canvas engine with 0% idle CPU footprint.
 */

interface BubbleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  color: string;
  borderColor: string;
  alpha: number;
  life: number;
  maxLife: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  popped: boolean;
}

interface DropletParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface RippleRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

class BubbleAnimationEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private bubbles: BubbleParticle[] = [];
  private droplets: DropletParticle[] = [];
  private ripples: RippleRing[] = [];
  private isRunning: boolean = false;

  private readonly bubblePalettes = [
    { fill: 'rgba(20, 184, 166, 0.28)', border: 'rgba(94, 234, 212, 0.85)' }, // Teal
    { fill: 'rgba(6, 182, 212, 0.28)', border: 'rgba(103, 232, 249, 0.85)' },  // Cyan
    { fill: 'rgba(245, 158, 11, 0.28)', border: 'rgba(252, 211, 77, 0.85)' },  // Amber
    { fill: 'rgba(16, 185, 129, 0.28)', border: 'rgba(110, 231, 183, 0.85)' }, // Emerald
    { fill: 'rgba(168, 85, 247, 0.28)', border: 'rgba(216, 180, 254, 0.85)' }, // Purple
    { fill: 'rgba(59, 130, 246, 0.28)', border: 'rgba(147, 197, 253, 0.85)' },  // Sky
  ];

  public init() {
    if (typeof window === 'undefined' || this.canvas) return;

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'bubble-click-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '999999';

    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    const handleResize = () => {
      if (!this.canvas) return;
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = window.innerWidth * dpr;
      this.canvas.height = window.innerHeight * dpr;
      if (this.ctx) {
        this.ctx.resetTransform?.();
        this.ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
  }

  /**
   * Spawns a burst of beautiful glassy bubbles at the given screen coordinates
   */
  public spawnBubbles(x: number, y: number, count: number = 10) {
    if (!this.canvas) {
      this.init();
    }
    if (!this.ctx || !this.canvas) return;

    // 1. Add expanding click ripple ring
    const palette = this.bubblePalettes[Math.floor(Math.random() * this.bubblePalettes.length)];
    this.ripples.push({
      x,
      y,
      radius: 4,
      maxRadius: 36 + Math.random() * 16,
      color: palette.border,
      alpha: 0.7
    });

    // 2. Generate bubbles with realistic burst velocities
    for (let i = 0; i < count; i++) {
      const p = this.bubblePalettes[Math.floor(Math.random() * this.bubblePalettes.length)];
      // Radial burst angle biased upward (-30deg to -150deg)
      const angle = (Math.random() * Math.PI) + Math.PI; // -PI to 0 (upward half-plane)
      const speed = 1.6 + Math.random() * 3.8;
      const targetRadius = 7 + Math.random() * 15;

      this.bubbles.push({
        x,
        y,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 1.5,
        vy: Math.sin(angle) * speed - 1.2, // Stronger initial upward velocity
        radius: 2,
        maxRadius: targetRadius,
        color: p.fill,
        borderColor: p.border,
        alpha: 0.95,
        life: 0,
        maxLife: 35 + Math.floor(Math.random() * 25), // 35 - 60 frames (~0.6 - 1.0s)
        wobbleSpeed: 0.08 + Math.random() * 0.1,
        wobbleAmp: 0.8 + Math.random() * 1.5,
        popped: false
      });
    }

    if (!this.isRunning) {
      this.isRunning = true;
      requestAnimationFrame(this.render.bind(this));
    }
  }

  private spawnPopDroplets(x: number, y: number, color: string) {
    const dropletCount = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < dropletCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 2.2;
      this.droplets.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.2 + Math.random() * 1.5,
        color,
        alpha: 0.8,
        life: 0,
        maxLife: 12 + Math.floor(Math.random() * 8)
      });
    }
  }

  private render() {
    if (!this.ctx || !this.canvas) {
      this.isRunning = false;
      return;
    }

    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // 1. Render & Update Ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += (r.maxRadius - r.radius) * 0.18 + 0.8;
      r.alpha -= 0.045;

      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = r.color;
      this.ctx.globalAlpha = Math.max(0, r.alpha);
      this.ctx.lineWidth = 1.8;
      this.ctx.stroke();
      this.ctx.restore();
    }

    // 2. Render & Update Floating Bubbles
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.life++;

      // Growth to full radius in first few frames
      if (b.radius < b.maxRadius) {
        b.radius += (b.maxRadius - b.radius) * 0.25;
      }

      // Physics: drag, buoyancy, horizontal wobble
      b.vx *= 0.94;
      b.vy *= 0.94;
      b.vy -= 0.16; // Buoyant upward float
      b.x += b.vx + Math.sin(b.life * b.wobbleSpeed) * b.wobbleAmp;
      b.y += b.vy;

      // Pop near end of life
      if (b.life >= b.maxLife - 3 && !b.popped) {
        b.popped = true;
        this.spawnPopDroplets(b.x, b.y, b.borderColor);
      }

      if (b.life >= b.maxLife) {
        this.bubbles.splice(i, 1);
        continue;
      }

      // Render Bubble
      const progress = b.life / b.maxLife;
      const alpha = Math.max(0, b.alpha * (1 - progress * 0.4));

      this.ctx.save();
      this.ctx.globalAlpha = alpha;

      // Outer glow and translucent fill
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = b.color;
      this.ctx.fill();

      // Sharp iridescent border
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeStyle = b.borderColor;
      this.ctx.stroke();

      // Top-left 3D gloss highlight reflection
      const highlightRadius = b.radius * 0.28;
      const highlightX = b.x - b.radius * 0.35;
      const highlightY = b.y - b.radius * 0.35;

      this.ctx.beginPath();
      this.ctx.arc(highlightX, highlightY, highlightRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      this.ctx.fill();

      // Secondary bottom-right subtle reflection
      this.ctx.beginPath();
      this.ctx.arc(b.x + b.radius * 0.3, b.y + b.radius * 0.3, highlightRadius * 0.6, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      this.ctx.fill();

      this.ctx.restore();
    }

    // 3. Render & Update Pop Droplets
    for (let i = this.droplets.length - 1; i >= 0; i--) {
      const d = this.droplets[i];
      d.life++;
      d.x += d.vx;
      d.y += d.vy;
      d.vx *= 0.92;
      d.vy *= 0.92;
      d.alpha -= 0.055;

      if (d.alpha <= 0 || d.life >= d.maxLife) {
        this.droplets.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, d.alpha);
      this.ctx.beginPath();
      this.ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = d.color;
      this.ctx.fill();
      this.ctx.restore();
    }

    // Continue loop if active particles exist
    if (this.bubbles.length > 0 || this.droplets.length > 0 || this.ripples.length > 0) {
      requestAnimationFrame(this.render.bind(this));
    } else {
      this.isRunning = false;
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }
}

export const bubbleAnimation = new BubbleAnimationEngine();
