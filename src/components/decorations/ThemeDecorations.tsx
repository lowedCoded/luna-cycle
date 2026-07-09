'use client';

import { useSettingsStore } from '@/lib/store/settingsStore';
import { CanvasBackground } from './CanvasBackground';
import { motion } from 'framer-motion';

const decorMap: Record<string, { emoji: string; flourish: string }> = {
  romantic: { emoji: '🌸', flourish: 'blush & rose' },
  natural: { emoji: '🌿', flourish: 'sage & clay' },
  modern: { emoji: '🔮', flourish: 'midnight & violet' },
  serene: { emoji: '🕊️', flourish: 'mist & lavender' },
  cozy: { emoji: '🧸', flourish: 'honey & amber' },
  frost: { emoji: '🧊', flourish: 'ice & steel' },
  moon: { emoji: '🌙', flourish: 'obsidian & pearl' },
  coral: { emoji: '🐠', flourish: 'sunset reef' },
  jade: { emoji: '🎋', flourish: 'botanical luxe' },
  terracotta: { emoji: '🏺', flourish: 'mediterranean clay' },
  lavender: { emoji: '💜', flourish: 'blooming garden' },
  ocean: { emoji: '🌊', flourish: 'deep blue calm' },
  sunset: { emoji: '🌅', flourish: 'twilight drama' },
  rosegold: { emoji: '✨', flourish: 'precious glow' },
  charcoal: { emoji: '⬛', flourish: 'monochrome minimal' },
  forest: { emoji: '🌲', flourish: 'deep woods' },
  blush: { emoji: '🩷', flourish: 'watercolor soft' },
};

function FloatingEmoji({ emoji, className }: { emoji: string; className: string }) {
  return (
    <motion.div
      className={`absolute pointer-events-none select-none opacity-10 ${className}`}
      animate={{
        y: [0, -15, 0],
        rotate: [0, 5, 0, -5, 0],
      }}
      transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span className="text-6xl">{emoji}</span>
    </motion.div>
  );
}

export function ThemeDecorations() {
  const theme = useSettingsStore((s) => s.theme);

  return (
    <>
      <CanvasBackground theme={theme} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        {theme === 'romantic' && (
          <>
            <FloatingEmoji emoji="🌸" className="top-[10%] left-[5%]" />
            <FloatingEmoji emoji="🌹" className="top-[60%] right-[8%]" />
            <FloatingEmoji emoji="✨" className="bottom-[15%] left-[20%]" />
          </>
        )}
        {theme === 'natural' && (
          <>
            <FloatingEmoji emoji="🍃" className="top-[15%] right-[10%]" />
            <FloatingEmoji emoji="🌱" className="bottom-[25%] left-[8%]" />
          </>
        )}
        {theme === 'modern' && (
          <>
            <FloatingEmoji emoji="✦" className="top-[12%] right-[12%]" />
            <FloatingEmoji emoji="◇" className="bottom-[30%] left-[10%]" />
          </>
        )}
        {theme === 'serene' && (
          <>
            <FloatingEmoji emoji="🕊️" className="top-[20%] left-[5%]" />
            <FloatingEmoji emoji="☁️" className="bottom-[20%] right-[10%]" />
          </>
        )}
        {theme === 'cozy' && (
          <>
            <FloatingEmoji emoji="🍂" className="top-[15%] left-[8%]" />
            <FloatingEmoji emoji="☕" className="bottom-[20%] right-[10%]" />
          </>
        )}
        {theme === 'frost' && (
          <>
            <FloatingEmoji emoji="❄️" className="top-[15%] right-[15%]" />
            <FloatingEmoji emoji="💎" className="bottom-[25%] left-[8%]" />
          </>
        )}
        {theme === 'moon' && (
          <>
            <FloatingEmoji emoji="🌙" className="top-[10%] right-[10%]" />
            <FloatingEmoji emoji="⭐" className="bottom-[20%] left-[8%]" />
            <FloatingEmoji emoji="✨" className="top-[40%] left-[50%]" />
          </>
        )}
        {theme === 'coral' && (
          <>
            <FloatingEmoji emoji="🐠" className="top-[12%] left-[6%]" />
            <FloatingEmoji emoji="🪸" className="bottom-[20%] right-[10%]" />
          </>
        )}
        {theme === 'jade' && (
          <>
            <FloatingEmoji emoji="🎋" className="top-[15%] right-[12%]" />
            <FloatingEmoji emoji="🍃" className="bottom-[25%] left-[10%]" />
          </>
        )}
        {theme === 'terracotta' && (
          <>
            <FloatingEmoji emoji="🏺" className="top-[10%] left-[10%]" />
            <FloatingEmoji emoji="🌿" className="bottom-[20%] right-[8%]" />
          </>
        )}
        {theme === 'lavender' && (
          <>
            <FloatingEmoji emoji="💜" className="top-[12%] right-[8%]" />
            <FloatingEmoji emoji="🦋" className="bottom-[20%] left-[10%]" />
          </>
        )}
        {theme === 'ocean' && (
          <>
            <FloatingEmoji emoji="🌊" className="top-[10%] left-[5%]" />
            <FloatingEmoji emoji="🐚" className="bottom-[20%] right-[10%]" />
          </>
        )}
        {theme === 'sunset' && (
          <>
            <FloatingEmoji emoji="🌅" className="top-[10%] right-[10%]" />
            <FloatingEmoji emoji="🌇" className="bottom-[25%] left-[8%]" />
          </>
        )}
        {theme === 'rosegold' && (
          <>
            <FloatingEmoji emoji="✨" className="top-[12%] left-[8%]" />
            <FloatingEmoji emoji="💎" className="bottom-[20%] right-[10%]" />
          </>
        )}
        {theme === 'charcoal' && (
          <>
            <FloatingEmoji emoji="⬛" className="top-[15%] right-[15%]" />
            <FloatingEmoji emoji="◻️" className="bottom-[25%] left-[8%]" />
          </>
        )}
        {theme === 'forest' && (
          <>
            <FloatingEmoji emoji="🌲" className="top-[10%] left-[5%]" />
            <FloatingEmoji emoji="🍄" className="bottom-[20%] right-[10%]" />
          </>
        )}
        {theme === 'blush' && (
          <>
            <FloatingEmoji emoji="🩷" className="top-[12%] right-[12%]" />
            <FloatingEmoji emoji="🫧" className="bottom-[20%] left-[10%]" />
          </>
        )}
      </div>
    </>
  );
}
