'use client';

import { useEffect, useRef, memo } from 'react';
import type { Theme } from '@/types';

interface ThemeCanvasConfig {
  orbCount: number;
  particleCount: number;
  connectionDistance: number;
  speed: number;
  size: { min: number; max: number };
  pulse: boolean;
  connectingLines: boolean;
}

const configs: Record<Theme, ThemeCanvasConfig> = {
  romantic: { orbCount: 6, particleCount: 30, connectionDistance: 180, speed: 0.15, size: { min: 60, max: 160 }, pulse: true, connectingLines: true },
  natural: { orbCount: 5, particleCount: 20, connectionDistance: 160, speed: 0.10, size: { min: 50, max: 140 }, pulse: false, connectingLines: true },
  modern: { orbCount: 8, particleCount: 50, connectionDistance: 200, speed: 0.20, size: { min: 40, max: 120 }, pulse: true, connectingLines: true },
  serene: { orbCount: 5, particleCount: 25, connectionDistance: 150, speed: 0.08, size: { min: 70, max: 180 }, pulse: true, connectingLines: false },
  cozy: { orbCount: 6, particleCount: 20, connectionDistance: 140, speed: 0.12, size: { min: 50, max: 150 }, pulse: true, connectingLines: true },
  frost: { orbCount: 4, particleCount: 15, connectionDistance: 200, speed: 0.06, size: { min: 80, max: 200 }, pulse: false, connectingLines: false },
  moon: { orbCount: 7, particleCount: 40, connectionDistance: 180, speed: 0.18, size: { min: 40, max: 130 }, pulse: true, connectingLines: true },
  coral: { orbCount: 7, particleCount: 35, connectionDistance: 170, speed: 0.16, size: { min: 50, max: 150 }, pulse: true, connectingLines: true },
  jade: { orbCount: 5, particleCount: 22, connectionDistance: 170, speed: 0.10, size: { min: 55, max: 145 }, pulse: true, connectingLines: true },
  terracotta: { orbCount: 5, particleCount: 18, connectionDistance: 150, speed: 0.11, size: { min: 55, max: 155 }, pulse: true, connectingLines: true },
  lavender: { orbCount: 6, particleCount: 28, connectionDistance: 160, speed: 0.10, size: { min: 60, max: 170 }, pulse: true, connectingLines: false },
  ocean: { orbCount: 5, particleCount: 20, connectionDistance: 190, speed: 0.07, size: { min: 70, max: 190 }, pulse: true, connectingLines: true },
  sunset: { orbCount: 8, particleCount: 45, connectionDistance: 190, speed: 0.18, size: { min: 40, max: 120 }, pulse: true, connectingLines: true },
  rosegold: { orbCount: 6, particleCount: 25, connectionDistance: 150, speed: 0.12, size: { min: 55, max: 145 }, pulse: true, connectingLines: true },
  charcoal: { orbCount: 5, particleCount: 18, connectionDistance: 200, speed: 0.06, size: { min: 60, max: 180 }, pulse: false, connectingLines: false },
  forest: { orbCount: 5, particleCount: 18, connectionDistance: 160, speed: 0.09, size: { min: 65, max: 175 }, pulse: true, connectingLines: true },
  blush: { orbCount: 6, particleCount: 24, connectionDistance: 140, speed: 0.14, size: { min: 50, max: 140 }, pulse: true, connectingLines: true },
};

interface Orb {
  x: number; y: number; vx: number; vy: number;
  radius: number; color: string; alpha: number;
  pulsePhase: number; pulseSpeed: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  alpha: number; life: number; maxLife: number;
  size: number;
}

function hexToRgba(hex: string, alpha: number): string {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16) || 0;
  const g = parseInt(c.slice(2, 4), 16) || 0;
  const b = parseInt(c.slice(4, 6), 16) || 0;
  return `rgba(${r},${g},${b},${alpha})`;
}

export const CanvasBackground = memo(function CanvasBackground({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const colorsRef = useRef({ accent: '#d45a7a', accentLight: '#d45a7a', accentDark: '#d45a7a', bgSecondary: '#d45a7a' });
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cfg = configs[theme] || configs.romantic;

    const readColors = () => {
      const getCssVar = (name: string): string => {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#d45a7a';
      };
      colorsRef.current = {
        accent: getCssVar('--accent'),
        accentLight: getCssVar('--accent-light'),
        accentDark: getCssVar('--accent-dark'),
        bgSecondary: getCssVar('--bg-secondary'),
      };
    };
    readColors();

    let w = 0;
    let h = 0;
    let orbs: Orb[] = [];
    let particles: Particle[] = [];
    let time = 0;
    let visible = true;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w;
      canvas!.height = h;
      initOrbs();
    };

    const debouncedResize = () => {
      clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(resize, 100);
    };

    const initOrbs = () => {
      const c = colorsRef.current;
      const colors = [c.accent, c.accentLight, c.accentDark, c.bgSecondary];
      orbs = Array.from({ length: cfg.orbCount }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * cfg.speed,
        vy: (Math.random() - 0.5) * cfg.speed,
        radius: cfg.size.min + Math.random() * (cfg.size.max - cfg.size.min),
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.08 + Math.random() * 0.12,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.3 + Math.random() * 0.4,
      }));
    };

    const initParticles = () => {
      particles = Array.from({ length: cfg.particleCount }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: 0.3 + Math.random() * 0.5,
        life: 0, maxLife: 100 + Math.random() * 200,
        size: 1 + Math.random() * 2,
      }));
    };

    const draw = () => {
      if (!visible) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      ctx!.clearRect(0, 0, w, h);
      time += 0.01;

      const c = colorsRef.current;

      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.radius) orb.x = w + orb.radius;
        if (orb.x > w + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = h + orb.radius;
        if (orb.y > h + orb.radius) orb.y = -orb.radius;

        const pulse = cfg.pulse ? 1 + 0.15 * Math.sin(time * orb.pulseSpeed + orb.pulsePhase) : 1;
        const r = orb.radius * pulse;

        const gradient = ctx!.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r);
        gradient.addColorStop(0, hexToRgba(orb.color, orb.alpha));
        gradient.addColorStop(1, hexToRgba(orb.color, 0));
        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(orb.x, orb.y, r, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (cfg.connectingLines) {
        for (let i = 0; i < orbs.length; i++) {
          for (let j = i + 1; j < orbs.length; j++) {
            const dx = orbs[i].x - orbs[j].x;
            const dy = orbs[i].y - orbs[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < cfg.connectionDistance) {
              const alpha = (1 - dist / cfg.connectionDistance) * 0.08;
              ctx!.strokeStyle = hexToRgba(c.accent, alpha);
              ctx!.lineWidth = 1;
              ctx!.beginPath();
              ctx!.moveTo(orbs[i].x, orbs[i].y);
              ctx!.lineTo(orbs[j].x, orbs[j].y);
              ctx!.stroke();
            }
          }
        }
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.life = 0;
          p.maxLife = 100 + Math.random() * 200;
        }
        const fade = p.life < 30 ? p.life / 30 : 1;
        ctx!.fillStyle = hexToRgba(c.accent, p.alpha * fade * 0.3);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) {
        readColors();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    window.addEventListener('resize', debouncedResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(resizeTimerRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', debouncedResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
});
