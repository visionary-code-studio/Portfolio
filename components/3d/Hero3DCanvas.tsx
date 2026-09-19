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

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 16);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // ── 2. Create Soft Glowing Circle Texture for Particles ───────
    const createCircleTexture = () => {
      const size = 64;
      const offCanvas = document.createElement('canvas');
      offCanvas.width = size;
      offCanvas.height = size;
      const ctx = offCanvas.getContext('2d');
      if (!ctx) return null;

      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(56, 189, 248, 0.85)');
      gradient.addColorStop(0.7, 'rgba(16, 185, 129, 0.35)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(offCanvas);
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createCircleTexture();

    // ── 3. 3D Keynote Holographic Stage Floor (Under Speaker's Feet) ───
    // Positioned horizontally beneath the speaker's grounded stance
    const stageGroup = new THREE.Group();
    stageGroup.position.set(0, -4.9, 0);
    stageGroup.rotation.x = Math.PI * 0.44; // Angled in 3D perspective

    // Concentric glowing rings
    const ringColors = [0x0284c7, 0x10b981, 0x6366f1, 0xf59e0b];
    const ringRadii = [5.6, 4.2, 2.8, 1.5];

    ringRadii.forEach((radius, idx) => {
      const segments = 96;
      const ringPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        ringPoints.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
      const ringMat = new THREE.LineBasicMaterial({
        color: ringColors[idx % ringColors.length],
        transparent: true,
        opacity: 0.35 - idx * 0.05,
        blending: THREE.NormalBlending,
      });
      const ringLine = new THREE.Line(ringGeo, ringMat);
      stageGroup.add(ringLine);
    });

    // Holographic radial spokes spanning stage floor
    const numSpokes = 12;
    for (let s = 0; s < numSpokes; s++) {
      const angle = (s / numSpokes) * Math.PI * 2;
      const spokePoints = [
        new THREE.Vector3(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0),
        new THREE.Vector3(Math.cos(angle) * 5.6, Math.sin(angle) * 5.6, 0),
      ];
      const spokeGeo = new THREE.BufferGeometry().setFromPoints(spokePoints);
      const spokeMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.15,
        blending: THREE.NormalBlending,
      });
      stageGroup.add(new THREE.Line(spokeGeo, spokeMat));
    }

    scene.add(stageGroup);

    // ── 4. Speech / Microphone Acoustic Waveform Ribbons ───────────
    // Dynamic sinusoidal soundwaves undulating across stage in depth
    const waveCount = 3;
    const waveSegments = 140;
    const waveLines: { line: THREE.Line; baseY: number; baseZ: number; speed: number; freq: number; amp: number }[] = [];
    const waveColors = [0x0284c7, 0x10b981, 0x8b5cf6];

    for (let w = 0; w < waveCount; w++) {
      const positions = new Float32Array(waveSegments * 3);
      const waveGeo = new THREE.BufferGeometry();
      waveGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const waveMat = new THREE.LineBasicMaterial({
        color: waveColors[w],
        transparent: true,
        opacity: 0.45,
        blending: THREE.NormalBlending,
        linewidth: 2,
      });

      const line = new THREE.Line(waveGeo, waveMat);
      scene.add(line);

      waveLines.push({
        line,
        baseY: 0.5 - w * 1.1,
        baseZ: -1.5 - w * 1.2,
        speed: 1.6 + w * 0.5,
        freq: 0.38 + w * 0.15,
        amp: 0.65 - w * 0.1,
      });
    }

    // ── 5. AI Neural Constellation (Data Nodes & Graphs) ───────────
    const particleCount = 130;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 22;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 12 - 2;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.006,
        y: (Math.random() - 0.5) * 0.006,
        z: (Math.random() - 0.5) * 0.006,
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.45,
      map: particleTexture || undefined,
      transparent: true,
      opacity: 0.85,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Dynamic neural connection lines
    const maxConnections = 240;
    const linePositions = new Float32Array(maxConnections * 6);
    const connectionGeo = new THREE.BufferGeometry();
    connectionGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const connectionMat = new THREE.LineBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.28,
      blending: THREE.NormalBlending,
    });

    const connectionMesh = new THREE.LineSegments(connectionGeo, connectionMat);
    scene.add(connectionMesh);

    // ── 6. Microphone Acoustic Radial Pulse Rings ───────────────────
    // Expanding sound waves emanating from speaker microphone coordinate
    const micPulses: { mesh: THREE.Line; scale: number; maxScale: number; speed: number }[] = [];
    const pulseSegments = 64;
    const pulsePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= pulseSegments; i++) {
      const theta = (i / pulseSegments) * Math.PI * 2;
      pulsePoints.push(new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0));
    }
    const pulseBaseGeo = new THREE.BufferGeometry().setFromPoints(pulsePoints);

    for (let p = 0; p < 3; p++) {
      const pMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.5,
        blending: THREE.NormalBlending,
      });
      const pMesh = new THREE.Line(pulseBaseGeo, pMat);
      pMesh.position.set(-0.25, 0.95, 0.4); // Centered on microphone
      scene.add(pMesh);

      micPulses.push({
        mesh: pMesh,
        scale: 0.2 + p * 1.3,
        maxScale: 4.8,
        speed: 0.022,
      });
    }

    // ── 7. Interactive Cursor Parallax & Inertia ────────────────────
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

    // Handle Resize smoothly
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    window.addEventListener('resize', handleResize);

    // ── 8. Render & Animation Loop ─────────────────────────────────
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      camera.position.x = currentX * 2.2;
      camera.position.y = 0.2 + currentY * 1.3;
      camera.lookAt(0, -0.6, 0);

      // Rotate holographic stage floor
      stageGroup.rotation.z += 0.002;

      // Update speech soundwave ribbons
      waveLines.forEach(({ line, baseY, baseZ, speed, freq, amp }, idx) => {
        const geo = line.geometry;
        const posAttr = geo.attributes.position;
        const array = posAttr.array as Float32Array;

        const xSpan = 24;
        const dynamicAmp = amp * (1 + Math.abs(currentX) * 0.35);

        for (let i = 0; i < waveSegments; i++) {
          const u = i / (waveSegments - 1);
          const x = (u - 0.5) * xSpan;
          const sine1 = Math.sin(x * freq + elapsedTime * speed);
          const sine2 = Math.cos(x * (freq * 1.8) - elapsedTime * (speed * 0.7)) * 0.4;
          const y = baseY + (sine1 + sine2) * dynamicAmp;
          const z = baseZ + Math.sin(x * 0.2 + elapsedTime) * 0.5;

          const idx3 = i * 3;
          array[idx3] = x;
          array[idx3 + 1] = y;
          array[idx3 + 2] = z;
        }

        posAttr.needsUpdate = true;
      });

      // Update floating AI neural constellation
      const pArray = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const v = particleVelocities[i];

        pArray[i3] += v.x;
        pArray[i3 + 1] += v.y;
        pArray[i3 + 2] += v.z;

        if (Math.abs(pArray[i3]) > 11) v.x *= -1;
        if (Math.abs(pArray[i3 + 1]) > 7) v.y *= -1;
        if (Math.abs(pArray[i3 + 2]) > 7) v.z *= -1;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Calculate neural connections between nearest neighbors
      const connPos = connectionGeo.attributes.position.array as Float32Array;
      let lineIdx = 0;
      const maxDist = 3.2;

      for (let i = 0; i < particleCount && lineIdx < maxConnections; i++) {
        const i3 = i * 3;
        for (let j = i + 1; j < particleCount && lineIdx < maxConnections; j++) {
          const j3 = j * 3;
          const dx = pArray[i3] - pArray[j3];
          const dy = pArray[i3 + 1] - pArray[j3 + 1];
          const dz = pArray[i3 + 2] - pArray[j3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < maxDist * maxDist) {
            const baseIndex = lineIdx * 6;
            connPos[baseIndex] = pArray[i3];
            connPos[baseIndex + 1] = pArray[i3 + 1];
            connPos[baseIndex + 2] = pArray[i3 + 2];

            connPos[baseIndex + 3] = pArray[j3];
            connPos[baseIndex + 4] = pArray[j3 + 1];
            connPos[baseIndex + 5] = pArray[j3 + 2];

            lineIdx++;
          }
        }
      }

      // Zero out remaining unused line segments
      for (let k = lineIdx * 6; k < maxConnections * 6; k++) {
        connPos[k] = 0;
      }
      connectionGeo.attributes.position.needsUpdate = true;

      // Update microphone acoustic ripple pulses
      micPulses.forEach((pulse) => {
        pulse.scale += pulse.speed;
        if (pulse.scale > pulse.maxScale) {
          pulse.scale = 0.2;
        }
        pulse.mesh.scale.set(pulse.scale, pulse.scale, 1);

        const progress = (pulse.scale - 0.2) / (pulse.maxScale - 0.2);
        const mat = pulse.mesh.material as THREE.LineBasicMaterial;
        mat.opacity = Math.sin((1 - progress) * Math.PI) * 0.45;
      });

      renderer.render(scene, camera);
    };

    animate();

    // ── 9. Cleanup on Unmount ──────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      connectionGeo.dispose();
      connectionMat.dispose();
      pulseBaseGeo.dispose();
      if (particleTexture) particleTexture.dispose();

      stageGroup.traverse((child) => {
        if (child instanceof THREE.Line) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) child.material.dispose();
        }
      });

      waveLines.forEach(({ line }) => {
        line.geometry.dispose();
        if (line.material instanceof THREE.Material) line.material.dispose();
      });

      micPulses.forEach(({ mesh }) => {
        if (mesh.material instanceof THREE.Material) mesh.material.dispose();
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
