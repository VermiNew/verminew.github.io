import React from 'react';
import styled from 'styled-components';
import { motion, Variants } from 'framer-motion';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { HeroBackground } from './HeroBackground';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAnimation as useFramerAnimation } from 'framer-motion';
import { useAnimation as useReducedMotion } from '../../context/AnimationContext';

const HeroContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  padding: 2rem 0;
`;

const Content = styled(motion.div)<{ $isDark: boolean }>`
  z-index: 1;
  backdrop-filter: blur(5px);
  padding: 2rem;
  border-radius: 20px;
  background: ${({ theme, $isDark }) => $isDark 
    ? `${theme.colors.surface}40`
    : `${theme.colors.background}40`
  };
  max-width: 90%;
  width: 600px;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.25rem;
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const LogoContainer = styled(motion.div)`
  width: 150px;
  height: 150px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Logo = styled(motion.img)<{ $isDark: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: ${({ $isDark }) => !$isDark ? 'none' : 'brightness(100%)'};
  transform-origin: center;
`;

const logoVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.3,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8,
      delay: 0.2
    }
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const glowVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 0.5
  },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

export const HeroSection: React.FC = () => {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const { t } = useTranslation();
  const { reducedMotion } = useReducedMotion();

  return (
    <Section fullWidth id="home">
      <HeroBackground />
      <HeroContainer
        variants={!reducedMotion ? containerVariants : undefined}
        initial="hidden"
        animate="visible"
      >
        <Content $isDark={isDark}>
          <LogoContainer>
            <Logo 
              $isDark={isDark}
              src="/src/assets/images/Logo.png" 
              alt={t('brand.logo')}
              variants={!reducedMotion ? logoVariants : undefined}
              initial="hidden"
              animate="visible"
              whileHover={!reducedMotion ? { 
                scale: 1.05,
                rotate: [0, -5, 5, 0],
                transition: { 
                  scale: { duration: 0.2 },
                  rotate: { duration: 0.5, ease: "easeInOut" }
                }
              } : undefined}
            />
          </LogoContainer>
          
          <Title variants={!reducedMotion ? itemVariants : undefined}>
            {t('brand.name')}
          </Title>
          
          <Subtitle variants={!reducedMotion ? itemVariants : undefined}>
            {t('hero.title')}
          </Subtitle>
          
          <ButtonContainer variants={!reducedMotion ? itemVariants : undefined}>
            <Button 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('hero.cta.about')}
            </Button>
            <Button 
              variant="outline"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('hero.cta.projects')}
            </Button>
          </ButtonContainer>
        </Content>
      </HeroContainer>
    </Section>
  );
}; 