import { createContext } from 'react';
import type { AnimationContextType } from './types';

export const AnimationContext = createContext<AnimationContextType | undefined>(undefined);
