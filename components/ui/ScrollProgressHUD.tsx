'use client';

import { useEffect, useState } from 'react';
import styles from './ScrollProgressHUD.module.css';

const chapters = [
  { id: 'home', num: '01', title: 'Home' },
  { id: 'identity', num: '02', title: 'Identity' },
  { id: 'about', num: '03', title: 'About' },
  { id: 'ppt', num: '04', title: 'Archive' },
  { id: 'certs', num: '05', title: 'Proof' },
  { id: 'interests', num: '06', title: 'Interests' },
  { id: 'future', num: '07', title: 'Future' },
  { id: 'contact', num: '08', title: 'Connect' },
];

export default function ScrollProgressHUD() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollPercent(Math.min(100, Math.max(0, progress)));

      // Detect active section
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = chapters.length - 1; i >= 0; i--) {
        const el = document.getElementById(chapters[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveIdx(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const current = chapters[activeIdx] || chapters[0];

  return (
    <aside className={styles.hud} aria-label="Chapter progress navigation">
      {/* Chapter Counter Badge */}
      <div className={styles.chapterBadge}>
        <span className={styles.activeStar}>✦</span>
        <span className={styles.chapterText}>
          {current.num} / {String(chapters.length).padStart(2, '0')}
        </span>
        <span className={styles.chapterTitle}>{current.title}</span>
      </div>

      {/* Progress Track with Dots */}
      <div className={styles.trackWrapper}>
        <div className={styles.trackBar}>
          <div className={styles.progressFill} style={{ height: `${scrollPercent}%` }} />
        </div>

        <div className={styles.dotList}>
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => scrollTo(ch.id)}
              className={`${styles.dotBtn} ${idx === activeIdx ? styles.activeDot : ''}`}
              aria-label={`Jump to Chapter ${ch.num}: ${ch.title}`}
              data-cursor-hover
            >
              <span className={styles.dotTooltip}>{ch.num} {ch.title}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
