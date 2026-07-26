import React, { useEffect, useMemo, useState } from 'react';
import type { AnimationContextType, MotionPreference } from './types';
import { safeStorage } from '@/utils/storage';
import { AnimationContext } from './AnimationContextValue';

const MOTION_STORAGE_KEY = 'motionPreference';
const LEGACY_REDUCED_MOTION_KEY = 'reducedMotion';
const SMOOTH_SCROLL_KEY = 'smoothScroll';


const readMotionPreference = (): MotionPreference => {
  const saved = safeStorage.get(MOTION_STORAGE_KEY);
  if (saved === 'system' || saved === 'full' || saved === 'reduced') return saved;

  const legacy = safeStorage.get(LEGACY_REDUCED_MOTION_KEY);
  if (legacy === 'true') return 'reduced';
  if (legacy === 'false') return 'full';
  return 'system';
};

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [motionPreference, setMotionPreference] = useState<MotionPreference>(readMotionPreference);
  const [systemReducedMotion, setSystemReducedMotion] = useState(
    () => typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false),
  );
  const [smoothScroll, setSmoothScroll] = useState(() => {
    const saved = safeStorage.get(SMOOTH_SCROLL_KEY);
    return saved === null ? true : saved === 'true';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mediaQuery) return;

    const handleChange = (event: MediaQueryListEvent) => setSystemReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    safeStorage.set(MOTION_STORAGE_KEY, motionPreference);
    safeStorage.remove(LEGACY_REDUCED_MOTION_KEY);
  }, [motionPreference]);

  useEffect(() => {
    safeStorage.set(SMOOTH_SCROLL_KEY, smoothScroll.toString());
    document.documentElement.dataset.smoothScroll = smoothScroll ? 'true' : 'false';
  }, [smoothScroll]);

  const reducedMotion = motionPreference === 'reduced'
    || (motionPreference === 'system' && systemReducedMotion);

  const value = useMemo<AnimationContextType>(() => ({
    motionPreference,
    setMotionPreference,
    reducedMotion,
    smoothScroll,
    setSmoothScroll,
  }), [motionPreference, reducedMotion, smoothScroll]);

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};
