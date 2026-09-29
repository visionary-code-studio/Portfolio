'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './Hero3DCanvas.module.css';

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId: number;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // ── 1. Scene, Camera & WebGL Renderer ─────────────────────────
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // ── 2. Create Star Particle Texture ───────────────────────────
    const createStarTexture = () => {
      const size = 64;
      const offCanvas = document.createElement('canvas');
      offCanvas.width = size;
      offCanvas.height = size;
      const ctx = offCanvas.getContext('2d');
      if (!ctx) return null;

      const center = size / 2;
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(240, 246, 255, 0.95)');
      gradient.addColorStop(0.5, 'rgba(200, 220, 245, 0.55)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(offCanvas);
      texture.needsUpdate = true;
      return texture;
    };

    const starTexture = createStarTexture();

    // ── 3. Galaxy Mathematical Architecture ───────────────────────
    const galaxyGroup = new THREE.Group();
    // Default 3D perspective inclination
    galaxyGroup.position.set(0, 0.4, 0);
    galaxyGroup.rotation.x = Math.PI * 0.32; // Tilted towards camera for dramatic depth
    galaxyGroup.rotation.y = -Math.PI * 0.06;

    const starCount = 2200;
    const armsCount = 4;
    const maxRadius = 11.5;
    const spinFactor = 2.4;
    const randomnessFactor = 0.55;
    const randomnessPower = 3.2;

    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const initialRadii = new Float32Array(starCount);
    const initialAngles = new Float32Array(starCount);
    const initialSpeeds = new Float32Array(starCount);

    // Harmonious palette tailored specifically for light mode (#ffffff background):
    // Deep obsidian/slate, midnight indigo, celestial sapphire, starlight cyan & teal.
    const colorPalette = [
      new THREE.Color('#0f172a'), // Deep Slate / Obsidian
      new THREE.Color('#1e293b'), // Charcoal
      new THREE.Color('#0369a1'), // Celestial Blue
      new THREE.Color('#0284c7'), // Sapphire
      new THREE.Color('#0891b2'), // Starlight Cyan
      new THREE.Color('#312e81'), // Midnight Indigo
      new THREE.Color('#0f766e'), // Deep Teal
      new THREE.Color('#475569'), // Cosmic Graphite
    ];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;

      // Distance from center (power distribution clusters more stars near galactic core)
      const r = Math.pow(Math.random(), 1.6) * maxRadius;
      initialRadii[i] = r;

      // Logarithmic spiral arm calculation
      const armAngle = ((i % armsCount) * (Math.PI * 2)) / armsCount;
      const spiralAngle = r * spinFactor;
      const angle = armAngle + spiralAngle;
      initialAngles[i] = angle;

      // Angular orbital speed (inner stars rotate slightly faster, differential Keplerian drift)
      initialSpeeds[i] = (0.28 / (Math.max(r, 1.2) * 0.75 + 1)) * 0.008;

      // Exponential spread/falloff around arm centerline
      const randomX =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomnessFactor *
        (r * 0.35 + 0.3);
      const randomY =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomnessFactor *
        (r * 0.35 + 0.3);
      const randomZ =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        (randomnessFactor * 0.45) *
        (r * 0.25 + 0.2);

      positions[i3] = Math.cos(angle) * r + randomX;
      positions[i3 + 1] = Math.sin(angle) * r + randomY;
      positions[i3 + 2] = randomZ;

      // Color selection based on distance from core & arm
      let color: THREE.Color;
      if (r < 2.0) {
        // Galactic Core: High density, deep celestial sapphire & indigo
        color = Math.random() < 0.5 ? colorPalette[2] : colorPalette[5];
      } else if (r < 6.0) {
        // Mid-spiral arms: Rich blend of obsidian, sapphire, and starlight cyan
        const pick = Math.floor(Math.random() * 5);
        color = colorPalette[pick];
      } else {
        // Outer arms & halo: Elegant cosmic graphite and charcoal dust
        color = Math.random() < 0.6 ? colorPalette[0] : colorPalette[7];
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const galaxyGeo = new THREE.BufferGeometry();
    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const galaxyMat = new THREE.PointsMaterial({
      size: 0.38,
      map: starTexture || undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const galaxyStars = new THREE.Points(galaxyGeo, galaxyMat);
    galaxyGroup.add(galaxyStars);

    // ── 4. Luminous Galactic Core Halo ─────────────────────────────
    const coreCount = 180;
    const corePositions = new Float32Array(coreCount * 3);
    const coreColors = new Float32Array(coreCount * 3);

    for (let c = 0; c < coreCount; c++) {
      const c3 = c * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = Math.pow(Math.random(), 2.2) * 2.2;

      corePositions[c3] = rad * Math.sin(phi) * Math.cos(theta);
      corePositions[c3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
      corePositions[c3 + 2] = (rad * Math.cos(phi)) * 0.4;

      const coreCol = Math.random() < 0.5 ? new THREE.Color('#0284c7') : new THREE.Color('#0f172a');
      coreColors[c3] = coreCol.r;
      coreColors[c3 + 1] = coreCol.g;
      coreColors[c3 + 2] = coreCol.b;
    }

    const coreGeo = new THREE.BufferGeometry();
    coreGeo.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));
    coreGeo.setAttribute('color', new THREE.BufferAttribute(coreColors, 3));

    const coreMat = new THREE.PointsMaterial({
      size: 0.58,
      map: starTexture || undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const coreStars = new THREE.Points(coreGeo, coreMat);
    galaxyGroup.add(coreStars);

    // ── 5. Celestial Orbital Rings (Subtle Stellar Geometry) ────────
    const orbitalGroup = new THREE.Group();
    const ringRadii = [3.2, 5.8, 8.6];
    const ringColors = [0x0284c7, 0x0f172a, 0x0891b2];

    ringRadii.forEach((radius, idx) => {
      const segments = 80;
      const ringPoints: THREE.Vector3[] = [];
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        ringPoints.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
      const ringMat = new THREE.LineBasicMaterial({
        color: ringColors[idx],
        transparent: true,
        opacity: 0.09 - idx * 0.02,
        blending: THREE.NormalBlending,
      });
      orbitalGroup.add(new THREE.Line(ringGeo, ringMat));
    });

    galaxyGroup.add(orbitalGroup);
    scene.add(galaxyGroup);

    // ── 6. Cursor Parallax & Inertia Interaction ──────────────────
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / height) * 2 - 1);
      targetX = nx;
      targetY = ny;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Window Resize smoothly
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    window.addEventListener('resize', handleResize);

    // ── 7. Render & Cosmic Animation Loop ─────────────────────────
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth cursor parallax with fluid inertia
      currentX += (targetX - currentX) * 0.045;
      currentY += (targetY - currentY) * 0.045;

      // Base 3D rotation + interactive parallax tilt
      galaxyGroup.rotation.x = Math.PI * 0.32 - currentY * 0.22;
      galaxyGroup.rotation.y = -Math.PI * 0.06 + currentX * 0.28;

      // Continuous orbital vortex rotation of the entire galaxy
      galaxyGroup.rotation.z = elapsedTime * 0.038;

      // Core gentle breathing pulsation
      const breath = Math.sin(elapsedTime * 0.8) * 0.025 + 1.0;
      coreStars.scale.set(breath, breath, breath);

      // Orbital rings subtle counter-rotation
      orbitalGroup.rotation.z = -elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // ── 8. Cleanup on Unmount ─────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      renderer.dispose();
      galaxyGeo.dispose();
      galaxyMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      if (starTexture) starTexture.dispose();

      orbitalGroup.traverse((child) => {
        if (child instanceof THREE.Line) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) child.material.dispose();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.canvasContainer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.vignette} />
    </div>
  );
}
