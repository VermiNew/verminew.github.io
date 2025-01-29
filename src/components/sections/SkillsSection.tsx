import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Section } from '@/components/layout/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { TechnologyGrid } from '@/components/sections/TechnologyGrid';
import { useTranslation } from 'react-i18next';
import { useAnimation } from '@/context/AnimationContext';

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Description = styled(motion.p)`
  text-align: center;
  font-size: 1.1rem;
  color: ${({ theme }) => theme['colors'].textSecondary};
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const GridContainer = styled(motion.div)`
  display: grid;
  gap: 2rem;
  margin-top: 2rem;
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export const SkillsSection: React.FC = () => {
  const { t } = useTranslation();
  const { reducedMotion } = useAnimation();

  return (
    <Section id="skills">
      <Content>
        <motion.div
          variants={!reducedMotion ? containerVariants : undefined}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionTitle variants={!reducedMotion ? itemVariants : undefined}>
            {t('about.skills.title')}
          </SectionTitle>
          <Description variants={!reducedMotion ? itemVariants : undefined}>
            {t('about.skills.description')}
          </Description>
          <GridContainer variants={!reducedMotion ? itemVariants : undefined}>
            <TechnologyGrid />
          </GridContainer>
        </motion.div>
      </Content>
    </Section>
  );
}; 