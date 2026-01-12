import { useContext } from 'react';
import { AnimationContext } from '../AnimationContext';

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};
