'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useSpring(cursorX, { stiffness: 150, damping: 15, mass: 0.5 });
  const trailY = useSpring(cursorY, { stiffness: 150, damping: 15, mass: 0.5 });
  const isHovering = useRef(false);
  const isVisible = useRef(false);

  const moveCursor = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    if (!isVisible.current) isVisible.current = true;
  }, [cursorX, cursorY]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const tag = target.tagName.toLowerCase();
    const interactive = tag === 'a' || tag === 'button' || tag === 'input' || tag === 'textarea' || tag === 'select' ||
      target.closest('a, button, [role="button"], input, textarea, select, [tabindex]');
    isHovering.current = !!interactive;
  }, []);

  useEffect(() => {
    document.body.style.cursor = 'none';
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [moveCursor, handleMouseOver]);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[9999] w-3 h-3 rounded-full bg-accent"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="pointer-events-none fixed z-[9998] w-8 h-8 rounded-full"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'var(--accent)',
          opacity: 0.25,
        }}
      />
    </>
  );
}
