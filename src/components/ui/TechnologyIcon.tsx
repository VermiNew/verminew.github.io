import React, { useState, useMemo, memo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { isDarkTheme } from '@/utils/themeUtils';

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
  width: 120px;
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
    width: 100px;
  }
`;

const getLevelColor = (level: TechnologyIconProps['level'], theme: any): string => {
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
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  text-align: center;
`;

const Level = styled(motion.span)<{ $levelColor: string }>`
  font-size: 0.75rem;
  color: ${({ $levelColor }) => $levelColor};
  font-weight: 500;
  height: 1rem;
  display: flex;
  align-items: center;
`;



const Tooltip = styled(motion.div)<{ $isDark: boolean }>`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme, $isDark }) => $isDark 
    ? theme.colors.surface 
    : theme.colors.background
  };
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  padding: 0.75rem;
  border-radius: 8px;
  width: max-content;
  max-width: 250px;
  z-index: 10;
  box-shadow: ${({ theme }) => theme.shadows.large};
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  pointer-events: none;
  backdrop-filter: blur(8px);
`;

const containerVariants = {
  initial: { 
    scale: 0.8,
    opacity: 0,
    y: 20
  },
  animate: { 
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
  initial: { 
    rotate: -30,
    opacity: 0
  },
  animate: { 
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
  initial: { 
    opacity: 0,
    x: -20
  },
  animate: { 
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
    y: -10,
    scale: 0.9
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    scale: 0.9,
    transition: {
      duration: 0.2
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

  const levelColor = useMemo(() => getLevelColor(level, theme), [level, theme]);

  const levelFallbackMap: Record<TechnologyIconProps['level'], string> = {
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

  const levelText = useMemo(
    () => t(`about.skills.levels.${level}`, levelFallbackMap[level]),
    [level, t]
  );

  return (
    <Container
      $isDark={isDark}
      onHoverStart={() => setShowTooltip(true)}
      onHoverEnd={() => setShowTooltip(false)}
      variants={containerVariants}
      initial="initial"
      animate="animate"
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