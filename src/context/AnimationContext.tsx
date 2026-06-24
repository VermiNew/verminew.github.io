import React, { createContext, useState, useEffect } from 'react';
import { AnimationContextType } from './types';

export const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(() => {
    const saved = localStorage.getItem('reducedMotion');
    if (saved !== null) return saved === 'true';
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  });

  const [smoothScroll, setSmoothScroll] = useState(() => {
    const saved = localStorage.getItem('smoothScroll');
    if (saved !== null) return saved === 'true';
    return true;
  });

  useEffect(() => {
    localStorage.setItem('reducedMotion', reducedMotion.toString());
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('smoothScroll', smoothScroll.toString());
    document.documentElement.setAttribute(
      'data-smooth-scroll',
      smoothScroll ? 'true' : 'false'
    );
  }, [smoothScroll]);

  return (
    <AnimationContext.Provider value={{ reducedMotion, setReducedMotion, smoothScroll, setSmoothScroll }}>
      {children}
    </AnimationContext.Provider>
  );
};

export { useAnimation } from './hooks/useAnimationHook'; 