import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { SiGithub, SiDiscord } from 'react-icons/si';
import { MdEmail, MdLocationOn, MdSchedule } from 'react-icons/md';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useAnimation } from '@/context/AnimationContext';
import { socialConfig } from '@/config/social';

const ContactContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Description = styled(motion.p)<{ $isDark: boolean }>`
  text-align: center;
  font-size: 1.2rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 800px;
  margin: 0 auto;
  opacity: ${({ $isDark }) => $isDark ? 0.9 : 1};
`;

const ContactGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
`;

const ContactCard = styled(motion.a)<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 16px;
  background: ${({ theme, $isDark }) => $isDark 
    ? `${theme.colors.surface}80`
    : `${theme.colors.background}80`
  };
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.transitions.default};
  backdrop-filter: blur(5px);

  &:hover {
    transform: translateY(-5px);
    background: ${({ theme, $isDark }) => $isDark
      ? theme.colors.surface
      : theme.colors.background
    };
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ theme }) => `${theme.colors.primary}10`};
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContactTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const ContactValue = styled.p`
  font-size: 1rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AdditionalInfo = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  width: 100%;
  margin-top: 2rem;
`;

const InfoItem = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: ${({ theme, $isDark }) => $isDark 
    ? `${theme.colors.surface}40`
    : `${theme.colors.background}40`
  };
  border: 1px solid ${({ theme }) => `${theme.colors.primary}10`};

  svg {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const InfoText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
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

export const ContactSection: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const { reducedMotion } = useAnimation();

  const contacts = [
    {
      title: t('contact.github'),
      value: socialConfig.github.username,
      icon: <SiGithub />,
      link: socialConfig.github.url,
    },
    {
      title: t('contact.discord'),
      value: socialConfig.discord.username,
      icon: <SiDiscord />,
      link: socialConfig.discord.url,
    },
    {
      title: t('contact.email'),
      value: socialConfig.email.address,
      icon: <MdEmail />,
      link: `mailto:${socialConfig.email.address}`,
    },
  ];

  return (
    <SectionContainer id="contact">
      <SectionTitle>{t('sections.contact')}</SectionTitle>
      <ContactContainer
        variants={!reducedMotion ? containerVariants : undefined}
          initial="hidden"
          whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <Description 
          variants={!reducedMotion ? itemVariants : undefined}
          $isDark={isDark}
        >
          {t('contact.social.description')}
        </Description>
          
          <ContactGrid>
          {contacts.map((contact, index) => (
            <ContactCard 
              key={contact.title}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              $isDark={isDark}
              variants={!reducedMotion ? itemVariants : undefined}
              custom={index}
            >
              <IconWrapper>{contact.icon}</IconWrapper>
              <ContactInfo>
                <ContactTitle>{contact.title}</ContactTitle>
                <ContactValue>{contact.value}</ContactValue>
              </ContactInfo>
            </ContactCard>
          ))}
        </ContactGrid>

        <AdditionalInfo variants={!reducedMotion ? itemVariants : undefined}>
          <InfoItem $isDark={isDark}>
                  <MdLocationOn />
            <InfoText>{t('contact.info.location')}</InfoText>
                </InfoItem>
          <InfoItem $isDark={isDark}>
                  <MdSchedule />
            <InfoText>{t('contact.info.availability')}</InfoText>
                </InfoItem>
              </AdditionalInfo>
      </ContactContainer>
    </SectionContainer>
  );
}; 