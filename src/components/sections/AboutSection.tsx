import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Section } from '../layout/Section';
import { SectionTitle } from '../ui/SectionTitle';
import { CurrentlyLearning } from './CurrentlyLearning';
import { SiGithub, SiDiscord } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { TechnologyGrid } from './TechnologyGrid';
import { useTheme } from '../../context/ThemeContext';
import { useAnimation } from '../../context/AnimationContext';
import { socialConfig } from '../../config/social';

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

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  max-height: 400px;
  object-fit: cover;
`;

const TextContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Paragraph = styled(motion.p)<{ $isDark: boolean }>`
  font-size: 1.1rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  opacity: ${({ $isDark }) => $isDark ? 0.9 : 1};
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const SocialLink = styled(motion.a)<{ $isDark: boolean }>`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  transition: all ${({ theme }) => theme.transitions.default};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-2px);
  }

  span {
    font-size: 1rem;
    opacity: ${({ $isDark }) => $isDark ? 0.9 : 1};
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
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

const socialVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const PersonalInfo = styled(motion.div)<{ $isDark: boolean }>`
  margin-top: 2rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: ${({ $isDark }) => $isDark ? 0.85 : 1};
`;

const BirthInfo = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: ${({ $isDark }) => $isDark ? 0.85 : 1};
`;

const NameOriginBox = styled(motion.div)<{ $isDark: boolean }>`
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: ${({ theme, $isDark }) => $isDark 
    ? `${theme.colors.surface}40`
    : `${theme.colors.background}40`
  };
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
`;

const NameOriginTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const NameOriginDescription = styled.p<{ $isDark: boolean }>`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  opacity: ${({ $isDark }) => $isDark ? 0.9 : 1};
`;

export const AboutSection: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const { reducedMotion } = useAnimation();

  const profiles = [
    {
      title: t('about.profiles.github'),
      icon: <SiGithub />,
      link: socialConfig.github.url,
      username: socialConfig.github.username
    },
    {
      title: t('about.profiles.discord'),
      icon: <SiDiscord />,
      link: socialConfig.discord.url,
      username: socialConfig.discord.username
    },
    {
      title: t('about.profiles.email'),
      icon: <MdEmail />,
      link: `mailto:${socialConfig.email.address}`,
      username: socialConfig.email.address
    }
  ];

  return (
    <Section id="about">
      <Content>
        <ImageContainer
          $isDark={isDark}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={!reducedMotion ? itemVariants : undefined}
        >
          <ProfileImage src="/src/assets/images/ava.jpg" alt="Profile" />
        </ImageContainer>

        <TextContent
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={!reducedMotion ? containerVariants : undefined}
        >
          <SectionTitle>{t('about.title')}</SectionTitle>
          
          <Paragraph variants={!reducedMotion ? itemVariants : undefined} $isDark={isDark}>
            {t('about.intro')}
          </Paragraph>
          
          <Paragraph variants={!reducedMotion ? itemVariants : undefined} $isDark={isDark}>
            {t('about.focus')}
          </Paragraph>

          <NameOriginBox 
            variants={!reducedMotion ? itemVariants : undefined} 
            $isDark={isDark}
          >
            <NameOriginTitle>{t('about.nameOrigin.title')}</NameOriginTitle>
            <NameOriginDescription $isDark={isDark}>
              {t('about.nameOrigin.description')}
            </NameOriginDescription>
          </NameOriginBox>

          <SocialLinks variants={!reducedMotion ? containerVariants : undefined}>
            {profiles.map((profile, index) => (
              <SocialLink 
                key={profile.title}
                href={profile.link}
                target="_blank"
                rel="noopener noreferrer"
                custom={index}
                variants={socialVariants}
                $isDark={isDark}
              >
                {profile.icon}
                <span>{profile.title}</span>
              </SocialLink>
            ))}
          </SocialLinks>

          <PersonalInfo variants={!reducedMotion ? itemVariants : undefined} $isDark={isDark}>
            <BirthInfo $isDark={isDark}>{t('about.birthInfo')}</BirthInfo>
          </PersonalInfo>

          <CurrentlyLearning />
          <TechnologyGrid />
        </TextContent>
      </Content>
    </Section>
  );
};