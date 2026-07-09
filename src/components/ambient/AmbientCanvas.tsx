'use client';

import { useEffect, useRef, memo } from 'react';
import { useSettingsStore } from '@/lib/store/settingsStore';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'petal' | 'star' | 'leaf';
  color: string;
  phase: number;
}

type Theme = 'romantic' | 'natural' | 'modern' | 'serene' | 'cozy' | 'frost' | 'moon' | 'coral' | 'jade' | 'terracotta' | 'lavender' | 'ocean' | 'sunset' | 'rosegold' | 'charcoal' | 'forest' | 'blush';

const themeConfig: Record<Theme, { colors: string[]; shapes: Particle['shape'][]; maxParticles: number }> = {
  romantic: { colors: ['#e8a0b4', '#f5d6de', '#c47a8f', '#fce4ec'], shapes: ['petal', 'circle'], maxParticles: 30 },
  natural: { colors: ['#6b8f71', '#a8c5ab', '#4a6f50', '#c8dcc5'], shapes: ['leaf', 'circle'], maxParticles: 25 },
  modern: { colors: ['#7c3aed', '#a78bfa', '#5b21b6', '#c4b5fd'], shapes: ['star', 'circle'], maxParticles: 35 },
  serene: { colors: ['#8b7ec8', '#c4b8e8', '#6a5caa', '#ddd8ee'], shapes: ['star', 'circle'], maxParticles: 25 },
  cozy: { colors: ['#d4895a', '#e8bca0', '#b87048', '#f0d5c4'], shapes: ['circle', 'petal'], maxParticles: 20 },
  frost: { colors: ['#5b8def', '#a0c0f8', '#3a6fd6', '#d0e0f8'], shapes: ['star', 'circle'], maxParticles: 22 },
  moon: { colors: ['#7c8fa0', '#b0c0d0', '#5a6a7a', '#d0d8e0'], shapes: ['star', 'circle'], maxParticles: 28 },
  coral: { colors: ['#ff7f6e', '#ffb8a8', '#d85a48', '#ffe8e0'], shapes: ['circle', 'petal'], maxParticles: 28 },
  jade: { colors: ['#3a9d6e', '#80c8a0', '#2a7a50', '#c8e8d0'], shapes: ['leaf', 'circle'], maxParticles: 22 },
  terracotta: { colors: ['#c47048', '#e8a888', '#a05834', '#f0dcd0'], shapes: ['circle', 'petal'], maxParticles: 20 },
  lavender: { colors: ['#9b7ec8', '#c8b8e8', '#7a5aaa', '#e4d8f0'], shapes: ['star', 'circle'], maxParticles: 26 },
  ocean: { colors: ['#2a7a9a', '#70b8d8', '#1a5a76', '#c0dce8'], shapes: ['circle', 'star'], maxParticles: 22 },
  sunset: { colors: ['#e06050', '#f0a090', '#c04034', '#f0c040'], shapes: ['star', 'circle'], maxParticles: 32 },
  rosegold: { colors: ['#d4a0a8', '#e8c8cc', '#b07a84', '#f0e0e4'], shapes: ['petal', 'circle'], maxParticles: 24 },
  charcoal: { colors: ['#8a8a9a', '#c0c0cc', '#60606e', '#e0e0e8'], shapes: ['star', 'circle'], maxParticles: 20 },
  forest: { colors: ['#2d6a3a', '#68a868', '#1e5028', '#c0d8b8'], shapes: ['leaf', 'circle'], maxParticles: 20 },
  blush: { colors: ['#e0a0b0', '#f0c8d0', '#b06070', '#f8e8ee'], shapes: ['petal', 'circle'], maxParticles: 26 },
};

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;

  const s = p.size;
  switch (p.shape) {
    case 'petal': {
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'star': {
      ctx.beginPath();
      const spikes = 5;
      const outerR = s;
      const innerR = s * 0.4;
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'leaf': {
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.35);
      ctx.lineTo(0, s * 0.35);
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = p.opacity * 0.5;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      break;
    }
    default: {
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

export const AmbientCanvas = memo(function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const debouncedResize = () => {
      clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(resize, 100);
    };
    window.addEventListener('resize', debouncedResize);

    const config = themeConfig[theme as Theme] || themeConfig.romantic;
    const count = config.maxParticles;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const shape = config.shapes[Math.floor(Math.random() * config.shapes.length)];
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 2 + Math.random() * 4,
        speedX: -0.2 + Math.random() * 0.6,
        speedY: -0.3 + Math.random() * 0.8,
        opacity: 0.15 + Math.random() * 0.35,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        shape,
        color,
        phase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;

    let visible = true;

    const animate = () => {
      if (!visible) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.phase += 0.01;
        p.y += p.speedY + Math.sin(p.phase) * 0.15;
        p.x += p.speedX + (mouseRef.current.x - canvas.width / 2) * 0.0001;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 10) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.x < -10) p.x = canvas.width + 10;

        drawParticle(ctx, p);
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouse);

    const onVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimerRef.current);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
});
