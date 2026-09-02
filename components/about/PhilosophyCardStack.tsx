'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import styles from './PhilosophyCardStack.module.css';

export interface PhilosophyCard {
  id: string;
  category: string;
  quote: string;
  author: string;
  themeColor: string;
  image: string;
  descriptor: string;
}

interface Props {
  tagline?: string;
}

const DEFAULT_PHILOSOPHIES: PhilosophyCard[] = [
  {
    id: 'phil-1',
    category: 'LIFE & STOICISM',
    quote: 'Control the controllable. Ignore the rest completely.',
    author: 'Personal Mantra',
    themeColor: '#c8f04a',
    image: '/images/philosophy-prague.png',
    descriptor: 'Life',
  },
  {
    id: 'phil-2',
    category: 'LEARNING & MASTERY',
    quote: 'The expert was once a beginner. Mastery requires patience.',
    author: 'Personal Mantra',
    themeColor: '#38bdf8',
    image: '/images/philosophy-mastery.jpg',
    descriptor: 'Learning',
  },
  {
    id: 'phil-3',
    category: 'DREAMS & AMBITION',
    quote: 'You have to dream before your dreams can come true.',
    author: 'Dr. APJ Abdul Kalam',
    themeColor: '#f59e0b',
    image: '/images/philosophy-dreams.jpg',
    descriptor: 'Success',
  },
  {
    id: 'phil-4',
    category: 'INVENTION & SOLITUDE',
    quote: 'Be alone, that is the secret of invention; be alone, that is when ideas are born.',
    author: 'Nikola Tesla',
    themeColor: '#a855f7',
    image: '/images/philosophy-tesla.jpg',
    descriptor: 'Invention',
  },
  {
    id: 'phil-5',
    category: 'DISCIPLINED EXECUTION',
    quote: 'Relentless curiosity with disciplined execution.',
    author: 'Life Mantra',
    themeColor: '#10b981',
    image: '/images/profile_update.png',
    descriptor: 'Growth',
  },
];

export default function PhilosophyCardStack({ tagline }: Props) {
  const [cards, setCards] = useState<PhilosophyCard[]>(() => {
    if (tagline) {
      return DEFAULT_PHILOSOPHIES.map((c) =>
        c.id === 'phil-5' ? { ...c, quote: tagline } : c
      );
    }
    return DEFAULT_PHILOSOPHIES;
  });

  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Swipe top card to the back of the stack
  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => {
      setCards((prev) => {
        const next = [...prev];
        const first = next.shift();
        if (first) next.push(first);
        return next;
      });
      setSwipeDirection(null);
    }, 280);
  };

  const topCard = cards[0];

  return (
    <div className={styles.stackSection}>
      <div className={styles.stackHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.motif}>✦</span>
          <span className={styles.sectionTag}>Life Mantra &amp; Philosophy</span>
        </div>
        <span className={styles.deckCounter}>
          01 / {cards.length}
        </span>
      </div>

      {/* ── Interactive Card Stack Container ── */}
      <div className={styles.stackViewport}>
        <div className={styles.cardsTrack}>
          {cards.slice(0, 3).map((card, index) => {
            const isTop = index === 0;

            return (
              <CardItem
                key={card.id}
                card={card}
                index={index}
                isTop={isTop}
                swipeDirection={isTop ? swipeDirection : null}
                onSwipe={handleSwipe}
              />
            );
          })}
        </div>
      </div>

      {/* ── Gesture Guidance & Controls ── */}
      <div className={styles.controlsRow}>
        <button
          className={styles.swipeBtn}
          onClick={() => handleSwipe('left')}
          aria-label="Swipe card left"
          data-cursor-hover
        >
          <span>←</span>
          <span>Swipe Left</span>
        </button>

        <div className={styles.swipeTip}>
          <span className={styles.dragIcon}>⇄</span>
          <span>Swipe or drag card left / right</span>
        </div>

        <button
          className={styles.swipeBtn}
          onClick={() => handleSwipe('right')}
          aria-label="Swipe card right"
          data-cursor-hover
        >
          <span>Swipe Right</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

interface CardItemProps {
  card: PhilosophyCard;
  index: number;
  isTop: boolean;
  swipeDirection: 'left' | 'right' | null;
  onSwipe: (dir: 'left' | 'right') => void;
}

function CardItem({ card, index, isTop, swipeDirection, onSwipe }: CardItemProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-18, 0, 18]);
  const opacity = useTransform(x, [-260, -180, 0, 180, 260], [0, 1, 1, 1, 0]);

  // Stack offsets based on position in queue (0 = top, 1 = middle, 2 = bottom)
  const scale = 1 - index * 0.05;
  const translateY = index * 14;
  const zIndex = 30 - index * 5;

  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 90;
    if (info.offset.x < -swipeThreshold) {
      onSwipe('left');
    } else if (info.offset.x > swipeThreshold) {
      onSwipe('right');
    }
  };

  return (
    <motion.div
      className={styles.card}
      style={{
        zIndex,
        scale,
        y: translateY,
        ...(isTop ? { x, rotate, opacity } : {}),
      }}
      animate={
        isTop && swipeDirection
          ? {
              x: swipeDirection === 'left' ? -380 : 380,
              rotate: swipeDirection === 'left' ? -24 : 24,
              opacity: 0,
              transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
            }
          : {
              scale,
              y: translateY,
              opacity: 1 - index * 0.18,
              transition: { duration: 0.35, ease: 'easeOut' },
            }
      }
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={handleDragEnd}
      whileTap={isTop ? { cursor: 'grabbing' } : undefined}
    >
      {/* Visual Background Photo */}
      <div className={styles.cardImageWrap}>
        <Image
          src={card.image}
          alt={card.category}
          fill
          priority={index === 0}
          className={styles.cardImg}
          sizes="(max-width: 768px) 90vw, 460px"
        />
        <div className={styles.imageOverlay} />
        <div className={styles.vignetteOverlay} />
      </div>

      {/* Card Content & Typographic Poetry */}
      <div className={styles.cardInner}>
        <div className={styles.cardTopBar}>
          <span
            className={styles.categoryPill}
            style={{ borderColor: card.themeColor, color: card.themeColor }}
          >
            ✦ {card.category}
          </span>
          <span className={styles.descriptorBadge}>
            {card.descriptor}
          </span>
        </div>

        <div className={styles.quoteBlock}>
          <span className={styles.quoteMark}>“</span>
          <p className={styles.quoteText}>{card.quote}</p>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.authorRow}>
            <span className={styles.authorDash}>—</span>
            <span className={styles.authorName}>{card.author}</span>
          </div>
          <div className={styles.liveIndicator}>
            <span className={styles.pulsingDot} style={{ background: card.themeColor }} />
            <span>MANTRA</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
