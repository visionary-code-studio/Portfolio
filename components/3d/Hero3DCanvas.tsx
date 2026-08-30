'use client';

import { useEffect, useRef } from 'react';
import styles from './Hero3DCanvas.module.css';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
}

export default function Hero3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Damped Mouse / Tilt Coordinates
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      targetRotY = (x / width) * 0.8;
      targetRotX = -(y / height) * 0.8;
      mouseX = x;
      mouseY = y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate 3D Spherical & Lattice Points
    const numPoints = 72;
    const points: Point3D[] = [];
    const radius = Math.min(width, height) * 0.26;

    // Golden spiral sphere distribution (Fibonacci Sphere)
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({
        x: x * radius,
        y: y * radius,
        z: z * radius,
        baseX: x * radius,
        baseY: y * radius,
        baseZ: z * radius,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
      });
    }

    // Perspective parameters
    const fov = 420;

    let autoRot = 0;

    // Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Inertial smoothing
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;
      autoRot += 0.003;

      const currentRotY = rotY + autoRot;
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Projected points
      const projected: { x: number; y: number; z: number; scale: number; alpha: number }[] = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Micro motion
        p.baseX += p.vx;
        p.baseY += p.vy;
        p.baseZ += p.vz;
        if (Math.abs(p.baseX) > radius * 1.1) p.vx *= -1;
        if (Math.abs(p.baseY) > radius * 1.1) p.vy *= -1;
        if (Math.abs(p.baseZ) > radius * 1.1) p.vz *= -1;

        // 3D Rotations around Y then X
        const x1 = p.baseX * cosY - p.baseZ * sinY;
        const z1 = p.baseZ * cosY + p.baseX * sinY;

        const y2 = p.baseY * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.baseY * sinX;

        // Perspective projection
        const scale = fov / (fov + z2);
        const projX = width / 2 + x1 * scale;
        const projY = height / 2 + y2 * scale;
        const alpha = Math.max(0.12, Math.min(0.9, (z2 + radius) / (radius * 2)));

        projected.push({ x: projX, y: projY, z: z2, scale, alpha });
      }

      // Draw 3D Connecting Lines
      const maxDist = 95;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist * ((p1.scale + p2.scale) / 2)) {
            const lineAlpha = (1 - dist / (maxDist * p1.scale)) * 0.18 * ((p1.alpha + p2.alpha) / 2);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(200, 240, 74, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw 3D Nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const dotSize = Math.max(1.2, 2.8 * p.scale);

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 237, 232, ${p.alpha * 0.85})`;
        ctx.fill();

        // Subtle glowing accent on nearest nodes
        if (p.z > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, dotSize * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 240, 74, ${p.alpha * 0.25})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={styles.canvasContainer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.vignette} />
    </div>
  );
}
