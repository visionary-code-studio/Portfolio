'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Card3D from '@/components/ui/Card3D';
import styles from './PptShelf.module.css';
import type { Presentation } from '@/types';

interface Props {
  items: Presentation[];
  onOpen: (item: Presentation) => void;
}

export default function PptShelf({ items, onOpen }: Props) {
  const [active, setActive] = useState('All');
  const shelfRef = useRef<HTMLDivElement>(null);

  // Compute categories dynamically with counts
  const catCounts: { [key: string]: number } = { All: items.length };
  items.forEach((p) => {
    catCounts[p.category] = (catCounts[p.category] || 0) + 1;
  });

  const categories = Object.keys(catCounts);

  const filtered = active === 'All'
    ? items
    : items.filter((p) => p.category === active);

  const scrollShelf = (direction: 'left' | 'right') => {
    if (!shelfRef.current) return;
    const amount = direction === 'left' ? -360 : 360;
    shelfRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className={styles.section} id="ppt">
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.sectionMeta}>
            <span className={styles.starMotif}>✦</span>
            <span>04 — The Archive</span>
          </div>
          <h2 className={styles.sectionTitle}>The Archive</h2>
          <p className={styles.subtitle}>Designing technical ideas into research presentations.</p>
        </div>

        <div className={styles.headerControls}>
          {/* Category Filter Chips with Live Item Counts */}
          <div className={styles.filters}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${active === cat ? styles.active : ''}`}
                onClick={() => setActive(cat)}
                data-cursor-hover
              >
                <span>{cat}</span>
                <span className={styles.filterCount}>[{catCounts[cat]}]</span>
              </button>
            ))}
          </div>

          {/* Left / Right Shelf Navigation */}
          <div className={styles.navArrows}>
            <button
              onClick={() => scrollShelf('left')}
              className={styles.navArrowBtn}
              aria-label="Scroll left"
              data-cursor-hover
            >
              ←
            </button>
            <button
              onClick={() => scrollShelf('right')}
              className={styles.navArrowBtn}
              aria-label="Scroll right"
              data-cursor-hover
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Shelf with 3D Perspective Cards */}
      <div className={styles.shelfOuter} ref={shelfRef}>
        <div className={styles.shelf}>
          {filtered.map((ppt, i) => (
            <Card3D
              key={ppt.id}
              className={styles.card3DItem}
              intensity={12}
              onClick={() => onOpen(ppt)}
              glare={true}
            >
              <div
                className={styles.cardInner}
                data-cursor-hover
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpen(ppt)}
                aria-label={`Open presentation: ${ppt.title}`}
              >
                <div className={styles.cardTopRow}>
                  <span className={styles.cardNum}>
                    {String(i + 1).padStart(2, '0')} // ARCHIVE
                  </span>
                  <span className={styles.cardYearBadge}>{ppt.year}</span>
                </div>

                <div className={styles.cardThumb}>
                  {ppt.preview ? (
                    <Image
                      src={ppt.preview}
                      alt={ppt.title}
                      fill
                      className={styles.cardThumbImg}
                      sizes="320px"
                    />
                  ) : (
                    <div className={styles.thumbPlaceholder}>
                      <span className={styles.thumbIcon}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={styles.thumbCat}>{ppt.category}</span>
                    </div>
                  )}
                  <div className={styles.cardOverlay}>
                    <span className={styles.cardOpenLabel}>View Slides ↗</span>
                  </div>
                </div>

                <div className={styles.cardMeta}>
                  <span className={styles.cardCategory}>{ppt.category}</span>
                  <h3 className={styles.cardTitle}>{ppt.title}</h3>
                  <p className={styles.cardDesc}>{ppt.description}</p>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
}
