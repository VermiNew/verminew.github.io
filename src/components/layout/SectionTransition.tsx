import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAnimation } from '@/context/AnimationContext';

interface SectionTransitionProps {
  children: React.ReactNode;
}

const TransitionContainer = styled(motion.div)`
  width: 100%;
  position: relative;
`;

export const SectionTransition: React.FC<SectionTransitionProps> = ({ children }) => {
  const { reducedMotion } = useAnimation();

  return (
    <TransitionContainer
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={reducedMotion ? undefined : { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </TransitionContainer>
  );
};
