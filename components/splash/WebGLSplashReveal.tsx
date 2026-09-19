'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
import styles from './WebGLSplashReveal.module.css';

interface WebGLSplashRevealProps {
  onRevealComplete?: () => void;
}

/**
 * Sequential Step Flow:
 * 0: 3D Flute resting in the center of the Spiral Galaxy (Black, Silver, and White).
 *    Music starts playing continuously from the start on every reload.
 * 1: Flute dissolves into the galaxy's silver and white stardust.
 * 2: "VAIBHAV" appears in crisp silver & white typography.
 * 3: "SHAW" appears (VAIBHAV SHAW).
 * 4: "WELCOME" appears.
 * 5: "TO" appears.
 * 6: "MY" appears.
 * 7: "PORTFOLIO" appears (WELCOME TO MY PORTFOLIO).
 * 8: All words dock harmoniously together at the bottom with role badge.
 * 9: Final scroll renders directly to the main landing page!
 */
const TOTAL_STEPS = 9;

export default function WebGLSplashReveal({ onRevealComplete }: WebGLSplashRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // Audio Reference: flute-song.mp3 starts immediately from the begin of website on every reload
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Three.js References
  const fluteGroupRef = useRef<THREE.Group | null>(null);
  const galaxyPointsRef = useRef<THREE.Points | null>(null);
  const fluteDissolveRef = useRef<{ factor: number }>({ factor: 0 });

  // Input Debounce Control
  const lastAdvanceTimeRef = useRef(0);
  const stepRef = useRef(0);
  stepRef.current = currentStep;

  // Initialize and continuously play flute-song.mp3 from the start
  useEffect(() => {
    let audio: HTMLAudioElement;

    try {
      audio = new Audio('/audio/flute-song.mp3');
      audio.loop = true;
      audio.volume = 0.85;

      audio.onerror = () => {
        if (audio.src.includes('/audio/')) {
          audio.src = '/flute-song.mp3';
          audio.play().catch(() => {});
        }
      };

      // Attempt immediate autoplay on reload
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser restricts unprompted autoplay, immediately unlock on ANY first micro-interaction
          const unlockAudio = () => {
            if (audio && audio.paused) {
              audio.play().catch(() => {});
            }
            window.removeEventListener('pointerdown', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
            window.removeEventListener('wheel', unlockAudio);
          };

          window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
          window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
          window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
          window.addEventListener('wheel', unlockAudio, { once: true, passive: true });
        });
      }

      audioRef.current = audio;
    } catch {
      // Audio fallback
    }

    return () => {
      // Keep playing smoothly into portfolio, or pause if unmounted
    };
  }, []);

  // Complete Reveal Transition into Landing Page
  const completeReveal = useCallback(() => {
    setIsRevealed(true);
    document.body.style.overflow = '';
    if (onRevealComplete) onRevealComplete();

    // Fade out audio gracefully over 1.8 seconds when entering the portfolio
    if (audioRef.current) {
      const audio = audioRef.current;
      const fadeInterval = setInterval(() => {
        if (audio.volume > 0.06) {
          audio.volume = Math.max(0, audio.volume - 0.08);
        } else {
          audio.pause();
          clearInterval(fadeInterval);
        }
      }, 90);
    }
  }, [onRevealComplete]);

  // Advance Step: Scrolling is ONLY to disappear flute and reveal words one by one
  const advanceStep = useCallback(() => {
    const now = performance.now();
    if (now - lastAdvanceTimeRef.current < 420) return;
    lastAdvanceTimeRef.current = now;

    // Ensure audio is playing if browser was holding it back
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }

    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next >= TOTAL_STEPS) {
        completeReveal();
        return TOTAL_STEPS;
      }
      return next;
    });
  }, [completeReveal]);

  // Lock document scroll while splash overlay is active
  useEffect(() => {
    if (!isRevealed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isRevealed]);

  // Scroll / Wheel / Touch / Keyboard Listener
  useEffect(() => {
    if (isRevealed) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 10 || Math.abs(e.deltaX) > 14) {
        advanceStep();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      if (Math.abs(touchStartY - touchY) > 22) {
        touchStartY = touchY;
        advanceStep();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', 'Space', 'Enter', 'PageDown'].includes(e.code)) {
        e.preventDefault();
        advanceStep();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRevealed, advanceStep]);

  // ── Three.js Spiral Galaxy & 3D Flute GUI (Black, Silver, White) ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene, Camera, High-Precision WebGL Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030508'); // Deep cosmic black

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6.4);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // 2. ── Spiral Galaxy Three.js System (Black, Silver, White) ──
    const galaxyParams = {
      count: 7500,
      size: 0.038,
      radius: 9.2,
      branches: 4,
      spin: 1.25,
      randomness: 0.45,
      power: 3.2,
      coreColor: new THREE.Color('#ffffff'), // Pure brilliant stellar white
      innerColor: new THREE.Color('#f1f5f9'), // Sterling silver
      outerColor: new THREE.Color('#94a3b8'), // Metallic silver
      rimColor: new THREE.Color('#334155'), // Deep cosmic graphite
    };

    const galaxyGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(galaxyParams.count * 3);
    const colors = new Float32Array(galaxyParams.count * 3);
    const scales = new Float32Array(galaxyParams.count);

    for (let i = 0; i < galaxyParams.count; i++) {
      // Position along spiral arms
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

      // Color interpolation: White core -> Silver arms -> Graphite outer space
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

      scales[i] = Math.random() * 0.8 + 0.4;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const galaxyMaterial = new THREE.PointsMaterial({
      size: galaxyParams.size,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxyPointsRef.current = galaxyPoints;

    // Tilt the spiral galaxy in 3D perspective
    galaxyPoints.rotation.x = Math.PI / 3.4;
    galaxyPoints.rotation.z = Math.PI / 8;
    scene.add(galaxyPoints);

    // 3. ── 3D Flute in the Galactic Core (Obsidian Black, Silver, White) ──
    const fluteGroup = new THREE.Group();
    fluteGroupRef.current = fluteGroup;
    scene.add(fluteGroup);

    // Flute Body: Polished Obsidian Black Wood
    const fluteLength = 4.4;
    const fluteRadius = 0.115;
    const bodyGeo = new THREE.CylinderGeometry(fluteRadius, fluteRadius * 0.96, fluteLength, 48);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x090c12, // Deep obsidian black
      roughness: 0.22,
      metalness: 0.35,
      transparent: true,
      opacity: 1,
    });
    const fluteBody = new THREE.Mesh(bodyGeo, bodyMat);
    fluteGroup.add(fluteBody);

    // Silver & White Chrome Binding Rings
    const silverRingMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // Sterling silver / chrome
      roughness: 0.15,
      metalness: 0.95,
      transparent: true,
      opacity: 1,
    });

    const ringPositions = [1.95, 1.82, 0.95, -0.2, -1.2, -1.95, -2.05];
    ringPositions.forEach((yPos) => {
      const ringGeo = new THREE.TorusGeometry(fluteRadius + 0.006, 0.016, 16, 40);
      ringGeo.rotateX(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, silverRingMat);
      ringMesh.position.y = yPos;
      fluteGroup.add(ringMesh);
    });

    // Embouchure Hole (Blow Hole)
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const blowHoleGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.05, 24);
    blowHoleGeo.rotateX(Math.PI / 2);
    const blowHole = new THREE.Mesh(blowHoleGeo, holeMat);
    blowHole.position.set(0, 1.45, fluteRadius);
    fluteGroup.add(blowHole);

    // 6 Precision Finger Tone Holes with Silver Rims
    const fingerHolesY = [0.45, 0.15, -0.15, -0.45, -0.75, -1.05];
    fingerHolesY.forEach((yPos) => {
      const fHoleGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.04, 20);
      fHoleGeo.rotateX(Math.PI / 2);
      const fHole = new THREE.Mesh(fHoleGeo, holeMat);
      fHole.position.set(0, yPos, fluteRadius);
      fluteGroup.add(fHole);

      const rimGeo = new THREE.RingGeometry(0.033, 0.046, 24);
      const rimMesh = new THREE.Mesh(rimGeo, silverRingMat);
      rimMesh.position.set(0, yPos, fluteRadius + 0.005);
      fluteGroup.add(rimMesh);
    });

    // Silver Crown Cap
    const capGeo = new THREE.CylinderGeometry(fluteRadius * 1.05, fluteRadius * 1.05, 0.12, 32);
    const capMesh = new THREE.Mesh(capGeo, silverRingMat);
    capMesh.position.y = fluteLength / 2 + 0.04;
    fluteGroup.add(capMesh);

    // Initial Flute Placement (Tilted in center of galaxy)
    fluteGroup.rotation.z = -Math.PI / 4.2;
    fluteGroup.rotation.x = 0.25;
    fluteGroup.rotation.y = 0.2;
    fluteGroup.position.set(0, 0.25, 0);

    // 4. Harmonic Silver Stardust Aura (Emitting from flute)
    const stardustCount = 380;
    const stardustGeo = new THREE.BufferGeometry();
    const stardustPos = new Float32Array(stardustCount * 3);
    const stardustVel = new Float32Array(stardustCount * 3);

    for (let i = 0; i < stardustCount; i++) {
      stardustPos[i * 3] = (Math.random() - 0.5) * 2.8;
      stardustPos[i * 3 + 1] = (Math.random() - 0.5) * 2.6;
      stardustPos[i * 3 + 2] = (Math.random() - 0.5) * 1.8;

      stardustVel[i * 3] = (Math.random() - 0.5) * 0.007;
      stardustVel[i * 3 + 1] = Math.random() * 0.009 + 0.003;
      stardustVel[i * 3 + 2] = (Math.random() - 0.5) * 0.007;
    }

    stardustGeo.setAttribute('position', new THREE.BufferAttribute(stardustPos, 3));
    const stardustMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.042,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const stardustSystem = new THREE.Points(stardustGeo, stardustMat);
    scene.add(stardustSystem);

    // 5. Studio Lighting (Pure White & Silver Highlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const silverKeyLight = new THREE.PointLight(0xffffff, 4.2, 22);
    silverKeyLight.position.set(3, 4, 5);
    scene.add(silverKeyLight);

    const silverRimLight = new THREE.PointLight(0xcbd5e1, 3.5, 20);
    silverRimLight.position.set(-4, -2, 4);
    scene.add(silverRimLight);

    // 6. Interactive Cursor Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 0.45;
      targetMouseY = (e.clientY / height - 0.5) * 0.45;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop: Majestic Spiral Galaxy Spin & Dissolve Control
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // ── Spiral Galaxy Orbit ──
      if (galaxyPoints) {
        galaxyPoints.rotation.y = elapsedTime * 0.04 + mouseX * 0.5;
        galaxyPoints.rotation.x = Math.PI / 3.4 + mouseY * 0.35;
      }

      // ── Flute Dissolution: Disappears on first scroll (step >= 1) ──
      const currentStepVal = stepRef.current;
      const targetDissolve = currentStepVal >= 1 ? 1 : 0;
      fluteDissolveRef.current.factor += (targetDissolve - fluteDissolveRef.current.factor) * 0.09;
      const dissolve = fluteDissolveRef.current.factor;

      if (fluteGroup) {
        const idleBob = Math.sin(elapsedTime * 1.5) * 0.07;
        fluteGroup.position.y = 0.25 + idleBob + mouseY * 0.35;
        fluteGroup.position.x = mouseX * 0.35;

        // On scroll 1: accelerates, spins, and dissolves into the galaxy
        fluteGroup.rotation.z = -Math.PI / 4.2 + dissolve * 1.5 + mouseX * 0.25;
        fluteGroup.rotation.y = 0.2 + elapsedTime * (0.25 + dissolve * 2.5) + mouseX * 0.35;

        const currentScale = 1 + dissolve * 0.6;
        fluteGroup.scale.set(currentScale, currentScale, currentScale);

        const fluteOpacity = Math.max(0, 1 - dissolve * 1.35);
        bodyMat.opacity = fluteOpacity;
        silverRingMat.opacity = fluteOpacity;
        fluteGroup.visible = fluteOpacity > 0.01;
      }

      // Harmonic Stardust particles
      if (stardustSystem) {
        const posAttr = stardustGeo.attributes.position as THREE.BufferAttribute;
        const posArr = posAttr.array as Float32Array;

        for (let i = 0; i < stardustCount; i++) {
          posArr[i * 3 + 1] += stardustVel[i * 3 + 1];
          posArr[i * 3] += stardustVel[i * 3];

          if (posArr[i * 3 + 1] > 3.5 || posArr[i * 3 + 1] < -3.5) {
            posArr[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
            posArr[i * 3] = (Math.random() - 0.5) * 2.5;
          }
        }
        posAttr.needsUpdate = true;

        if (dissolve > 0.05 && dissolve < 0.95) {
          stardustMat.size = 0.068;
          stardustMat.opacity = 0.95;
        } else if (currentStepVal >= 1) {
          stardustMat.size = 0.035;
          stardustMat.opacity = 0.3;
        } else {
          stardustMat.size = 0.042;
          stardustMat.opacity = 0.85;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      galaxyGeometry.dispose();
      galaxyMaterial.dispose();
      bodyGeo.dispose();
      bodyMat.dispose();
      silverRingMat.dispose();
      holeMat.dispose();
      stardustGeo.dispose();
      stardustMat.dispose();
    };
  }, []);

  if (isRevealed) {
    return null;
  }

  // Word Visibility based on scroll steps
  const isVaibhavVisible = currentStep >= 2;
  const isShawVisible = currentStep >= 3;
  const isWelcomeVisible = currentStep >= 4;
  const isToVisible = currentStep >= 5;
  const isMyVisible = currentStep >= 6;
  const isPortfolioVisible = currentStep >= 7;
  const isUnifiedBottom = currentStep >= 8;

  return (
    <aside
      ref={containerRef}
      className={styles.splashOverlay}
      style={{
        opacity: currentStep === TOTAL_STEPS ? 0 : 1,
        transform: currentStep === TOTAL_STEPS ? 'translateY(-100%)' : 'translateY(0)',
      }}
      aria-label="Interactive 3D Flute Welcome Experience"
      onClick={advanceStep}
    >
      {/* ── Three.js Spiral Galaxy WebGL Canvas (Black, Silver, White) ── */}
      <canvas ref={canvasRef} className={styles.webglCanvas} />

      {/* Cosmic Vignette */}
      <div className={styles.ambientGlow} />

      {/* ── Top Center Monogram Logo (Anchored from start, no buttons) ── */}
      <div className={styles.topBadge}>
        <div className={styles.logoCircle}>
          <Image
            src="/images/logo.png"
            alt="Vaibhav Shaw Logo"
            width={40}
            height={40}
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <span className={styles.monogramText}>VAIBHAV SHAW</span>
      </div>

      {/* ── Center Stage: Sequential Typographic Revelation ── */}
      <div className={styles.centerStage}>
        {/* Steps 2-8: Sequential Words Emerge Note-by-Note */}
        {currentStep >= 2 && (
          <div className={`${styles.storyboardArea} ${isUnifiedBottom ? styles.dockedBottom : ''}`}>
            {/* Primary Name Line: VAIBHAV SHAW */}
            <div className={styles.wordLinePrimary}>
              <span
                className={`${styles.wordToken} ${styles.tokenStroke} ${
                  isVaibhavVisible ? styles.visible : ''
                }`}
              >
                VAIBHAV
              </span>
              <span
                className={`${styles.wordToken} ${styles.tokenSolid} ${
                  isShawVisible ? styles.visible : ''
                }`}
              >
                SHAW
              </span>
            </div>

            {/* Secondary Greeting Line: WELCOME TO MY PORTFOLIO */}
            <div className={styles.wordLineSecondary}>
              <span
                className={`${styles.wordToken} ${styles.tokenSolid} ${
                  isWelcomeVisible ? styles.visible : ''
                }`}
              >
                WELCOME
              </span>
              <span
                className={`${styles.wordToken} ${styles.tokenAccent} ${
                  isToVisible ? styles.visible : ''
                }`}
              >
                TO
              </span>
              <span
                className={`${styles.wordToken} ${styles.tokenAccent} ${
                  isMyVisible ? styles.visible : ''
                }`}
              >
                MY
              </span>
              <span
                className={`${styles.wordToken} ${styles.tokenSolid} ${
                  isPortfolioVisible ? styles.visible : ''
                }`}
              >
                PORTFOLIO
              </span>
            </div>

            {/* Step 8: Unified Role Pill in Silver & White */}
            <div className={`${styles.roleBlock} ${isUnifiedBottom ? styles.visible : ''}`}>
              <span className={styles.tagPill}>
                <span className={styles.silverDot} />
                AIML ENGINEER &amp; FULL STACK DEVELOPER
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Action & Progress Navigation (Silver & White Cosmic Glass) ── */}
      <div className={styles.bottomNavRow}>
        <button
          type="button"
          className={`${styles.scrollActionBtn} ${isUnifiedBottom ? styles.finalAction : ''}`}
          onClick={advanceStep}
          aria-label="Next Step"
        >
          {currentStep === 0 && (
            <>
              <span>Scroll ↓</span>
              <span className={styles.arrowIcon}>↓</span>
            </>
          )}
          {currentStep >= 1 && currentStep < 8 && (
            <>
              <span>Scroll ({currentStep}/8)</span>
              <span className={styles.arrowIcon}>↓</span>
            </>
          )}
          {currentStep === 8 && (
            <>
              <span>Enter Portfolio</span>
              <span className={styles.arrowIcon}>➔</span>
            </>
          )}
        </button>

        {/* Step Dots Tracker */}
        <div className={styles.stepDotsTrack}>
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
            <span
              key={idx}
              className={`${styles.stepDot} ${
                idx === currentStep
                  ? styles.activeDot
                  : idx < currentStep
                  ? styles.passedDot
                  : ''
              }`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
