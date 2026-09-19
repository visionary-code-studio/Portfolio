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
 * 0: Flute in center with golden aura + ambient lighting (top logo anchored)
 * 1: Flute dissolves into glowing harmonic sound particles
 * 2: "VAIBHAV" appears
 * 3: "SHAW" appears (VAIBHAV SHAW)
 * 4: "WELCOME" appears
 * 5: "TO" appears
 * 6: "MY" appears
 * 7: "PORTFOLIO" appears (WELCOME TO MY PORTFOLIO)
 * 8: All words assemble together harmoniously at the bottom
 * 9: Final scroll renders us directly into the landing page / hero section!
 */
const TOTAL_STEPS = 9;

export default function WebGLSplashReveal({ onRevealComplete }: WebGLSplashRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Audio Reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioStartedRef = useRef(false);

  // Three.js Scene References
  const fluteGroupRef = useRef<THREE.Group | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const fluteDissolveRef = useRef<{ factor: number }>({ factor: 0 });

  // Wheel & Input Debounce Control
  const lastAdvanceTimeRef = useRef(0);
  const stepRef = useRef(0);
  stepRef.current = currentStep;

  // Initialize and play flute audio
  const startAudioSafely = useCallback(() => {
    if (audioStartedRef.current && audioRef.current) {
      if (audioRef.current.paused && !isMuted) {
        audioRef.current.play().catch(() => {});
        setIsAudioPlaying(true);
      }
      return;
    }

    try {
      // Try /audio/flute-song.mp3, with fallback to /flute-song.mp3
      const audio = new Audio('/audio/flute-song.mp3');
      audio.loop = true;
      audio.volume = 0.75;

      audio.onerror = () => {
        // Fallback to root path if /audio/ fails
        if (audio.src.includes('/audio/')) {
          audio.src = '/flute-song.mp3';
          audio.play().then(() => {
            setIsAudioPlaying(true);
            audioStartedRef.current = true;
          }).catch(() => {});
        }
      };

      audio.play().then(() => {
        setIsAudioPlaying(true);
        audioStartedRef.current = true;
      }).catch(() => {
        // Browser requires direct user click if scroll gesture is restricted
      });

      audioRef.current = audio;
    } catch {
      // Audio autoplay policy fallback
    }
  }, [isMuted]);

  // Toggle Mute / Unmute
  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) {
      startAudioSafely();
      return;
    }

    if (audioRef.current.paused) {
      audioRef.current.play().then(() => {
        audioRef.current!.muted = false;
        setIsMuted(false);
        setIsAudioPlaying(true);
      }).catch(() => {});
    } else {
      const nextMute = !audioRef.current.muted;
      audioRef.current.muted = nextMute;
      setIsMuted(nextMute);
    }
  }, [startAudioSafely]);

  // Final Reveal Transition into Landing Page
  const completeReveal = useCallback(() => {
    setIsRevealed(true);
    document.body.style.overflow = '';
    if (onRevealComplete) onRevealComplete();

    // Fade out audio gracefully over 1.5 seconds
    if (audioRef.current) {
      const audio = audioRef.current;
      const fadeInterval = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.08);
        } else {
          audio.pause();
          clearInterval(fadeInterval);
        }
      }, 80);
    }
  }, [onRevealComplete]);

  // Advance to next step
  const advanceStep = useCallback(() => {
    const now = performance.now();
    // Debounce to ensure distinct deliberate scrolls
    if (now - lastAdvanceTimeRef.current < 450) return;
    lastAdvanceTimeRef.current = now;

    // Start music on first scroll/interaction
    startAudioSafely();

    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next >= TOTAL_STEPS) {
        completeReveal();
        return TOTAL_STEPS;
      }
      return next;
    });
  }, [startAudioSafely, completeReveal]);

  // Direct Skip button
  const handleSkip = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    completeReveal();
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
      if (Math.abs(e.deltaY) > 12 || Math.abs(e.deltaX) > 16) {
        advanceStep();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      startAudioSafely();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      if (touchStartY - touchY > 25 || touchY - touchStartY > 25) {
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
  }, [isRevealed, advanceStep, startAudioSafely]);

  // ── Three.js 3D Flute & Sound Particle Scene ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f8f9fc');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // 2. Build 3D Bansuri / Flute Group
    const fluteGroup = new THREE.Group();
    fluteGroupRef.current = fluteGroup;
    scene.add(fluteGroup);

    // Main Flute Body (Deep bamboo / polished obsidian wood finish)
    const fluteLength = 4.4;
    const fluteRadius = 0.115;
    const bodyGeo = new THREE.CylinderGeometry(fluteRadius, fluteRadius * 0.96, fluteLength, 48);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e1511, // Rich dark roasted bamboo / mahogany
      roughness: 0.32,
      metalness: 0.18,
      transparent: true,
      opacity: 1,
    });
    const fluteBody = new THREE.Mesh(bodyGeo, bodyMat);
    fluteGroup.add(fluteBody);

    // Gold Metal Ring Bindings (Traditional Bansuri golden thread / brass accents)
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Warm gold
      roughness: 0.22,
      metalness: 0.92,
      transparent: true,
      opacity: 1,
    });

    const ringPositions = [1.95, 1.82, 0.95, -0.2, -1.2, -1.95, -2.05];
    const ringMeshes: THREE.Mesh[] = [];

    ringPositions.forEach((yPos) => {
      const ringGeo = new THREE.TorusGeometry(fluteRadius + 0.006, 0.016, 16, 40);
      ringGeo.rotateX(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, goldRingMat);
      ringMesh.position.y = yPos;
      fluteGroup.add(ringMesh);
      ringMeshes.push(ringMesh);
    });

    // Embouchure Hole (Blow Hole)
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const blowHoleGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.05, 24);
    blowHoleGeo.rotateX(Math.PI / 2);
    const blowHole = new THREE.Mesh(blowHoleGeo, holeMat);
    blowHole.position.set(0, 1.45, fluteRadius);
    fluteGroup.add(blowHole);

    // 6 Finger Tone Holes along the body
    const fingerHolesY = [0.45, 0.15, -0.15, -0.45, -0.75, -1.05];
    fingerHolesY.forEach((yPos) => {
      const fHoleGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.04, 20);
      fHoleGeo.rotateX(Math.PI / 2);
      const fHole = new THREE.Mesh(fHoleGeo, holeMat);
      fHole.position.set(0, yPos, fluteRadius);
      fluteGroup.add(fHole);

      // Delicate gold rim around each tone hole
      const rimGeo = new THREE.RingGeometry(0.033, 0.046, 24);
      const rimMesh = new THREE.Mesh(rimGeo, goldRingMat);
      rimMesh.position.set(0, yPos, fluteRadius + 0.005);
      fluteGroup.add(rimMesh);
      ringMeshes.push(rimMesh);
    });

    // Top End Stopper / Crown Cap
    const capGeo = new THREE.CylinderGeometry(fluteRadius * 1.05, fluteRadius * 1.05, 0.12, 32);
    const capMesh = new THREE.Mesh(capGeo, goldRingMat);
    capMesh.position.y = fluteLength / 2 + 0.04;
    fluteGroup.add(capMesh);
    ringMeshes.push(capMesh);

    // Position & Angle the 3D Flute diagonally in center space
    fluteGroup.rotation.z = -Math.PI / 4.2; // ~42° diagonal tilt
    fluteGroup.rotation.x = 0.25;
    fluteGroup.rotation.y = 0.2;
    fluteGroup.position.set(0, 0.35, 0);

    // 3. Floating Sound Aura / Harmonic Note Particles
    const particleCount = 420;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Emanate near the flute tone holes
      positions[i * 3] = (Math.random() - 0.5) * 2.8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.8;

      velocities[i * 3] = (Math.random() - 0.5) * 0.006;
      velocities[i * 3 + 1] = Math.random() * 0.008 + 0.004; // upward melodic drift
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xd97706, // Warm gold music particles
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.NormalBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystemRef.current = particleSystem;
    scene.add(particleSystem);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const warmLight = new THREE.PointLight(0xd97706, 3.2, 18);
    warmLight.position.set(3, 4, 4);
    scene.add(warmLight);

    const coolRimLight = new THREE.PointLight(0x93c5fd, 1.8, 18);
    coolRimLight.position.set(-4, -2, 3);
    scene.add(coolRimLight);

    // 5. Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 0.5;
      targetMouseY = (e.clientY / height - 0.5) * 0.5;
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

    // 6. Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // When Step >= 1: The Flute dissolves and disappears
      const currentStepVal = stepRef.current;
      const targetDissolve = currentStepVal >= 1 ? 1 : 0;
      fluteDissolveRef.current.factor += (targetDissolve - fluteDissolveRef.current.factor) * 0.09;
      const dissolve = fluteDissolveRef.current.factor;

      if (fluteGroup) {
        // Idle gentle breathing motion + mouse parallax
        const idleBob = Math.sin(elapsedTime * 1.6) * 0.08;
        fluteGroup.position.y = 0.35 + idleBob + mouseY * 0.4;
        fluteGroup.position.x = mouseX * 0.4;
        
        // Dissolution dynamics: spin faster, expand slightly, and fade away
        fluteGroup.rotation.z = -Math.PI / 4.2 + dissolve * 1.2 + mouseX * 0.3;
        fluteGroup.rotation.y = 0.2 + elapsedTime * (0.2 + dissolve * 2) + mouseX * 0.4;

        const currentScale = 1 + dissolve * 0.6;
        fluteGroup.scale.set(currentScale, currentScale, currentScale);

        // Fade materials
        const fluteOpacity = Math.max(0, 1 - dissolve * 1.3);
        bodyMat.opacity = fluteOpacity;
        goldRingMat.opacity = fluteOpacity;
        fluteGroup.visible = fluteOpacity > 0.01;
      }

      // Animate harmonic sound particles
      if (particleSystem) {
        const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          posArray[i * 3 + 1] += velocities[i * 3 + 1];
          posArray[i * 3] += velocities[i * 3];

          // Reset particle to flute position once it drifts away
          if (posArray[i * 3 + 1] > 3.5 || posArray[i * 3 + 1] < -3.5) {
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
            posArray[i * 3] = (Math.random() - 0.5) * 2.5;
          }
        }
        posAttr.needsUpdate = true;

        // In step 1: particle burst, then soft background ambient in later steps
        if (dissolve > 0.05 && dissolve < 0.95) {
          particleMat.size = 0.065;
          particleMat.opacity = 0.85;
        } else if (currentStepVal >= 1) {
          particleMat.size = 0.035;
          particleMat.opacity = 0.35;
        } else {
          particleMat.size = 0.045;
          particleMat.opacity = 0.75;
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
      bodyGeo.dispose();
      bodyMat.dispose();
      goldRingMat.dispose();
      holeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (isRevealed) {
    return null;
  }

  // Determine visibility states for each word
  // Step 0: Flute greeting only
  // Step 1: Flute dissolves
  // Step 2: VAIBHAV
  // Step 3: SHAW
  // Step 4: WELCOME
  // Step 5: TO
  // Step 6: MY
  // Step 7: PORTFOLIO
  // Step 8: Unity at Bottom
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
      {/* ── 3D Three.js Interactive WebGL Canvas ── */}
      <canvas ref={canvasRef} className={styles.webglCanvas} />

      {/* Ambient Atmospheric Glow */}
      <div className={styles.ambientGlow} />

      {/* ── Top Header Bar (Logo & Controls) ── */}
      <div className={styles.topNavRow}>
        {/* Top Center-Left Monogram Logo (Still there from start) */}
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

        {/* Top Controls: Sound Toggle & Skip */}
        <div className={styles.topControls}>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute flute melody' : 'Mute flute melody'}
          >
            <span className={styles.audioPulse} style={{ opacity: isAudioPlaying && !isMuted ? 1 : 0.2 }} />
            <span>{isMuted ? '🔇 Sound Off' : '🔊 Sound On'}</span>
          </button>

          <button
            type="button"
            className={styles.controlBtn}
            onClick={handleSkip}
            aria-label="Skip to Portfolio"
          >
            <span>Skip ➔</span>
          </button>
        </div>
      </div>

      {/* ── Center Stage: Sequential Typographic Revelation ── */}
      <div className={styles.centerStage}>
        {/* Step 0: Flute Stage Greeting */}
        {currentStep === 0 && (
          <div className={styles.fluteGreeting}>
            <span className={styles.fluteLabel}>3D Melodic Prologue</span>
            <h2 className={styles.fluteInstruction}>Scroll to hear the melody &amp; begin</h2>
          </div>
        )}

        {/* Step 1: Flute Dissolution */}
        {currentStep === 1 && (
          <div className={styles.fluteGreeting}>
            <span className={styles.fluteLabel}>Harmonic Dispersion</span>
            <h2 className={styles.fluteInstruction}>Scroll to reveal</h2>
          </div>
        )}

        {/* Steps 2-8: Sequential Words Emerge */}
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

            {/* Step 8: Unified Role Pill & Sub-Tagline */}
            <div className={`${styles.roleBlock} ${isUnifiedBottom ? styles.visible : ''}`}>
              <span className={styles.tagPill}>
                <span className={styles.greenDot} />
                AIML ENGINEER &amp; FULL STACK DEVELOPER
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Action & Progress Navigation ── */}
      <div className={styles.bottomNavRow}>
        <button
          type="button"
          className={`${styles.scrollActionBtn} ${isUnifiedBottom ? styles.finalAction : ''}`}
          onClick={advanceStep}
          aria-label="Next Step"
        >
          {currentStep === 0 && (
            <>
              <span>Scroll to Begin Melody</span>
              <span className={styles.arrowIcon}>↓</span>
            </>
          )}
          {currentStep >= 1 && currentStep < 8 && (
            <>
              <span>Scroll for Next Note ({currentStep}/8)</span>
              <span className={styles.arrowIcon}>↓</span>
            </>
          )}
          {currentStep === 8 && (
            <>
              <span>Scroll or Click to Enter Portfolio</span>
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
