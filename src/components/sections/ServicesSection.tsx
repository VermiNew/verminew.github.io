import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiMonitor, FiSmartphone } from 'react-icons/fi';
import { Section } from '../layout/Section';
import { SectionTitle } from '../ui/SectionTitle';
import { useAnimation } from '../../context/AnimationContext';
import { useTheme } from '../../context/ThemeContext';
import { isDarkTheme } from '../../utils/themeUtils';

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled(motion.div)<{ $isDark: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 1px solid ${({ $isDark }) => 
    $isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
  transition: transform ${({ theme }) => theme.transitions.default},
    box-shadow ${({ theme }) => theme.transitions.default};
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.primary}, 
      color-mix(in srgb, ${({ theme }) => theme.colors.primary} 60%, #000)
    );
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

const IconWrapper = styled.div<{ $isDark: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: ${({ theme, $isDark }) => 
    $isDark ? `${theme.colors.primary}20` : `${theme.colors.primary}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.8rem;
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ServiceDescription = styled.p`
  font-size: 1.05rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  flex-grow: 1;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
  margin-top: -1rem;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

export const ServicesSection: React.FC = () => {
  const { t } = useTranslation();
  const { reducedMotion } = useAnimation();
  const { themeMode } = useTheme();
  const isDark = useMemo(() => isDarkTheme(themeMode), [themeMode]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  const services = [
    {
      id: 'web',
      icon: <FiGlobe aria-hidden="true" />,
      title: t('services.items.web.title'),
      description: t('services.items.web.description')
    },
    {
      id: 'desktop',
      icon: <FiMonitor aria-hidden="true" />,
      title: t('services.items.desktop.title'),
      description: t('services.items.desktop.description')
    },
    {
      id: 'mobile',
      icon: <FiSmartphone aria-hidden="true" />,
      title: t('services.items.mobile.title'),
      description: t('services.items.mobile.description')
    }
  ];

  return (
    <Section id="services">
      <SectionTitle>
        {t('services.title')}
      </SectionTitle>
      <SectionSubtitle>
        {t('services.subtitle')}
      </SectionSubtitle>
      <motion.div
        variants={!reducedMotion ? containerVariants : undefined}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        <ServicesGrid>
          {services.map((service) => (
            <ServiceCard 
              key={service.id}
              $isDark={isDark}
              variants={!reducedMotion ? itemVariants : undefined}
              whileHover={!reducedMotion ? { y: -5 } : undefined}
            >
              <IconWrapper $isDark={isDark}>
                {service.icon}
              </IconWrapper>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </motion.div>
    </Section>
  );
};
