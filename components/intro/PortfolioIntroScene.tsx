'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
import styles from './PortfolioIntroScene.module.css';

interface PortfolioIntroSceneProps {
  onIntroComplete?: () => void;
}

type TvStage =
  | 'static-init' // 0.0s – 1.6s: CRT power-on line flash + analog static noise fullscreen
  | 'video'       // ~1.6s – ~11s: Fullscreen Centered Television with Intro.mp4 auto-playing audibly
  | 'card-0'      // 4.5s: 01 // AIML ENGINEER [STUDENT] (stage photo with mic) floating in zero-g
  | 'card-1'      // 4.5s: 02 // GRAPHIC DESIGNER floating in zero-g
  | 'card-2'      // 4.5s: 03 // FULL-STACK DEVELOPER floating in zero-g
  | 'final';      // Final Identity View (Photo with mic on right, Sister Nivedita stats on left)

export default function PortfolioIntroScene({ onIntroComplete }: PortfolioIntroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [tvStage, setTvStage] = useState<TvStage>('static-init');
  const [isDriftingUp, setIsDriftingUp] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Parallax Coordinates for 3D Galaxy
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isZoomingInRef = useRef(false);

  // Stop flute audio and start welcoming video
  const playWelcomingVideo = useCallback(() => {
    window.dispatchEvent(new CustomEvent('stopFluteAudio'));
    document.querySelectorAll('audio').forEach((a) => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch {}
    });

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy blocked unmuted autoplay, unlock on first gesture
          const unlock = () => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.volume = 1.0;
              videoRef.current.play().catch(() => {});
            }
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
          };
          window.addEventListener('pointerdown', unlock, { once: true });
          window.addEventListener('keydown', unlock, { once: true });
        });
      }
    }
  }, []);

  // Exit Intro and unveil main portfolio Home page with hyperspace galaxy zoom-in
  const handleEnterPortfolio = useCallback(() => {
    setIsExiting(true);
    isZoomingInRef.current = true;
    document.body.style.overflow = '';

    window.dispatchEvent(new CustomEvent('stopFluteAudio'));
    if (videoRef.current) {
      videoRef.current.pause();
    }

    setTimeout(() => {
      if (onIntroComplete) onIntroComplete();
    }, 750);
  }, [onIntroComplete]);

  // Procedural Analog CRT Static Noise
  useEffect(() => {
    if (tvStage !== 'static-init') return;

    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    canvas.width = 320;
    canvas.height = 180;

    const renderNoise = () => {
      const imgData = ctx.createImageData(canvas.width, canvas.height);
      const buffer = new Uint32Array(imgData.data.buffer);
      const len = buffer.length;
      for (let i = 0; i < len; i++) {
        const isFuzz = Math.random() > 0.45;
        const val = isFuzz ? (Math.random() * 240) | 0 : (Math.random() * 70) | 0;
        buffer[i] = (255 << 24) | (val << 16) | (val << 8) | val;
      }
      ctx.putImageData(imgData, 0, 0);
      animId = requestAnimationFrame(renderNoise);
    };

    renderNoise();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [tvStage]);

  // Sequence state machine
  useEffect(() => {
    // 1. Static initialization (1.6s) -> Video stage
    if (tvStage === 'static-init') {
      window.dispatchEvent(new CustomEvent('stopFluteAudio'));
      const timer = setTimeout(() => {
        setTvStage('video');
      }, 1600);
      return () => clearTimeout(timer);
    }

    // 2. Video plays full-screen center
    if (tvStage === 'video') {
      playWelcomingVideo();

      // Fallback timer (11.5s) if video ended event does not trigger
      const fallbackTimer = setTimeout(() => {
        setTvStage('card-0');
      }, 11500);

      return () => clearTimeout(fallbackTimer);
    }

    // 3. Card 0: AIML Engineer (stage photo with mic)
    if (tvStage === 'card-0') {
      const driftTimer = setTimeout(() => {
        setIsDriftingUp(true);
      }, 3800);

      const nextTimer = setTimeout(() => {
        setIsDriftingUp(false);
        setTvStage('card-1');
      }, 4500);

      return () => {
        clearTimeout(driftTimer);
        clearTimeout(nextTimer);
      };
    }

    // 4. Card 1: Graphic Designer
    if (tvStage === 'card-1') {
      const driftTimer = setTimeout(() => {
        setIsDriftingUp(true);
      }, 3800);

      const nextTimer = setTimeout(() => {
        setIsDriftingUp(false);
        setTvStage('card-2');
      }, 4500);

      return () => {
        clearTimeout(driftTimer);
        clearTimeout(nextTimer);
      };
    }

    // 5. Card 2: Full-Stack Developer
    if (tvStage === 'card-2') {
      const driftTimer = setTimeout(() => {
        setIsDriftingUp(true);
      }, 3800);

      const nextTimer = setTimeout(() => {
        setIsDriftingUp(false);
        setTvStage('final');
      }, 4500);

      return () => {
        clearTimeout(driftTimer);
        clearTimeout(nextTimer);
      };
    }
  }, [tvStage, playWelcomingVideo]);

  const handleVideoEnded = () => {
    if (tvStage === 'video') {
      setTvStage('card-0');
    }
  };

  // ── THREE.JS 3D SPIRAL GALAXY BACKGROUND (HYPERSPACE WARP ZOOM) ──
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

    const galaxyParams = {
      count: 7200,
      radius: 9.0,
      branches: 4,
      spin: 1.35,
      randomness: 0.42,
      power: 3.2,
      coreColor: new THREE.Color('#ffffff'),
      innerColor: new THREE.Color('#f8fafc'),
      outerColor: new THREE.Color('#94a3b8'),
      rimColor: new THREE.Color('#1e293b'),
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
    galaxy.rotation.x = 0.35;
    scene.add(galaxy);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.key)) {
        e.preventDefault();
        handleEnterPortfolio();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      galaxy.rotation.y += 0.0016;

      if (isZoomingInRef.current) {
        camera.position.z -= 0.44;
        galaxy.rotation.y += 0.022;
        galaxyMaterial.size = 0.055;
      } else {
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

  return (
    <div
      ref={containerRef}
      className={`${styles.introOverlay} ${isExiting ? styles.introOverlayExiting : ''}`}
      aria-label="Cinematic Portfolio Intro"
    >
      {/* Three.js 3D Rotating Galaxy Canvas */}
      <canvas ref={canvasRef} className={styles.webglCanvas} />

      {/* Atmospheric Cosmic Vignette */}
      <div className={styles.ambientVignette} />

      {/* ── 1. FIRST: TELEVISION LIKE ANIMATION WHICH INCLUDES INTRO VIDEO AT THE CENTRE (COVERS ENTIRE PAGE) ── */}
      {(tvStage === 'static-init' || tvStage === 'video') && (
        <div className={styles.cinemaFullscreenOverlay}>
          {/* Discreet Skip Button */}
          <button
            type="button"
            onClick={handleEnterPortfolio}
            className={styles.cinemaSkipBtn}
            data-cursor-hover
            aria-label="Skip Intro"
          >
            <span>Enter Portfolio</span>
            <span>➔</span>
          </button>

          <div className={styles.cinemaTvBox}>
            <div className={styles.tvScreenGlass}>
              <div className={styles.tvGlare} />
              <div className={styles.tvCrtVignette} />
              <div className={styles.tvScanlines} />
              <div className={styles.tvTrackingBar} />

              {/* CRT Power-on Line Flash (At start) */}
              {tvStage === 'static-init' && <div className={styles.tvPowerOnFlash} />}

              {/* Analog Procedural Static Noise */}
              {tvStage === 'static-init' && (
                <canvas ref={staticCanvasRef} className={styles.tvStaticCanvas} />
              )}

              {/* Centered Intro Video */}
              <video
                ref={videoRef}
                src="/video/Intro.mp4"
                playsInline
                preload="auto"
                onEnded={handleVideoEnded}
                className={styles.tvScreenMedia}
                style={{
                  display: tvStage === 'video' ? 'block' : 'none',
                  opacity: tvStage === 'video' ? 1 : 0,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 2. SECOND: FLOATING CARDS (GALAXY, VISIONARY, BLACK AND WHITE) ── */}
      {(tvStage === 'card-0' || tvStage === 'card-1' || tvStage === 'card-2') && (
        <div className={styles.visionaryCardsStage}>
          {/* Card 0: AIML ENGINEER [STUDENT] */}
          {tvStage === 'card-0' && (
            <div
              className={`${styles.visionaryFloatingCard} ${
                isDriftingUp ? styles.visionaryCardDriftingUp : ''
              }`}
              key="vcard-0"
            >
              <div className={styles.cardTopPill}>
                <span className={styles.cardTopDot} />
                <span>01 // AIML ENGINEER [STUDENT]</span>
              </div>
              <Image
                src="/images/intro/panel_speaker_stage.jpg"
                alt="Vaibhav Shaw speaking on stage with mic"
                fill
                sizes="(max-width: 900px) 90vw, 600px"
                style={{ objectFit: 'cover' }}
                priority
              />
              <div className={styles.cardBottomInfo}>
                <h3 className={styles.cardInfoTitle}>AIML ENGINEER [STUDENT]</h3>
                <span className={styles.cardInfoSubtitle}>
                  Sister Nivedita University · B.Tech CSE (AIML Track)
                </span>
              </div>
            </div>
          )}

          {/* Card 1: GRAPHIC DESIGNER */}
          {tvStage === 'card-1' && (
            <div
              className={`${styles.visionaryFloatingCard} ${
                isDriftingUp ? styles.visionaryCardDriftingUp : ''
              }`}
              key="vcard-1"
            >
              <div className={styles.cardTopPill}>
                <span className={styles.cardTopDot} />
                <span>02 // GRAPHIC DESIGNER</span>
              </div>
              <Image
                src="/images/intro/panel_music.jpg"
                alt="Graphic Designer Visual Direction"
                fill
                sizes="(max-width: 900px) 90vw, 600px"
                style={{ objectFit: 'cover' }}
                priority
              />
              <div className={styles.cardBottomInfo}>
                <h3 className={styles.cardInfoTitle}>GRAPHIC DESIGNER</h3>
                <span className={styles.cardInfoSubtitle}>
                  Visual Direction & Cinematic Aesthetics
                </span>
              </div>
            </div>
          )}

          {/* Card 2: FULL-STACK DEVELOPER */}
          {tvStage === 'card-2' && (
            <div
              className={`${styles.visionaryFloatingCard} ${
                isDriftingUp ? styles.visionaryCardDriftingUp : ''
              }`}
              key="vcard-2"
            >
              <div className={styles.cardTopPill}>
                <span className={styles.cardTopDot} />
                <span>03 // FULL-STACK DEVELOPER</span>
              </div>
              <Image
                src="/images/intro/panel_executive.jpg"
                alt="Full-Stack Developer Architecture"
                fill
                sizes="(max-width: 900px) 90vw, 600px"
                style={{ objectFit: 'cover' }}
                priority
              />
              <div className={styles.cardBottomInfo}>
                <h3 className={styles.cardInfoTitle}>FULL-STACK DEVELOPER</h3>
                <span className={styles.cardInfoSubtitle}>
                  Distributed Systems & Scalable Web Architecture
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 3. THIRD: PERMANENT IDENTITY VIEW (MATCHES IMAGE 2 WITH USER FIXES) ── */}
      {tvStage === 'final' && (
        <div className={styles.heroDomOverlay}>
          {/* Left Side: Vaibhav Shaw, Pills, Academic Manifesto, Stats, Enter Button */}
          <div className={`${styles.heroContentLeft} ${styles.heroContentVisible}`}>
            <div>
              <h1 className={styles.mainTitle}>
                VAIBHAV
                <span className={styles.titleSurname}>SHAW</span>
              </h1>

              <div className={styles.identityPills}>
                <span className={styles.identityPill}>AIML Engineer [Student]</span>
                <span className={styles.identityPill}>Graphic Designer</span>
                <span className={styles.identityPill}>Full-Stack Developer</span>
              </div>

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
          </div>

          {/* Right Side (Dark Blue Circle from Image 2):
              Replaced video by the photo where Vaibhav is standing with the mic!
              Light Blue Circle REMOVED: TV chassis footer deleted! */}
          <div className={styles.finalShowcaseBox} aria-label="Vaibhav Shaw Identity Frame">
            <div className={styles.tvScreenGlass}>
              <div className={styles.tvGlare} />
              <div className={styles.tvCrtVignette} />

              <Image
                src="/images/intro/panel_speaker_stage.jpg"
                alt="Vaibhav Shaw - AIML Engineer speaking on stage with mic"
                fill
                sizes="(max-width: 900px) 90vw, 48vw"
                style={{ objectFit: 'cover' }}
                priority
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
          </div>

          {/* Floating Vertical Social Rail Fixed to right viewport edge */}
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
      )}
    </div>
  );
}
