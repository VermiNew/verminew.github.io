import React from 'react';
import styled from 'styled-components';
import { motion, Variants } from 'framer-motion';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { useAnimation } from '@/context/hooks/useAnimation';
import { scrollToSection } from '@/utils/scroll';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { useTheme } from '@/context/hooks/useTheme';
import { isDarkTheme } from '@/utils/themeUtils';
import { useTranslation } from 'react-i18next';

const HeroContainer = styled(motion.div)`
  min-height: calc(100vh - 8rem);
  min-height: calc(100svh - 8rem);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  padding: 2rem 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: calc(100vh - 6rem);
    min-height: calc(100svh - 6rem);
  }
`;

const Content = styled(motion.div)<{ $isDark: boolean }>`
  z-index: 1;
  backdrop-filter: blur(5px);
  padding: 3rem;
  border-radius: 20px;
  background: ${({ theme, $isDark }) => $isDark 
    ? `${theme.colors.surface}40`
    : `${theme.colors.background}40`
  };
  max-width: 90%;
  width: 760px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 2rem 1.25rem;
    max-width: 94%;
  }
`;

const Eyebrow = styled(motion.p)`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  margin: 0 0 0.75rem;
  text-transform: uppercase;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.6rem, 7vw, 4.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  white-space: pre-line;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.05rem;
  }
`;

const Highlights = styled(motion.ul)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Highlight = styled.li`
  padding: 0.45rem 0.8rem;
  border: 1px solid ${({ theme }) => `${theme.colors.primary}30`};
  border-radius: 999px;
  background: ${({ theme }) => `${theme.colors.surface}80`};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
  font-weight: 600;
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
  width: 110px;
  height: 110px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Logo = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: ${({ theme }) => theme.logoFilter};
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

export const HeroSection: React.FC = () => {
  const { reducedMotion, smoothScroll } = useAnimation();
  const { themeMode } = useTheme();
  const isDark = isDarkTheme(themeMode);
  const { t } = useTranslation();
  const { reducedMotion, smoothScroll } = useReducedMotion();
  const scrollBehavior = reducedMotion || !smoothScroll ? 'auto' : 'smooth';
  const highlights = t('hero.highlights', { returnObjects: true }) as string[];

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
              src="/assets/images/Logo.webp" 
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
          
          <Eyebrow variants={!reducedMotion ? itemVariants : undefined}>
            {t('hero.eyebrow')}
          </Eyebrow>

          <Title variants={!reducedMotion ? itemVariants : undefined}>
            {t('hero.title')}
          </Title>
          
          <Subtitle variants={!reducedMotion ? itemVariants : undefined}>
            {t('hero.description')}
          </Subtitle>

          <Highlights variants={!reducedMotion ? itemVariants : undefined}>
            {highlights.map((highlight) => (
              <Highlight key={highlight}>{highlight}</Highlight>
            ))}
          </Highlights>
          
          <ButtonContainer variants={!reducedMotion ? itemVariants : undefined}>
            <Button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: scrollBehavior })}
            >
              {t('hero.cta.projects')}
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: scrollBehavior })}
            >
              {t('hero.cta.about')}
            </Button>
          </ButtonContainer>
        </Content>
      </HeroContainer>
    </Section>
  );
};
