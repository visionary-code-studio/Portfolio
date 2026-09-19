'use client';

import { useState, useRef } from 'react';
import Hero3DCanvas from '@/components/3d/Hero3DCanvas';
import styles from './Hero.module.css';

interface HeroProps {
  data?: {
    eyebrow?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    posterImage?: string;
    location?: string;
  };
}

export default function Hero({ data }: HeroProps) {
  const firstName = data?.firstName || 'VAIBHAV';
  const lastName = data?.lastName || 'SHAW';
  const role = data?.role || 'AIML Student · Full Stack Developer';
  const location = data?.location || 'Kolkata, West Bengal, India';

  // Interactive Cursor Torch: B&W to Color Spotlight with zero-offset precision
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, active: false });
  const portraitInnerRef = useRef<HTMLDivElement>(null);

  const handlePortraitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!portraitInnerRef.current) return;
    const rect = portraitInnerRef.current.getBoundingClientRect();
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handlePortraitMouseLeave = () => {
    setSpotlight((prev) => ({ ...prev, active: false }));
  };

  const handlePortraitTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (portraitInnerRef.current && e.touches.length > 0) {
      const rect = portraitInnerRef.current.getBoundingClientRect();
      setSpotlight({
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
        active: true,
      });
    }
  };

  const scrollToIdentity = () => {
    const el = document.getElementById('identity');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };



  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroBox}>
        {/* Interactive 3D Particle Space Coordinate Layer */}
        <Hero3DCanvas />

        {/* ── Top Row: Massive Centered Headline "VAIBHAV SHAW" ── */}
        <div className={styles.headlineRow}>
          <h1 className={styles.massiveTitle}>
            <span className={styles.massiveOutline}>{firstName}</span>{' '}
            <span className={styles.massiveSolid}>{lastName}</span>
          </h1>
        </div>

        {/* ── Center Stage: Portrait (Anchored Center) + Left Editorial + Right Socials ── */}
        <div className={styles.stageGrid}>
          {/* Left Column: Role & CTA */}
          <div className={styles.leftCol}>
            <div className={styles.roleBadge}>
              <span className={styles.livePulse} />
              <span>AIML Engineer &amp; Full Stack Developer</span>
            </div>

            <p className={styles.heroBio}>
              Architecting intelligent neural systems, high-performance web applications, and next-generation digital experiences.
            </p>

            <div className={styles.ctaGroup}>
              <button
                className={styles.primaryBtn}
                onClick={scrollToIdentity}
                data-cursor-hover
              >
                <span>Explore Portfolio</span>
                <span className={styles.btnArrow}>↓</span>
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={scrollToContact}
                data-cursor-hover
              >
                <span>Let&apos;s Connect</span>
                <span>⚡</span>
              </button>
            </div>
          </div>

          {/* Center Portrait Anchor: Interactive B&W to Color Spotlight Reveal */}
          <div
            className={styles.portraitWrap}
            onMouseMove={handlePortraitMouseMove}
            onMouseLeave={handlePortraitMouseLeave}
            onTouchMove={handlePortraitTouchMove}
            onTouchEnd={handlePortraitMouseLeave}
          >
            <div
              ref={portraitInnerRef}
              className={styles.portraitInner}
              style={{
                '--spotlight-x': `${spotlight.x}px`,
                '--spotlight-y': `${spotlight.y}px`,
                '--spotlight-active': spotlight.active ? '1' : '0',
              } as React.CSSProperties}
            >
              {/* Base Layer: Black & White Keynote Speaker (1:1 Pixel Match) */}
              <img
                src="/images/vaibhav_speaker_bw.png?v=v2_aligned"
                alt={`${firstName} ${lastName}`}
                className={styles.portraitImgBw}
                draggable={false}
              />

              {/* Top Layer: Full Color Revealed by Cursor Torch Spotlight (1:1 Pixel Match) */}
              <img
                src="/images/vaibhav_speaker.png?v=v2_aligned"
                alt={`${firstName} ${lastName} in Color`}
                className={styles.portraitImgColor}
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* ── Bottom HUD Status Bar ────────────────────────── */}
        <div className={styles.bottomBar}>
          <div className={styles.hudRole}>
            <span className={styles.hudRoleTitle}>Primary Focus</span>
            <span className={styles.hudRoleDesc}>{role}</span>
          </div>

          <button
            className={styles.scrollCue}
            onClick={scrollToIdentity}
            aria-label="Scroll down to explore"
            data-cursor-hover
          >
            <span className={styles.scrollLabel}>Scroll</span>
            <span className={styles.scrollLine} />
          </button>

          <div className={styles.hudRole} style={{ textAlign: 'right' }}>
            <span className={styles.hudRoleTitle}>Base Location</span>
            <span className={styles.hudRoleDesc}>{location}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
