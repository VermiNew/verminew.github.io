import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnimationContextType } from './types';

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

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