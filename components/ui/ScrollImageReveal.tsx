'use client';

import React, { useRef, useState, useEffect } from 'react';
import styles from './ScrollImageReveal.module.css';

export interface ScrollImageRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  curtainColor?: string;
  className?: string;
  glare?: boolean;
  threshold?: number;
  once?: boolean;
}

export default function ScrollImageReveal({
  children,
  direction = 'up',
  delay = 0,
  curtainColor = '#0e121a',
  className = '',
  glare = true,
  threshold = 0.15,
  once = true,
}: ScrollImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check if element is already in viewport on mount
    const checkInitialVisibility = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(() => setIsRevealed(true), delay);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsRevealed(true);
          }, delay);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(el);
    checkInitialVisibility();

    return () => {
      observer.disconnect();
    };
  }, [delay, once, threshold]);

  const directionClass =
    direction === 'down'
      ? styles.directionDown
      : direction === 'left'
      ? styles.directionLeft
      : direction === 'right'
      ? styles.directionRight
      : styles.directionUp;

  return (
    <div
      ref={containerRef}
      className={`${styles.revealContainer} ${directionClass} ${isRevealed ? styles.revealed : ''} ${className}`}
      style={{ '--curtain-bg': curtainColor } as React.CSSProperties}
    >
      {/* Sliding Shutter Curtain */}
      <div className={styles.curtain} aria-hidden="true" />
      <div className={styles.accentEdge} aria-hidden="true" />

      {/* Glossy Reflection Shimmer */}
      {glare && <div className={styles.shimmerSweep} aria-hidden="true" />}

      {/* Unveiled Visual Content with Smooth Parallax Settle */}
      <div className={styles.revealContent}>{children}</div>
    </div>
  );
}
