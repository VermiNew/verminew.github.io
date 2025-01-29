import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  fullWidth?: boolean;
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
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

export const Section: React.FC<SectionProps> = ({
  children,
  id,
  className,
  fullWidth = false
}) => {
  return (
    <StyledSection
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
    >
      <Container fullWidth={fullWidth}>
        {children}
      </Container>
    </StyledSection>
  );
}; 