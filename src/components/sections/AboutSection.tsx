import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Section } from '../layout/Section';
import { SectionTitle } from '../ui/SectionTitle';
import { SiGithub, SiDiscord } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAnimation } from '../../context/AnimationContext';
import { getSocialUrl } from '../../config/social';

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageContainer = styled(motion.div)<{ $isDark: boolean }>`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  max-height: 400px;
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadows.medium};

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom right,
      ${({ theme, $isDark }) => $isDark 
        ? `${theme.colors.primary}60`
        : `${theme.colors.primary}40`},
      ${({ theme, $isDark }) => $isDark
        ? `${theme.colors.accent}60`
        : `${theme.colors.accent}40`}
    );
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Paragraph = styled(motion.p)`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
`;

const NameOrigin = styled(motion.div)`
  margin-top: 1rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: ${({ theme }) => `${theme.colors.surface}80`};
  backdrop-filter: blur(8px);
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
`;

const NameOriginTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  font-weight: 600;
`;

const BirthInfo = styled(motion.p)`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 1rem;
`;

const Profiles = styled(motion.div)`
  margin-top: 2rem;
`;

const ProfilesTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ProfilesList = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProfileLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: ${({ theme }) => `${theme.colors.surface}80`};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 0.9rem;
  transition: all ${({ theme }) => theme.transitions.default};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    transform: translateY(-2px);
    border-color: ${({ theme }) => `${theme.colors.primary}40`};
  }

  svg {
    font-size: 1.2rem;
  }
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

export const AboutSection: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useTheme();
  const { reducedMotion } = useAnimation();

  return (
    <Section id="about">
      <motion.div
        variants={!reducedMotion ? containerVariants : undefined}
        initial={!reducedMotion ? "hidden" : undefined}
        whileInView={!reducedMotion ? "visible" : undefined}
        viewport={{ once: true }}
      >
        <SectionTitle>{t('about.title')}</SectionTitle>
        <Content>
          <ImageContainer
            $isDark={themeMode === 'dark'}
            variants={!reducedMotion ? itemVariants : undefined}
          >
            <Image src="/assets/images/avatar.webp" alt="VermiNew" />
          </ImageContainer>

          <TextContent>
            <Description>
              <Paragraph variants={!reducedMotion ? itemVariants : undefined}>
                {t('about.intro')}
              </Paragraph>
              <Paragraph variants={!reducedMotion ? itemVariants : undefined}>
                {t('about.focus')}
              </Paragraph>

              <NameOrigin variants={!reducedMotion ? itemVariants : undefined}>
                <NameOriginTitle>
                  {t('about.nameOrigin.title')}
                </NameOriginTitle>
                <p>{t('about.nameOrigin.description')}</p>
              </NameOrigin>

              <BirthInfo variants={!reducedMotion ? itemVariants : undefined}>
                {t('about.birthInfo')}
              </BirthInfo>

              <Profiles variants={!reducedMotion ? itemVariants : undefined}>
                <ProfilesTitle>{t('about.profiles.title')}</ProfilesTitle>
                <ProfilesList>
                  <ProfileLink
                    href={getSocialUrl('github')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiGithub />
                    {t('about.profiles.github')}
                  </ProfileLink>
                  <ProfileLink
                    href={getSocialUrl('discord')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiDiscord />
                    {t('about.profiles.discord')}
                  </ProfileLink>
                  <ProfileLink
                    href={getSocialUrl('email')}
                  >
                    <MdEmail />
                    {t('about.profiles.email')}
                  </ProfileLink>
                </ProfilesList>
              </Profiles>
            </Description>
          </TextContent>
        </Content>
      </motion.div>
    </Section>
  );
};