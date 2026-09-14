'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
import styles from './WebGLSplashReveal.module.css';

interface WebGLSplashRevealProps {
  onRevealComplete?: () => void;
}

export default function WebGLSplashReveal({ onRevealComplete }: WebGLSplashRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [progress, setProgress] = useState(0);
  const animatingRef = useRef(false);

  const startReveal = useCallback(() => {
    if (animatingRef.current || isRevealed) return;
    animatingRef.current = true;

    const duration = 1200; // ms
    const startTime = performance.now();

    const animateReveal = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);

      // Ease-in-out cubic
      const ease = t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      setProgress(ease);

      if (t < 1) {
        requestAnimationFrame(animateReveal);
      } else {
        setIsRevealed(true);
        if (onRevealComplete) onRevealComplete();
        document.body.style.overflow = '';
      }
    };

    requestAnimationFrame(animateReveal);
  }, [isRevealed, onRevealComplete]);

  // Lock document scroll until splash is revealed
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

  // Scroll / Wheel / Touch trigger to reveal portfolio
  useEffect(() => {
    if (isRevealed) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 8 || Math.abs(e.deltaX) > 12) {
        startReveal();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      if (Math.abs(touchStartY - touchY) > 20) {
        startReveal();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'Space', 'Enter'].includes(e.code)) {
        startReveal();
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
  }, [isRevealed, startReveal]);

  // ── Three.js Interactive 3D Scene Animation & WebGL Fly-Through ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f8f9fc');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // 2. Interactive 3D Wireframe Kinetic Torus Knot & Wave Geometry
    const knotGeometry = new THREE.TorusKnotGeometry(1.65, 0.42, 140, 36, 2, 3);
    const knotMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.35,
      metalness: 0.85,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
    scene.add(knotMesh);

    // Inner Core Sphere
    const coreGeo = new THREE.IcosahedronGeometry(0.95, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Warm gold core
      roughness: 0.2,
      metalness: 0.9,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // 3. Floating 3D Particle Cloud (Orbiting Lattice)
    const particleCount = 650;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      scales[i] = Math.random() * 0.04 + 0.02;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMat = new THREE.PointsMaterial({
      color: 0x0f172a,
      size: 0.05,
      transparent: true,
      opacity: 0.55,
      blending: THREE.NormalBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xd97706, 3, 20);
    pointLight.position.set(4, 5, 5);
    scene.add(pointLight);

    const fillLight = new THREE.PointLight(0x3b82f6, 2, 20);
    fillLight.position.set(-5, -4, 4);
    scene.add(fillLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / width) * 2 - 1;
      const y = -(e.clientY / height) * 2 + 1;
      targetRotY = x * 0.7;
      targetRotX = -y * 0.7;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 5. Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetRotX - mouseX) * 0.05;
      mouseY += (targetRotY - mouseY) * 0.05;

      // Base idle rotation
      knotMesh.rotation.x = elapsedTime * 0.35 + mouseX;
      knotMesh.rotation.y = elapsedTime * 0.45 + mouseY;

      coreMesh.rotation.x = -elapsedTime * 0.5 + mouseX;
      coreMesh.rotation.y = -elapsedTime * 0.6 + mouseY;

      particleSystem.rotation.y = elapsedTime * 0.08 + mouseY * 0.5;

      // WebGL Transition Response during Scroll Reveal (Fly-Through & Dispersion)
      if (progress > 0) {
        // Camera flies through
        camera.position.z = 7 - progress * 5.8;
        
        // 3D Geometry scales outward and dissolves
        const scale = 1 + progress * 3.5;
        knotMesh.scale.set(scale, scale, scale);
        coreMesh.scale.set(scale * 0.9, scale * 0.9, scale * 0.9);
        
        knotMaterial.opacity = Math.max(0, 0.45 * (1 - progress * 1.5));
        coreMat.opacity = Math.max(0, 0.75 * (1 - progress * 1.5));
        particleMat.opacity = Math.max(0, 0.55 * (1 - progress * 1.5));
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      knotGeometry.dispose();
      knotMaterial.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [progress]);

  if (isRevealed) {
    return null;
  }

  // HTML content smoothly fades & sweeps up as progress increases
  const contentOpacity = Math.max(0, 1 - progress * 2.2);
  const contentTransform = `translateY(-${progress * 90}px) scale(${1 - progress * 0.05})`;

  return (
    <aside
      ref={containerRef}
      className={styles.splashOverlay}
      style={{
        opacity: Math.max(0, 1 - progress * 1.2),
        pointerEvents: progress > 0.8 ? 'none' : 'auto',
      }}
      aria-label="Welcome Splash Screen"
      onClick={startReveal}
    >
      {/* ── 3D Three.js Interactive WebGL Canvas ────────────────── */}
      <canvas ref={canvasRef} className={styles.webglCanvas} />

      {/* ── Editorial Splash Typography & Content ──────────────── */}
      <div
        className={styles.contentWrap}
        style={{
          opacity: contentOpacity,
          transform: contentTransform,
        }}
      >
        {/* Top Monogram Badge */}
        <div className={styles.topBadge}>
          <div className={styles.logoCircle}>
            <Image
              src="/images/logo.png"
              alt="Vaibhav Shaw Logo"
              width={42}
              height={42}
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <span className={styles.monogramText}>VAIBHAV SHAW</span>
        </div>

        {/* Described Bold Headline */}
        <div className={styles.headlineBlock}>
          <h1 className={styles.mainTitle}>
            <span className={styles.titleLineOne}>VAIBHAV SHAW PORTFOLIO</span>
            <span className={styles.titleLineTwo}>WELCOME TO MY PORTFOLIO</span>
          </h1>
        </div>

        {/* Subtitle & Role Tag */}
        <div className={styles.subBlock}>
          <span className={styles.tagPill}>
            <span className={styles.greenDot} />
            AIML ENGINEER &amp; FULL STACK DEVELOPER
          </span>
          <p className={styles.tagline}>
            Architecting intelligent neural systems &amp; high-performance web applications.
          </p>
        </div>

        {/* Scroll To Reveal Cue / Action Button */}
        <div className={styles.bottomCue}>
          <button
            className={styles.revealBtn}
            onClick={startReveal}
            data-cursor-hover
            aria-label="Scroll or Click to Enter Portfolio"
          >
            <span>Scroll to Enter Portfolio</span>
            <span className={styles.arrowIcon}>↓</span>
          </button>
          <div className={styles.scrollIndicatorLine} />
        </div>
      </div>
    </aside>
  );
}
