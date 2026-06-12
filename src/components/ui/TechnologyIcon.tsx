import React, { useState, useMemo, memo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { isDarkTheme } from '@/utils/themeUtils';
import { Theme } from '@/types/theme';

interface TechnologyIconProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  level: 'learning' | 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master' | 'hobby' | 'professional' | 'planned';
}

const Container = styled(motion.div)<{ $isDark: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  border-radius: 12px;
  background: ${({ theme, $isDark }) => $isDark
    ? `${theme.colors.surface}80`
    : `${theme.colors.background}80`
  };
  border: 1px solid ${({ theme }) => `${theme.colors.primary}10`};
  transition: all ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  width: 110px;
  min-height: 110px;
  z-index: 1;

  &:hover {
    transform: translateY(-5px);
    background: ${({ theme, $isDark }) => $isDark
      ? theme.colors.surface
      : theme.colors.background
    };
    border-color: ${({ theme }) => `${theme.colors.primary}30`};
    box-shadow: ${({ theme }) => theme.shadows.medium};
    z-index: 2;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 95px;
    min-height: 95px;
  }
`;

const getLevelColor = (level: TechnologyIconProps['level'], theme: Theme): string => {
  const levelColorMap: Record<TechnologyIconProps['level'], string> = {
    'planned': theme.colors.textSecondary,
    'learning': theme.colors.accent,
    'beginner': theme.colors.warning,
    'intermediate': theme.colors.primary,
    'advanced': theme.colors.success,
    'expert': `${theme.colors.success}ee`,
    'master': theme.colors.special || '#FFD700',
    'hobby': theme.colors.info,
    'professional': theme.colors.professional || '#9370DB'
  };
  return levelColorMap[level] || theme.colors.text;
};

const IconWrapper = styled(motion.div)<{ $levelColor: string }>`
  font-size: 2rem;
  color: ${({ $levelColor }) => $levelColor};
`;

const Name = styled(motion.span)`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  min-height: 2.4em;
  display: flex;
  align-items: center;
  justify-content: center;
  word-break: break-word;
  hyphens: auto;
  width: 100%;
`;

const Level = styled(motion.span)<{ $levelColor: string }>`
  font-size: 0.7rem;
  color: ${({ $levelColor }) => $levelColor};
  font-weight: 500;
  min-height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.2;
  width: 100%;
`;



const Tooltip = styled(motion.div)<{ $isDark: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  translate: -50% 0;
  background: ${({ theme, $isDark }) => $isDark
    ? theme.colors.surface
    : theme.colors.background
  };
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  padding: 0.75rem;
  border-radius: 8px;
  width: max-content;
  max-width: 220px;
  z-index: 10;
  box-shadow: ${({ theme }) => theme.shadows.large};
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  pointer-events: none;
  transform-origin: top center;
`;

const containerVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    y: 20
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
      mass: 1
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.95
  }
};

const iconVariants = {
  hidden: {
    rotate: -30,
    opacity: 0
  },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  },
  hover: {
    rotate: [0, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

const textVariants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const tooltipVariants = {
  initial: {
    opacity: 0,
    y: -6,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.1
    }
  }
};

const TechnologyIconComponent: React.FC<TechnologyIconProps> = ({ 
  name, 
  description,
  icon, 
  level
}) => {
  const { themeMode, theme } = useTheme();
  const isDark = useMemo(() => isDarkTheme(themeMode), [themeMode]);
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  const isTouchDevice = 'ontouchstart' in window;

  const levelColor = useMemo(() => getLevelColor(level, theme), [level, theme]);

  const levelText = useMemo(() => {
    const fallbacks: Record<TechnologyIconProps['level'], string> = {
      'planned': 'Planned',
      'learning': 'Learning',
      'beginner': 'Beginner',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced',
      'expert': 'Expert',
      'master': 'Master',
      'hobby': 'Hobby',
      'professional': 'Professional'
    };
    return t(`about.skills.levels.${level}`, fallbacks[level]);
  }, [level, t]);

  return (
    <Container
      $isDark={isDark}
      onHoverStart={!isTouchDevice ? () => setShowTooltip(true) : undefined}
      onHoverEnd={!isTouchDevice ? () => setShowTooltip(false) : undefined}
      onClick={isTouchDevice ? () => setShowTooltip(prev => !prev) : undefined}
      variants={containerVariants}
      whileHover="hover"
      whileTap="tap"
    >
      <IconWrapper
        $levelColor={levelColor}
        variants={iconVariants}
      >
        {icon}
      </IconWrapper>
      <Name variants={textVariants}>{name}</Name>
      {level !== 'planned' && (
        <Level
          $levelColor={levelColor}
          variants={textVariants}
        >
          {levelText}
        </Level>
      )}
      <AnimatePresence>
        {showTooltip && (
          <Tooltip
            $isDark={isDark}
            variants={tooltipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {description}
          </Tooltip>
        )}
      </AnimatePresence>
    </Container>
  );
};

export const TechnologyIcon = memo(TechnologyIconComponent); 