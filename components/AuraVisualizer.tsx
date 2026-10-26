import React, { useRef, useEffect } from 'react';
import type { EmotionState } from '../types';
import { EMOTION_CONFIG } from '../constants';

interface AuraVisualizerProps {
  emotion: EmotionState | null;
}

class Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  orbitRadius: number;
  angle: number;
  speed: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 1;
    this.baseX = this.x;
    this.baseY = this.y;
    this.vx = 0;
    this.vy = 0;
    this.orbitRadius = Math.random() * 25 + 70;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = (Math.random() * 0.02 + 0.01) / 2;
  }

  update(center: { x: number, y: number }, emotion: EmotionState) {
    this.baseX = center.x;
    this.baseY = center.y;

    if (emotion.stability > 80) { // Stable: Orbital
      this.angle += this.speed * (emotion.intensity / 100 + 0.5);
      this.x = this.baseX + Math.cos(this.angle) * this.orbitRadius;
      this.y = this.baseY + Math.sin(this.angle) * this.orbitRadius;
    } else if (emotion.stability > 40) { // Fluid: Flowing
      let returnForceX = (this.baseX + Math.cos(this.angle) * this.orbitRadius - this.x) * 0.001;
      let returnForceY = (this.baseY + Math.sin(this.angle) * this.orbitRadius - this.y) * 0.001;
      this.vx += returnForceX + (Math.random() - 0.5) * 0.2;
      this.vy += returnForceY + (Math.random() - 0.5) * 0.2;
      this.angle += this.speed / 2;
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.x += this.vx;
      this.y += this.vy;
    } else { // Unstable: Erratic
      this.vx += (Math.random() - 0.5) * (1 + (100 - emotion.stability) / 25);
      this.vy += (Math.random() - 0.5) * (1 + (100 - emotion.stability) / 25);
      this.vx *= 0.9;
      this.vy *= 0.9;
      this.x += this.vx;
      this.y += this.vy;

      let dx = this.x - this.baseX;
      let dy = this.y - this.baseY;
      if (Math.sqrt(dx * dx + dy * dy) > this.orbitRadius * 1.5) {
        this.x = this.baseX;
        this.y = this.baseY;
        this.vx = 0;
        this.vy = 0;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    g.addColorStop(0, `rgba(${color}, 0.8)`);
    g.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

export const AuraVisualizer: React.FC<AuraVisualizerProps> = ({ emotion }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  // FIX: Provide an initial value to `useRef` to resolve the "Expected 1 arguments, but got 0" error, which can occur with certain TypeScript configurations when a generic is provided without an initial value.
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    if (width === 0 || height === 0) {
      const parent = canvas.parentElement;
      if (parent) {
        width = parent.offsetWidth;
        height = parent.offsetHeight;
      }
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const maxParticles = emotion ? 50 + Math.floor(emotion.intensity * 2) : 50;
    if (particlesRef.current.length > maxParticles) {
      particlesRef.current.splice(maxParticles);
    } else if (particlesRef.current.length < maxParticles) {
      for (let i = particlesRef.current.length; i < maxParticles; i++) {
        particlesRef.current.push(new Particle(width / 2, height / 2));
      }
    }

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      if (!emotion) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      const emotionConfig = EMOTION_CONFIG[emotion.label];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(p => {
        p.update({ x: width / 2, y: height / 2 }, emotion);
        p.draw(ctx, emotionConfig.rgb);
      });
    };
    const timeoutId = setTimeout(() => {
      animate();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [emotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};