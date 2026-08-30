'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Hero3DCanvas from '@/components/3d/Hero3DCanvas';
import Card3D from '@/components/ui/Card3D';
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
  const role = data?.role || 'Developer · AIML Engineer · Innovator · Designer';
  const eyebrow = data?.eyebrow || 'Portfolio — 2026';
  const location = data?.location || 'Kolkata, India';

  // 1. Safe autoplay on initial website load
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict browser requirement for autoplay without user interaction
    video.muted = true;
    video.defaultMuted = true;

    const tryAutoplay = () => {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPaused(false);
          })
          .catch(() => {
            // Autoplay was blocked by browser policy; wait for user interaction
            setPaused(true);
          });
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

  // 2. Reliable scroll-based pause and mute
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

    // If unmuted and video was paused, start playing
    if (!nextMuted && video.paused) {
      video.play().then(() => setPaused(false)).catch(() => {});
    }
  }, []);

  const scrollDown = () => {
    const id = document.getElementById('identity');
    if (id) id.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero} id="home">
      {/* 3D Mathematical Coordinate & Neural Particle Layer */}
      <Hero3DCanvas />

      {/* Atmospheric Ambient Glow Layer */}
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.overlay} aria-hidden="true" />

      {/* Top Bar: Eyebrow + Location */}
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

      {/* Center Stage: The Fitted Video Container with 3D Depth */}
      <div className={styles.stageWrapper}>
        <Card3D intensity={6} className={styles.card3DStageWrap} glare={true}>
          <div
            className={styles.videoStage}
            onClick={togglePlay}
            role="region"
            aria-label="Video Player Stage"
          >
            <video
              ref={videoRef}
              className={styles.mainVideo}
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
              poster={posterImage}
              preload="auto"
            />

            {/* Sound Toggle Floating Badge */}
            <div className={styles.videoBadgeOverlay}>
              <button
                className={styles.soundHint}
                onClick={toggleSound}
                aria-label={muted ? 'Unmute video' : 'Mute video'}
                data-cursor-hover
              >
                <span className={styles.soundPulse} />
                <span>{muted ? 'Tap For Sound' : 'Audio Live'}</span>
              </button>
            </div>

            {/* Center Play Button Overlay when paused */}
            {paused && (
              <div
                className={styles.centerPlayOverlay}
                onClick={togglePlay}
                aria-label="Play video"
              >
                <button className={styles.centerPlayBtn} aria-label="Play video" data-cursor-hover>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </Card3D>
      </div>

      {/* Bottom Strip: Name, Role, Scroll Indicator & Controls */}
      <div className={styles.bottomStrip}>
        <div className={styles.heroTitles}>
          <h1 className={styles.name}>
            {firstName} <span className={styles.nameAccent}>{lastName}</span>
          </h1>
          <p className={styles.role}>{role}</p>
        </div>

        <button
          className={styles.scrollCue}
          onClick={scrollDown}
          aria-label="Scroll to discover"
          data-cursor-hover
        >
          <span className={styles.scrollLabel}>Scroll</span>
          <span className={styles.scrollLine} />
        </button>

        <div className={styles.ctrlBtns}>
          <button
            className={styles.ctrlBtn}
            onClick={togglePlay}
            aria-label={paused ? 'Play' : 'Pause'}
            data-cursor-hover
          >
            {paused ? (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                <path d="M1 1l10 6-10 6V1z" />
              </svg>
            ) : (
              <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                <rect x="0" y="0" width="3.5" height="12" rx="1" />
                <rect x="6.5" y="0" width="3.5" height="12" rx="1" />
              </svg>
            )}
          </button>
          <button
            className={styles.ctrlBtn}
            onClick={toggleSound}
            aria-label={muted ? 'Unmute' : 'Mute'}
            data-cursor-hover
          >
            {muted ? (
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="M2 4.5h2.5L8 2v10L4.5 9.5H2V4.5z" fill="currentColor" stroke="none" />
                <line x1="11" y1="4" x2="15" y2="10" /><line x1="15" y1="4" x2="11" y2="10" />
              </svg>
            ) : (
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="M2 4.5h2.5L8 2v10L4.5 9.5H2V4.5z" fill="currentColor" stroke="none" />
                <path d="M10.5 4.5a3 3 0 0 1 0 5" />
                <path d="M12.5 2.5a6 6 0 0 1 0 9" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
