import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Section } from '../layout/Section';
import { SectionTitle } from '../ui/SectionTitle';
import { SiGithub, SiDiscord } from 'react-icons/si';
import { MdEmail, MdCake, MdSchool, MdTranslate, MdInterests, MdStars, MdTrendingUp, MdWork, MdLabel } from 'react-icons/md';
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
  width: 400px;
  height: 400px;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 1.4rem;
  }
`;

const BirthInfoSection = styled(motion.div)`
  margin-top: 1rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: ${({ theme }) => `${theme.colors.surface}80`};
  backdrop-filter: blur(8px);
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  display: flex;
  align-items: center;
  gap: 1rem;
  
  svg {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const BirthInfoText = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
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

const Background = styled(motion.div)`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const BackgroundSection = styled(motion.div)`
  padding: 1.5rem;
  border-radius: 16px;
  background: ${({ theme }) => `${theme.colors.surface}80`};
  backdrop-filter: blur(8px);
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
`;

const HighlightedSection = styled(BackgroundSection)`
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => `${theme.colors.surface}90`};
  box-shadow: 0 0 15px ${({ theme }) => `${theme.colors.primary}30`};
`;

const BackgroundTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    font-size: 1.4rem;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ListItem = styled.li`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "•";
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Name = styled(motion.h2)`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  font-weight: 600;
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
            <Image 
              src="/assets/images/avatar.webp" 
              alt={t('about.imageAlt')} 
              loading="lazy"
            />
          </ImageContainer>

          <TextContent>
            <Description>
              <Name variants={!reducedMotion ? itemVariants : undefined}>
                {t('about.name')}
              </Name>
              <Paragraph variants={!reducedMotion ? itemVariants : undefined}>
                {t('about.intro')}
              </Paragraph>
              <Paragraph variants={!reducedMotion ? itemVariants : undefined}>
                {t('about.focus')}
              </Paragraph>

              <NameOrigin variants={!reducedMotion ? itemVariants : undefined}>
                <NameOriginTitle>
                  <MdLabel />
                  {t('about.nameOrigin.title')}
                </NameOriginTitle>
                <p>{t('about.nameOrigin.description')}</p>
              </NameOrigin>

              <BirthInfoSection variants={!reducedMotion ? itemVariants : undefined}>
                <MdCake />
                <BirthInfoText>{t('about.birthInfo')}</BirthInfoText>
              </BirthInfoSection>

              <Background variants={!reducedMotion ? itemVariants : undefined}>
                <BackgroundSection>
                  <BackgroundTitle>
                    <MdSchool />
                    {t('about.background.education.title')}
                  </BackgroundTitle>
                  <List>
                    <ListItem>{t('about.background.education.current')}</ListItem>
                    <ListItem>{t('about.background.education.achievements')}</ListItem>
                  </List>
                </BackgroundSection>

                <BackgroundSection>
                  <BackgroundTitle>
                    <MdTranslate />
                    {t('about.background.languages.title')}
                  </BackgroundTitle>
                  <List>
                    <ListItem>{t('about.background.languages.native')}</ListItem>
                    <ListItem>{t('about.background.languages.english')}</ListItem>
                  </List>
                </BackgroundSection>

                <BackgroundSection>
                  <BackgroundTitle>
                    <MdInterests />
                    {t('about.background.interests.title')}
                  </BackgroundTitle>
                  <List>
                    {(t('about.background.interests.list', { returnObjects: true }) as string[])
                      .map((interest, index) => (
                        <ListItem key={index}>{String(interest)}</ListItem>
                      ))}
                  </List>
                </BackgroundSection>

                <BackgroundSection>
                  <BackgroundTitle>
                    <MdStars />
                    {t('about.background.strengths.title')}
                  </BackgroundTitle>
                  <p>{t('about.background.strengths.description')}</p>
                </BackgroundSection>

                <BackgroundSection>
                  <BackgroundTitle>
                    <MdTrendingUp />
                    {t('about.background.growth.title')}
                  </BackgroundTitle>
                  <p>{t('about.background.growth.description')}</p>
                </BackgroundSection>

                <HighlightedSection variants={!reducedMotion ? itemVariants : undefined}>
                  <BackgroundTitle>
                    <MdWork />
                    {t('about.background.availability.title')}
                  </BackgroundTitle>
                  <Paragraph>
                    {t('about.background.availability.description')}
                  </Paragraph>
                  
                  <List>
                    {(t('about.background.availability.workConditions', { returnObjects: true }) as string[])
                      .map((condition, index) => (
                        <ListItem key={index}>{condition}</ListItem>
                      ))}
                  </List>

                  <BackgroundTitle style={{ marginTop: '1.5rem' }}>
                    <MdWork />
                    {t('about.background.availability.freelance.title')}
                  </BackgroundTitle>
                  <Paragraph>
                    {t('about.background.availability.freelance.description')}
                  </Paragraph>
                  
                  <List>
                    {(t('about.background.availability.freelance.highlights', { returnObjects: true }) as string[])
                      .map((highlight, index) => (
                        <ListItem key={index}>{highlight}</ListItem>
                      ))}
                  </List>
                </HighlightedSection>
              </Background>

              <Profiles variants={!reducedMotion ? itemVariants : undefined}>
                <ProfilesTitle>{t('about.profiles.title')}</ProfilesTitle>
                <ProfilesList>
                  <ProfileLink
                    href={getSocialUrl('github')}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('about.profiles.github')} (opens in new tab)`}
                  >
                    <SiGithub aria-hidden="true" />
                    {t('about.profiles.github')}
                  </ProfileLink>
                  <ProfileLink
                    href={getSocialUrl('discord')}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('about.profiles.discord')} (opens in new tab)`}
                  >
                    <SiDiscord aria-hidden="true" />
                    {t('about.profiles.discord')}
                  </ProfileLink>
                  <ProfileLink
                    href={getSocialUrl('email')}
                    aria-label={t('about.profiles.email')}
                  >
                    <MdEmail aria-hidden="true" />
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