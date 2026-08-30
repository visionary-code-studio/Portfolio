'use client';

import React, { useRef, useState } from 'react';
import styles from './Card3D.module.css';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  onClick?: () => void;
  glare?: boolean;
}

export default function Card3D({
  children,
  className = '',
  intensity = 14,
  onClick,
  glare = true,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -intensity;
    const rotY = ((x - centerX) / centerX) * intensity;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(10px)`,
      transition: 'transform 0.08s ease-out',
    });

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.15,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.45) 0%, transparent 65%)`,
        transition: 'opacity 0.15s ease',
      });
    }
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      transition: 'transform 0.5s var(--ease-out-expo)',
    });
    setGlareStyle({
      opacity: 0,
      transition: 'opacity 0.5s ease',
    });
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card3DWrap} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
    >
      {children}
      {glare && <div className={styles.glareLayer} style={glareStyle} aria-hidden="true" />}
    </div>
  );
}
