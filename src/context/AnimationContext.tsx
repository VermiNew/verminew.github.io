import React, { createContext, useState, useEffect } from 'react';
import { AnimationContextType } from './types';

export const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(() => 
    localStorage.getItem('reducedMotion') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('reducedMotion', reducedMotion.toString());
  }, [reducedMotion]);

  return (
    <AnimationContext.Provider value={{ reducedMotion, setReducedMotion }}>
      {children}
    </AnimationContext.Provider>
  );
};

export { useAnimation } from './hooks/useAnimationHook'; 