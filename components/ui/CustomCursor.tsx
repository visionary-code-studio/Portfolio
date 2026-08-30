'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [clicking, setClicking] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };
    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const enter = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a, button, [role="button"], [data-cursor-hover]')) setHover(true);
    };
    const leave = () => setHover(false);

    document.addEventListener('mousemove', move);
    document.addEventListener('mousedown', down);
    document.addEventListener('mouseup', up);
    document.addEventListener('mouseover', enter);
    document.addEventListener('mouseout', leave);

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mousedown', down);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('mouseover', enter);
      document.removeEventListener('mouseout', leave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div className={`${styles.cursor} ${hover ? styles.hover : ''} ${clicking ? styles.clicking : ''}`}>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
    </div>
  );
}
