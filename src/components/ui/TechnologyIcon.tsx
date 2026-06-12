import React, { useState, useMemo, memo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ThemeProvider } from 'styled-components';
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



const Tooltip = styled(motion.div)<{ $isDark: boolean; $x: number; $y: number; $touch: boolean }>`
  position: fixed;
  top: ${({ $y }) => $y}px;
  left: ${({ $x }) => $x}px;
  translate: ${({ $touch }) => $touch ? '0 -50%' : '0 0'};
  background: ${({ theme, $isDark }) => $isDark
    ? theme.colors.surface
    : theme.colors.background
  };
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  padding: 0.75rem;
  border-radius: 8px;
  width: max-content;
  max-width: 220px;
  z-index: 9999;
  box-shadow: ${({ theme }) => theme.shadows.large};
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  pointer-events: none;
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
    rotate: 12,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
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
  },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.15,
      duration: 0.12,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.08
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
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  const handleHoverStart = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (isTouchDevice) {
        setTooltipPos({ x: rect.right + 8, y: rect.top + rect.height / 2 });
      } else {
        setTooltipPos({ x: rect.left + rect.width / 2, y: rect.bottom + 8 });
      }
    }
    setShowTooltip(true);
  }, [isTouchDevice]);

  const handleHoverEnd = useCallback(() => {
    setShowTooltip(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isTouchDevice) {
      setTooltipPos({ x: e.clientX + 12, y: e.clientY + 12 });
    }
  }, [isTouchDevice]);

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
      ref={containerRef}
      $isDark={isDark}
      onHoverStart={!isTouchDevice ? handleHoverStart : undefined}
      onHoverEnd={!isTouchDevice ? handleHoverEnd : undefined}
      onMouseMove={!isTouchDevice ? handleMouseMove : undefined}
      onClick={isTouchDevice ? () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setTooltipPos({ x: rect.right + 8, y: rect.top + rect.height / 2 });
        }
        setShowTooltip(prev => !prev);
      } : undefined}
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
        {showTooltip && createPortal(
          <ThemeProvider theme={theme}>
            <Tooltip
              $isDark={isDark}
              $x={tooltipPos.x}
              $y={tooltipPos.y}
              $touch={isTouchDevice}
              variants={tooltipVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {description}
            </Tooltip>
          </ThemeProvider>,
          document.body
        )}
      </AnimatePresence>
    </Container>
  );
};

export const TechnologyIcon = memo(TechnologyIconComponent); 