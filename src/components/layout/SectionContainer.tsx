import styled from 'styled-components';
import { motion } from 'framer-motion';

export const SectionContainer = styled(motion.section)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1rem;
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`; 