import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface SectionTransitionProps {
  children: React.ReactNode;
  delay?: number;
}

const TransitionContainer = styled(motion.div)`
  width: 100%;
  position: relative;
`;

const transitionVariants = {
  hidden: { 
    opacity: 0,
    y: 30
  },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
      delay: delay
    }
  }),
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.4,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

export const SectionTransition: React.FC<SectionTransitionProps> = ({ 
  children,
  delay = 0
}) => {
  return (
    <TransitionContainer
      variants={transitionVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, margin: "-100px" }}
      custom={delay}
    >
      {children}
    </TransitionContainer>
  );
}; 