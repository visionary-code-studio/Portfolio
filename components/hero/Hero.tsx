'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Hero3DCanvas from '@/components/3d/Hero3DCanvas';
import styles from './Hero.module.css';

interface HeroProps {
  data?: {
    firstName?: string;
    lastName?: string;
    role?: string;
    tagline?: string;
    location?: string;
    eyebrow?: string;
    heroVideo?: string;
    avatar?: string;
  };
}

export default function Hero({ data }: HeroProps) {
  const firstName = data?.firstName || 'VAIBHAV';
  const lastName = data?.lastName || 'SHAW';
  const role = data?.role || 'AIML Student & Full Stack Developer';
  const location = data?.location || 'Greater Noida, India';
  const eyebrow = data?.eyebrow || 'PORTFOLIO 2026';
  const heroVideo = data?.heroVideo || '/hero-loop.mp4';
  const posterImage = data?.avatar || '/images/profile_update.png';

  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  // Auto-play muted on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setPaused(false))
        .catch(() => {
          setPaused(true);
          const handleFirstInteraction = () => {
            if (videoRef.current) {
              videoRef.current.play().then(() => setPaused(false)).catch(() => {});
            }
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('scroll', handleFirstInteraction);
          };
          window.addEventListener('click', handleFirstInteraction, { once: true });
          window.addEventListener('scroll', handleFirstInteraction, { once: true });
        });
    }
  }, []);

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setPaused(false)).catch(() => {});
    } else {
      video.pause();
      setPaused(true);
    }
  }, []);

  const toggleSound = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setMuted(nextMuted);

    if (!nextMuted && video.paused) {
      video.play().then(() => setPaused(false)).catch(() => {});
    }
  }, []);

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
      {/* ── 1. Full-Bleed Cinematic Background Video ─────────── */}
      <div className={styles.bgVideoContainer}>
        <video
          ref={videoRef}
          className={styles.bgVideo}
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          poster={posterImage}
          preload="auto"
        />
      </div>

      {/* Atmospheric Multi-Layer Dark Vignettes & Depth Filters */}
      <div className={styles.topGradient} aria-hidden="true" />
      <div className={styles.radialVignette} aria-hidden="true" />
      <div className={styles.bottomFade} aria-hidden="true" />

      {/* Interactive 3D Particle Space Coordinate Layer */}
      <Hero3DCanvas />

      {/* ── 2. Top HUD Telemetry Bar ─────────────────────────── */}
      <div className={styles.topBar}>
        <div className={styles.eyebrow}>
          <span className={styles.liveDot} />
          <span>SYSTEM ONLINE · {eyebrow}</span>
          <span className={styles.starMotif}>✦</span>
        </div>

        <div className={styles.locationBadge}>
          <span className={styles.locationIcon}>📍</span>
          <span>{location}</span>
        </div>
      </div>

      {/* ── 3. Giant Layered Cyber-Editorial Stage ─────────────── */}
      <div className={styles.heroStage}>
        {/* Layer A: Giant Background Typography (Spans Entire Canvas Behind Subject) */}
        <div className={styles.giantBackdrop} aria-hidden="true">
          <span className={styles.backdropFirstName}>{firstName}</span>
          <span className={styles.backdropLastName}>{lastName}</span>
        </div>

        {/* Layer B: Overlapping Expressive Brush Neon Script & Action CTAs */}
        <div className={styles.centerStage}>
          <div className={styles.scriptWrapper}>
            <h1 className={styles.scriptNeon}>NEURAL ARCHITECT</h1>
            <p className={styles.scriptTagline}>Architected for tomorrow.</p>
          </div>

          <div className={styles.heroActions}>
            <button
              className={styles.ctaPrimary}
              onClick={scrollToIdentity}
              data-cursor-hover
            >
              <span>Explore Portfolio</span>
              <span>↓</span>
            </button>
            <button
              className={styles.ctaSecondary}
              onClick={scrollToContact}
              data-cursor-hover
            >
              <span>Let&apos;s Connect</span>
              <span>⚡</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Bottom HUD: Specifications, Scroll Cue & Spotlight Card ── */}
      <div className={styles.bottomBar}>
        {/* Left: System Specification Block (Ref: LIMITED PRE-ORDERS) */}
        <div className={styles.specBlock}>
          <span className={styles.specEyebrow}>SYSTEM SPECIALIZATION</span>
          <h3 className={styles.specTitle}>
            Intelligent Models &amp; Resilient Architectures
          </h3>
          <p className={styles.specDesc}>
            Engineering next-generation AI/ML architectures, autonomous neural systems, and high-performance digital experiences.
          </p>
        </div>

        {/* Center: Interactive Scroll Cue */}
        <button
          className={styles.scrollCue}
          onClick={scrollToIdentity}
          aria-label="Scroll down to explore"
          data-cursor-hover
        >
          <span className={styles.scrollLabel}>Scroll</span>
          <span className={styles.scrollLine} />
        </button>

        {/* Right: Glassmorphic Spotlight HUD Card (Ref: THIS MONTH'S EXCLUSIVE) */}
        <div className={styles.spotlightCard}>
          <div className={styles.spotlightTop}>
            <span className={styles.spotlightTag}>THIS CYCLE&apos;S FOCUS</span>
            <span className={styles.spotlightLiveBadge}>
              <span className={styles.spotlightLiveDot} />
              ACTIVE
            </span>
          </div>

          <h4 className={styles.spotlightHeading}>
            ISRO BAH Hackathon &amp; IIT Guwahati Analytics
          </h4>
          <p className={styles.spotlightDesc}>
            Deep neural classification, geospatial mapping, and scalable edge systems.
          </p>

          <div className={styles.spotlightBottom}>
            <a href="#proof" className={styles.spotlightAction} data-cursor-hover>
              <span>Inspect Proof</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>

            {/* Docked Audio & Playback Controls */}
            <div className={styles.mediaDock}>
              <button
                className={styles.soundPill}
                onClick={toggleSound}
                aria-label={muted ? 'Unmute video sound' : 'Mute video sound'}
                data-cursor-hover
              >
                <span className={`${styles.soundDot} ${muted ? styles.muted : ''}`} />
                <span>{muted ? 'Sound' : 'Live'}</span>
              </button>

              <button
                className={styles.ctrlBtn}
                onClick={togglePlay}
                aria-label={paused ? 'Play video' : 'Pause video'}
                data-cursor-hover
              >
                {paused ? (
                  <svg width="10" height="12" viewBox="0 0 12 14" fill="currentColor">
                    <polygon points="1 1, 11 7, 1 13" />
                  </svg>
                ) : (
                  <svg width="10" height="12" viewBox="0 0 12 14" fill="currentColor">
                    <rect x="1" y="1" width="3.5" height="12" rx="1" />
                    <rect x="7.5" y="1" width="3.5" height="12" rx="1" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
