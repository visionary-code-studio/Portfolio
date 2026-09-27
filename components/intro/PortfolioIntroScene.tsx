'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
import styles from './PortfolioIntroScene.module.css';

interface PortfolioIntroSceneProps {
  onIntroComplete?: () => void;
}

export default function PortfolioIntroScene({ onIntroComplete }: PortfolioIntroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Step 0: Card 1 (AIML Engineer) — 5s rest
  // Step 1: Card 2 (Graphic Designer) — 5s rest
  // Step 2: Card 3 (Full-Stack Dev) — 5s rest
  // Step 3: AT LAST — ONLY the Video Card is included! Sized per Image 2, auto-plays audibly
  const [introStep, setIntroStep] = useState<0 | 1 | 2 | 3>(0);
  const [isDriftingUp, setIsDriftingUp] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Parallax Coordinates for 3D Galaxy
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isZoomingInRef = useRef(false);

  // Exit Intro and unveil main portfolio Home page with hyperspace galaxy zoom-in
  const handleEnterPortfolio = useCallback(() => {
    setIsExiting(true);
    isZoomingInRef.current = true;
    document.body.style.overflow = '';
    
    // Stop all audio on exit
    window.dispatchEvent(new CustomEvent('stopFluteAudio'));
    if (videoRef.current) {
      videoRef.current.pause();
    }

    setTimeout(() => {
      if (onIntroComplete) onIntroComplete();
    }, 750);
  }, [onIntroComplete]);

  // Turn off flute audio completely and enable welcoming video audio
  const startWelcomingVideo = useCallback(() => {
    // 1. Cut off flute audio from splash screen
    window.dispatchEvent(new CustomEvent('stopFluteAudio'));
    document.querySelectorAll('audio').forEach((a) => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch {}
    });

    // 2. Play welcoming video with sound automatically without any button
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser strictly blocks unmuted autoplay, unlock on first user gesture
          const unlock = () => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.volume = 1.0;
              videoRef.current.play().catch(() => {});
            }
            window.removeEventListener('pointerdown', unlock);
          };
          window.addEventListener('pointerdown', unlock, { once: true });
        });
      }
    }
  }, []);

  // ── 1. THREE.JS 3D SPIRAL GALAXY BACKGROUND (WITH HYPERSPACE WARP ZOOM) ──
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    document.body.style.overflow = 'hidden';

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020305);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.2);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
    } catch {
      // Safe fallback
    }

    // ── Spiral Galaxy Parameters ──
    const galaxyParams = {
      count: 6800,
      radius: 9.0,
      branches: 4,
      spin: 1.35,
      randomness: 0.42,
      power: 3.2,
      coreColor: new THREE.Color('#ffffff'), // Brilliant White Core
      innerColor: new THREE.Color('#f8fafc'), // Silver Starlight
      outerColor: new THREE.Color('#94a3b8'), // Metallic Silver
      rimColor: new THREE.Color('#1e293b'), // Deep Cosmic Graphite
    };

    const galaxyGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(galaxyParams.count * 3);
    const colors = new Float32Array(galaxyParams.count * 3);

    for (let i = 0; i < galaxyParams.count; i++) {
      const i3 = i * 3;
      const r = Math.random() * galaxyParams.radius;
      const spinAngle = r * galaxyParams.spin;
      const branchAngle = ((i % galaxyParams.branches) * (Math.PI * 2)) / galaxyParams.branches;

      const randomX = Math.pow(Math.random(), galaxyParams.power) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * r;
      const randomY = Math.pow(Math.random(), galaxyParams.power) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * r * 0.45;
      const randomZ = Math.pow(Math.random(), galaxyParams.power) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * r;

      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      // Color gradient from center to edge
      const mixedColor = galaxyParams.coreColor.clone();
      const normRadius = r / galaxyParams.radius;

      if (normRadius < 0.25) {
        mixedColor.lerp(galaxyParams.innerColor, normRadius * 4);
      } else if (normRadius < 0.65) {
        mixedColor.lerp(galaxyParams.outerColor, (normRadius - 0.25) * 2.5);
      } else {
        mixedColor.lerp(galaxyParams.rimColor, (normRadius - 0.65) * 2.8);
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const galaxyMaterial = new THREE.PointsMaterial({
      size: 0.038,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxy.rotation.x = 0.35; // Majestic orbital tilt
    scene.add(galaxy);

    // Mouse parallax tracking
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Escape key to enter Home page directly
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.key)) {
        e.preventDefault();
        handleEnterPortfolio();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Continuous majestic 3D spiral galaxy rotation
      galaxy.rotation.y += 0.0016;

      // When entering portfolio: Hyperspace warp zoom deep into galaxy center!
      if (isZoomingInRef.current) {
        camera.position.z -= 0.42;
        galaxy.rotation.y += 0.02;
        galaxyMaterial.size = 0.055;
      } else {
        // Normal Mouse Parallax Lerping
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.045;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.045;

        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        camera.position.x = mx * 0.7;
        camera.position.y = 1.2 + my * 0.5;
        camera.lookAt(0, 0, 0);
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);

      galaxyGeometry.dispose();
      galaxyMaterial.dispose();

      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, [handleEnterPortfolio]);

  // ── 2. ZERO-GRAVITY SEQUENTIAL STORYTELLING: REST ~5S, DRIFT UPWARD INTO SPACE ──
  useEffect(() => {
    // Card 1 floats in zero-g for ~4.2s, then drifts upward into space
    const drift1 = setTimeout(() => {
      setIsDriftingUp(true);
    }, 4200);

    const timerStep1 = setTimeout(() => {
      setIsDriftingUp(false);
      setIntroStep(1); // Card 2 (5.0s – 10.0s)
    }, 5000);

    // Card 2 drifts upward into space at 9.2s
    const drift2 = setTimeout(() => {
      setIsDriftingUp(true);
    }, 9200);

    const timerStep2 = setTimeout(() => {
      setIsDriftingUp(false);
      setIntroStep(2); // Card 3 (10.0s – 15.0s)
    }, 10000);

    // Card 3 drifts upward into space at 14.2s, leaving stage completely clear
    const drift3 = setTimeout(() => {
      setIsDriftingUp(true);
    }, 14200);

    // AT LAST: Large Video Card appears smoothly with zero photo card before it!
    const timerStep3 = setTimeout(() => {
      setIsDriftingUp(false);
      setIntroStep(3); // AT LAST (15.0s+)
      startWelcomingVideo();
    }, 15000);

    return () => {
      clearTimeout(drift1);
      clearTimeout(timerStep1);
      clearTimeout(drift2);
      clearTimeout(timerStep2);
      clearTimeout(drift3);
      clearTimeout(timerStep3);
    };
  }, [startWelcomingVideo]);

  return (
    <div
      ref={containerRef}
      className={`${styles.introOverlay} ${isExiting ? styles.introOverlayExiting : ''}`}
      aria-label="Cinematic Portfolio Intro"
    >
      {/* Three.js 3D Rotating Galaxy Canvas */}
      <canvas ref={canvasRef} className={styles.webglCanvas} />

      {/* Atmospheric Vignette */}
      <div className={styles.ambientVignette} />

      {/* ── 3D VISUAL STAGE (ZERO GRAVITY FLOATING & UPWARD DRIFT) ── */}
      <div className={styles.spatialStage}>
        {/* STEP 0 (0s – 5s): Card 1 (AIML Engineer [Student]) with uploaded stage speaker image */}
        {introStep === 0 && (
          <div
            className={`${styles.showcaseCard} ${isDriftingUp ? styles.cardDriftingUp : ''}`}
            key="card-0"
          >
            <div className={styles.cardBadge}>
              <span className={styles.cardDot} />
              <span>01 // AIML ENGINEER</span>
            </div>
            <Image
              src="/images/intro/panel_speaker_stage.jpg"
              alt="Vaibhav Shaw - AIML Engineer Speaking on Stage"
              width={600}
              height={750}
              className={styles.dimensionImg}
              priority
            />
          </div>
        )}

        {/* STEP 1 (5s – 10s): Card 2 (Graphic Designer) */}
        {introStep === 1 && (
          <div
            className={`${styles.showcaseCard} ${isDriftingUp ? styles.cardDriftingUp : ''}`}
            key="card-1"
          >
            <div className={styles.cardBadge}>
              <span className={styles.cardDot} />
              <span>02 // GRAPHIC DESIGNER</span>
            </div>
            <Image
              src="/images/intro/panel_music.jpg"
              alt="Graphic Designer Visual Direction"
              width={500}
              height={500}
              className={styles.dimensionImg}
              priority
            />
          </div>
        )}

        {/* STEP 2 (10s – 15s): Card 3 (Full-Stack Developer) */}
        {introStep === 2 && (
          <div
            className={`${styles.showcaseCard} ${isDriftingUp ? styles.cardDriftingUp : ''}`}
            key="card-2"
          >
            <div className={styles.cardBadge}>
              <span className={styles.cardDot} />
              <span>03 // FULL-STACK DEV</span>
            </div>
            <Image
              src="/images/intro/panel_executive.jpg"
              alt="Full-Stack Developer Architecture"
              width={500}
              height={500}
              className={styles.dimensionImg}
              priority
            />
          </div>
        )}

        {/* STEP 3 (AT LAST): ONLY THE VIDEO CARD! Sized per Image 2 */}
        {/* Zero photo card before it, video plays automatically and audibly */}
        {introStep === 3 && (
          <div className={styles.largeVideoCard} key="card-video">
            <video
              ref={videoRef}
              src="/video/Intro.mp4"
              autoPlay
              playsInline
              loop
              preload="auto"
              className={styles.videoElement}
            />

            {/* Authentic Autographed Signature Badge */}
            <div className={styles.signatureBadge} aria-label="Personal Signature">
              <div className={styles.signatureScript}>Vaibhav Shaw</div>
              <div className={styles.signatureDetails}>
                <span className={styles.sigSubLine}>AIML Student</span>
                <span className={styles.sigSubLine}>Full Stack Developer</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── DOM HERO TYPOGRAPHY: INTRODUCES EACH CARD, THEN UNVEILS IDENTITY AT LAST ── */}
      <div className={styles.heroDomOverlay}>
        <div className={`${styles.heroContentLeft} ${styles.heroContentVisible}`}>
          {/* STEP 0: Introduction to AIML Engineer */}
          {introStep === 0 && (
            <div className={styles.stepIntroBox} key="text-0">
              <div className={styles.stepPill}>01 // FIRST DIMENSION</div>
              <h2 className={styles.stepTitle}>AIML ENGINEER</h2>
              <div className={styles.stepSubtitle}>Sister Nivedita University · B.Tech CSE (AIML Track)</div>
              <p className={styles.stepDesc}>
                Exploring deep neural networks, machine learning models, and transforming theoretical research into intelligent reality.
              </p>
            </div>
          )}

          {/* STEP 1: Introduction to Graphic Designer */}
          {introStep === 1 && (
            <div className={styles.stepIntroBox} key="text-1">
              <div className={styles.stepPill}>02 // SECOND DIMENSION</div>
              <h2 className={styles.stepTitle}>GRAPHIC DESIGNER</h2>
              <div className={styles.stepSubtitle}>Visual Harmony & Creative Direction</div>
              <p className={styles.stepDesc}>
                Designing dark-mode futuristic aesthetics, cinematic UI systems, and cohesive visual identities for cutting-edge projects.
              </p>
            </div>
          )}

          {/* STEP 2: Introduction to Full-Stack Developer */}
          {introStep === 2 && (
            <div className={styles.stepIntroBox} key="text-2">
              <div className={styles.stepPill}>03 // THIRD DIMENSION</div>
              <h2 className={styles.stepTitle}>FULL-STACK DEVELOPER</h2>
              <div className={styles.stepSubtitle}>Modern Engineering & Scalable Systems</div>
              <p className={styles.stepDesc}>
                Architecting performant Next.js applications, distributed microservices, and interactive 3D WebGL digital experiences.
              </p>
            </div>
          )}

          {/* STEP 3: AT LAST — Permanent Portfolio Identity (Video card is active on right) */}
          {introStep === 3 && (
            <div key="text-final" style={{ animation: 'fadeInStep 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
              {/* Main Full Name */}
              <h1 className={styles.mainTitle}>
                VAIBHAV
                <span className={styles.titleSurname}>SHAW</span>
              </h1>

              {/* User Requested Disciplines */}
              <div className={styles.identityPills}>
                <span className={styles.identityPill}>AIML Engineer [Student]</span>
                <span className={styles.identityPill}>Graphic Designer</span>
                <span className={styles.identityPill}>Full-Stack Developer</span>
              </div>

              {/* Complete Academic Bio Statement */}
              <p className={styles.heroManifesto}>
                Student of Sister Nivedita University pursuing B.Tech CSE in AIML. Building
                ideas through curiosity and turning research into reality.
              </p>

              {/* Sister Nivedita University Academic Dossier Stats Cards */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>9.38</span>
                  <span className={styles.statLabel}>CGPA (Cumulative)</span>
                  <span className={styles.statSubTrack}>Sister Nivedita University</span>
                </div>

                <div className={styles.statCard}>
                  <span className={styles.statValue}>2nd Year · 3rd Sem</span>
                  <span className={styles.statLabel}>Current Term</span>
                  <span className={styles.statSubTrack}>2025–2029 Cohort</span>
                </div>

                <div className={styles.statCard}>
                  <span className={styles.statValue}>AIML</span>
                  <span className={styles.statLabel}>B.Tech CSE Track</span>
                  <span className={styles.statSubTrack}>Sister Nivedita University</span>
                </div>
              </div>
            </div>
          )}

          {/* Single, Prominent Enter Portfolio CTA Button: Redirects to Home Page */}
          <button
            type="button"
            onClick={handleEnterPortfolio}
            className={styles.enterPortfolioBtn}
            data-cursor-hover
          >
            <span>Enter Portfolio</span>
            <span className={styles.ctaArrow}>➔</span>
          </button>
        </div>

        {/* Floating Vertical Social Rail (GitHub, LinkedIn, Instagram, X) Fixed on far right edge */}
        <aside className={styles.socialSidebar} aria-label="Social connections">
          <span className={styles.socialLine} />
          <a
            href="https://github.com/visionary-code-studio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={styles.socialLink}
            data-cursor-hover
          >
            <svg width="17" height="17" viewBox="0 0 496 512" fill="currentColor">
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/vaibhav-shaw-55124835b/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className={styles.socialLink}
            data-cursor-hover
          >
            <svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor">
              <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/designer.hub2025/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className={styles.socialLink}
            data-cursor-hover
          >
            <svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor">
              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1z" />
            </svg>
          </a>
          <a
            href="https://x.com/vaibhavshawsnu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className={styles.socialLink}
            data-cursor-hover
          >
            <svg width="15" height="15" viewBox="0 0 512 512" fill="currentColor">
              <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z" />
            </svg>
          </a>
          <span className={styles.socialLine} />
        </aside>
      </div>
    </div>
  );
}
