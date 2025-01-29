import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from '@/context/ThemeContext';
import { useAnimation } from '@/context/AnimationContext';

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
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

export const HeroBackground: React.FC = () => {
  const { themeMode } = useTheme();
  const { reducedMotion } = useAnimation();
  const isDark = themeMode === 'dark';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
      particles.current = [];

      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2 + 1;
        
        // Dostosuj kolory cząsteczek w zależności od motywu
        const color = isDark
          ? `rgba(${Math.random() * 50 + 150}, ${Math.random() * 50 + 150}, ${
              Math.random() * 50 + 200
            }, 0.5)`
          : `rgba(${Math.random() * 50 + 100}, ${Math.random() * 50 + 150}, ${
              Math.random() * 50 + 200
            }, 0.3)`;

        particles.current.push({
          x,
          y,
          radius,
          color,
          vx: 0,
          vy: 0,
          originalX: x,
          originalY: y,
        });
      }
    };

    const animate = () => {
      if (reducedMotion) {
        // If reduced motion is enabled, just draw static particles
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.current.forEach((particle) => {
          ctx.beginPath();
          ctx.arc(particle.originalX, particle.originalY, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
        });
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle) => {
        const dx = mousePosition.current.x - particle.x;
        const dy = mousePosition.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 0.5;
          particle.vy -= Math.sin(angle) * force * 0.5;
        }

        // Return to original position
        particle.vx += (particle.originalX - particle.x) * 0.05;
        particle.vy += (particle.originalY - particle.y) * 0.05;

        // Apply friction
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    };

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    resizeCanvas();
    createParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isDark, reducedMotion]);

  return <Canvas ref={canvasRef} />;
}; 