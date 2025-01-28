import React from 'react';
import styled from 'styled-components';
import { motion, Variants } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface TechnologyIconProps {
  name: string;
  icon: React.ReactNode;
  level: 'learning' | 'intermediate' | 'advanced';
  variants?: Variants;
  custom?: number;
}

const Container = styled(motion.div)<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 12px;
  background: ${({ theme, $isDark }) => $isDark 
    ? `${theme.colors.surface}80`
    : `${theme.colors.background}80`
  };
  border: 1px solid ${({ theme }) => `${theme.colors.primary}10`};
  transition: all ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  width: 100%;
  max-width: 140px;

  &:hover {
    transform: translateY(-5px);
    background: ${({ theme, $isDark }) => $isDark
      ? theme.colors.surface
      : theme.colors.background
    };
    border-color: ${({ theme }) => `${theme.colors.primary}30`};
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const IconWrapper = styled.div<{ level: TechnologyIconProps['level'] }>`
  font-size: 2rem;
  color: ${({ theme, level }) => {
    switch (level) {
      case 'learning':
        return theme.colors.accent;
      case 'intermediate':
        return theme.colors.primary;
      case 'advanced':
        return theme.colors.success;
      default:
        return theme.colors.text;
    }
  }};
`;

const Name = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  text-align: center;
`;

const Level = styled.span<{ level: TechnologyIconProps['level'] }>`
  font-size: 0.75rem;
  color: ${({ theme, level }) => {
    switch (level) {
      case 'learning':
        return theme.colors.accent;
      case 'intermediate':
        return theme.colors.primary;
      case 'advanced':
        return theme.colors.success;
      default:
        return theme.colors.text;
    }
  }};
  font-weight: 500;
`;

export const TechnologyIcon: React.FC<TechnologyIconProps> = ({ 
  name, 
  icon, 
  level,
  variants,
  custom
}) => {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const { t } = useTranslation();

  const getLevelText = (level: TechnologyIconProps['level']) => {
    return t(`about.skills.levels.${level}`, getLevelFallback(level));
  };

  const getLevelFallback = (level: TechnologyIconProps['level']) => {
    switch (level) {
      case 'learning':
        return 'Learning';
      case 'intermediate':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
        return '';
    }
  };

  return (
    <Container
      $isDark={isDark}
      variants={variants}
      custom={custom}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <IconWrapper level={level}>{icon}</IconWrapper>
      <Name>{name}</Name>
      <Level level={level}>{getLevelText(level)}</Level>
    </Container>
  );
}; 