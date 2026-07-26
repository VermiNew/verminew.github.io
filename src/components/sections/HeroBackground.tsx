import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from '@/context/hooks/useTheme';
import { useAnimation } from '@/context/hooks/useAnimation';

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: auto;
`;

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((character) => character + character).join('')
    : normalized;
  const parsed = Number.parseInt(value, 16);
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
};

export const HeroBackground: React.FC = () => {
  const { theme } = useTheme();
  const { reducedMotion } = useAnimation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const pointerPosition = useRef({ x: -1_000, y: -1_000 });
  const animationFrameId = useRef<number | null>(null);
  const visible = useRef(document.visibilityState === 'visible');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    const [red, green, blue] = hexToRgb(theme.colors.primary);

    const resizeCanvas = (): void => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticles = (): void => {
      const count = Math.min(90, Math.max(24, Math.floor((width * height) / 18_000)));
      particles.current = Array.from({ length: count }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          radius: Math.random() * 1.8 + 0.8,
          color: `rgba(${red}, ${green}, ${blue}, ${0.2 + Math.random() * 0.28})`,
          vx: 0,
          vy: 0,
          originalX: x,
          originalY: y,
        };
      });
    };

    const draw = (animateParticles: boolean): void => {
      context.clearRect(0, 0, width, height);

      for (const particle of particles.current) {
        if (animateParticles) {
          const deltaX = pointerPosition.current.x - particle.x;
          const deltaY = pointerPosition.current.y - particle.y;
          const distance = Math.hypot(deltaX, deltaY);
          const maxDistance = 150;

          if (distance > 0 && distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const angle = Math.atan2(deltaY, deltaX);
            particle.vx -= Math.cos(angle) * force * 0.45;
            particle.vy -= Math.sin(angle) * force * 0.45;
          }

          particle.vx += (particle.originalX - particle.x) * 0.04;
          particle.vy += (particle.originalY - particle.y) * 0.04;
          particle.vx *= 0.94;
          particle.vy *= 0.94;
          particle.x += particle.vx;
          particle.y += particle.vy;
        } else {
          particle.x = particle.originalX;
          particle.y = particle.originalY;
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = particle.color;
        context.fill();
      }
    };

    const animate = (): void => {
      if (!visible.current) return;
      draw(!reducedMotion);
      if (!reducedMotion) animationFrameId.current = requestAnimationFrame(animate);
    };

    const restartAnimation = (): void => {
      if (animationFrameId.current !== null) cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
      if (visible.current) animate();
    };

    const updatePointer = (clientX: number, clientY: number): void => {
      if (reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      pointerPosition.current = { x: clientX - rect.left, y: clientY - rect.top };
    };

    const handlePointerMove = (event: PointerEvent): void => {
      updatePointer(event.clientX, event.clientY);
    };

    const handlePointerLeave = (): void => {
      pointerPosition.current = { x: -1_000, y: -1_000 };
    };

    const handleVisibilityChange = (): void => {
      visible.current = document.visibilityState === 'visible';
      if (!visible.current && animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      } else if (visible.current) {
        restartAnimation();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      createParticles();
      restartAnimation();
    });

    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    resizeCanvas();
    createParticles();
    restartAnimation();

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameId.current !== null) cancelAnimationFrame(animationFrameId.current);
    };
  }, [reducedMotion, theme.colors.primary]);

  return <Canvas ref={canvasRef} aria-hidden="true" />;
};
