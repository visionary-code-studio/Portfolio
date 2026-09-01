'use client';

import React from 'react';
import { motion, type Variants, type HTMLMotionProps } from 'framer-motion';

/**
 * ── Portfolio Tailored Scroll Animation Variants ───────────────
 */

export const scrollFadeUpVariants: Variants = {
  offscreen: {
    y: 45,
    opacity: 0,
    scale: 0.97,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 22,
      stiffness: 190,
      bounce: 0.18,
    },
  },
};

export const scrollCardVariants: Variants = {
  offscreen: {
    y: 65,
    opacity: 0,
    rotate: -1.5,
    scale: 0.95,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 170,
      bounce: 0.22,
      duration: 0.85,
    },
  },
};

export const scrollQuoteVariants: Variants = {
  offscreen: {
    y: 35,
    opacity: 0,
    filter: 'blur(6px)',
  },
  onscreen: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const scrollStaggerContainerVariants: Variants = {
  offscreen: { opacity: 0 },
  onscreen: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const scrollStaggerItemVariants: Variants = {
  offscreen: {
    y: 30,
    opacity: 0,
    scale: 0.94,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 22,
      stiffness: 220,
      bounce: 0.15,
    },
  },
};

export const scrollSlideHorizontalVariants = (direction: 'left' | 'right' = 'left'): Variants => ({
  offscreen: {
    x: direction === 'left' ? -50 : 50,
    opacity: 0,
  },
  onscreen: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 24,
      stiffness: 180,
      bounce: 0.15,
    },
  },
});

/**
 * ── ScrollTriggered Component Wrappers ─────────────────────────
 */

interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'fadeUp' | 'card' | 'quote' | 'slideLeft' | 'slideRight';
  delay?: number;
  amount?: number | 'some' | 'all';
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  amount = 0.2,
  once = true,
  className = '',
  style,
  ...props
}: ScrollRevealProps) {
  let selectedVariants = scrollFadeUpVariants;
  if (variant === 'card') selectedVariants = scrollCardVariants;
  if (variant === 'quote') selectedVariants = scrollQuoteVariants;
  if (variant === 'slideLeft') selectedVariants = scrollSlideHorizontalVariants('left');
  if (variant === 'slideRight') selectedVariants = scrollSlideHorizontalVariants('right');

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once, amount }}
      variants={selectedVariants}
      transition={{ delay }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ScrollStaggerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  staggerDelay?: number;
  amount?: number | 'some' | 'all';
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollStagger({
  children,
  staggerDelay = 0.08,
  amount = 0.15,
  once = true,
  className = '',
  style,
  ...props
}: ScrollStaggerProps) {
  const dynamicContainerVariants: Variants = {
    offscreen: { opacity: 0 },
    onscreen: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once, amount }}
      variants={dynamicContainerVariants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ScrollStaggerItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollStaggerItem({
  children,
  className = '',
  style,
  ...props
}: ScrollStaggerItemProps) {
  return (
    <motion.div
      variants={scrollStaggerItemVariants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}
