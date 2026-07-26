import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { useAnimation } from '@/context/hooks/useAnimation';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  fullWidth?: boolean;
  animate?: boolean;
}

const StyledSection = styled(motion.section)`
  padding: 4rem 0;
  position: relative;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 3rem 0;
  }
`;

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const Section: React.FC<SectionProps> = ({
  children,
  id,
  className,
  fullWidth = false,
  animate = false,
}) => {
  const { reducedMotion } = useAnimation();
  const shouldAnimate = animate && !reducedMotion;

  return (
    <StyledSection
      id={id}
      className={className}
      initial={shouldAnimate ? 'hidden' : false}
      whileInView={shouldAnimate ? 'visible' : undefined}
      viewport={{ once: true, margin: '-100px' }}
      variants={shouldAnimate ? sectionVariants : undefined}
    >
      <Container fullWidth={fullWidth}>{children}</Container>
    </StyledSection>
  );
};
