'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Hero3DCanvas from '@/components/3d/Hero3DCanvas';
import styles from './Hero.module.css';

interface HeroProps {
  data?: {
    eyebrow?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    heroVideo?: string;
    posterImage?: string;
    location?: string;
  };
}

export default function Hero({ data }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  const heroVideo = data?.heroVideo || '/video/Intro.mp4';
  const posterImage = data?.posterImage || '/images/profile_update.png';
  const firstName = data?.firstName || 'Vaibhav';
  const lastName = data?.lastName || 'Shaw';
  const role = data?.role || 'AIML Student · Full Stack Developer';
  const eyebrow = data?.eyebrow || 'Portfolio — 2026';
  const location = data?.location || 'Kolkata, West Bengal, India';

  // 1. Safe autoplay on initial mount (muted)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const tryAutoplay = () => {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setPaused(false))
          .catch(() => setPaused(true));
      }
    };

    if (video.readyState >= 2) {
      tryAutoplay();
    } else {
      video.addEventListener('canplay', tryAutoplay, { once: true });
    }

    return () => {
      video.removeEventListener('canplay', tryAutoplay);
    };
  }, [heroVideo]);

  // 2. Scroll-based pause and mute logic
  useEffect(() => {
    let wasScrolledDown = false;

    const handleScroll = () => {
      const video = videoRef.current;
      if (!video) return;

      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.55;

      if (scrollY > threshold) {
        if (!wasScrolledDown) {
          wasScrolledDown = true;
          video.muted = true;
          video.pause();
          setMuted(true);
          setPaused(true);
        }
      } else if (scrollY < 120) {
        if (wasScrolledDown) {
          wasScrolledDown = false;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
          setPaused(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
      {/* ── Enclosed Hero Box (Synth Era Boxed Frame) ── */}
      <div className={styles.heroBox}>
        {/* ── Cinematic Background Video (Enclosed in Box) ── */}
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

        {/* Atmospheric Vignette & Contrast Gradients */}
        <div className={styles.topGradient} aria-hidden="true" />
        <div className={styles.radialVignette} aria-hidden="true" />
        <div className={styles.bottomFade} aria-hidden="true" />

        {/* Interactive 3D Particle Space Coordinate Layer */}
        <Hero3DCanvas />

        {/* ── Top HUD Telemetry Bar ────────────────────────────── */}
        <div className={styles.topBar}>
          <div className={styles.eyebrow}>
            <span className={styles.liveDot} />
            <span>{eyebrow}</span>
            <span className={styles.starMotif}>✦</span>
          </div>
          <div className={styles.locationBadge}>
            {location}
          </div>
        </div>

        {/* ── Center Hero Stage & Editorial Typography ─────────── */}
        <div className={styles.centerContent}>
          <div className={styles.domainTag}>
            <span>AIML Engineer &amp; Full Stack Developer</span>
          </div>

          <h1 className={styles.giantTitle}>
            {firstName} <span className={styles.titleAccent}>{lastName}</span>
          </h1>

          <p className={styles.subtitle}>
            Architecting intelligent neural systems, high-performance web applications, and next-generation digital experiences.
          </p>

          <div className={styles.heroCtas}>
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

        {/* ── Bottom HUD Status Bar & Media Controls ────────────── */}
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

          <div className={styles.mediaControls}>
            <button
              className={styles.soundPill}
              onClick={toggleSound}
              aria-label={muted ? 'Unmute video sound' : 'Mute video sound'}
              data-cursor-hover
            >
              <span className={`${styles.soundDot} ${muted ? styles.muted : ''}`} />
              <span>{muted ? 'Tap For Sound' : 'Audio Live'}</span>
            </button>

            <button
              className={styles.ctrlBtn}
              onClick={togglePlay}
              aria-label={paused ? 'Play video' : 'Pause video'}
              data-cursor-hover
            >
              {paused ? (
                <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                  <polygon points="1 1, 11 7, 1 13" />
                </svg>
              ) : (
                <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                  <rect x="1" y="1" width="3.5" height="12" rx="1" />
                  <rect x="7.5" y="1" width="3.5" height="12" rx="1" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
