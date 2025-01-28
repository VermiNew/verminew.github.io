import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const ToggleButton = styled(motion.button)<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme, $isDark }) => $isDark 
    ? `${theme.colors.surface}80` 
    : `${theme.colors.background}80`
  };
  border: 1px solid ${({ theme, $isDark }) => $isDark
    ? `${theme.colors.primary}40`
    : `${theme.colors.primary}20`
  };
  color: ${({ theme, $isDark }) => $isDark
    ? theme.colors.primary
    : theme.colors.text
  };
  font-size: 1.2rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  backdrop-filter: blur(5px);

  &:hover {
    background: ${({ theme, $isDark }) => $isDark
      ? theme.colors.surface
      : theme.colors.background
    };
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${({ $isDark }) => $isDark
      ? '0 4px 8px rgba(0, 0, 0, 0.3)'
      : '0 4px 8px rgba(0, 0, 0, 0.1)'
    };
  }

  &:active {
    transform: translateY(0);
  }
`;

const iconVariants = {
  initial: { scale: 0.5, opacity: 0, rotate: -180 },
  animate: { scale: 1, opacity: 1, rotate: 0 },
  exit: { scale: 0.5, opacity: 0, rotate: 180 }
};

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const ThemeToggle: React.FC = () => {
  const { themeMode, toggleTheme } = useTheme();
  const isDark = themeMode === 'dark';

  return (
    <ToggleButton
      $isDark={isDark}
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        key={themeMode}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={iconVariants}
        transition={{ duration: 0.3 }}
      >
        <IconWrapper>
          {themeMode === 'light' ? <FiMoon /> : <FiSun />}
        </IconWrapper>
      </motion.div>
    </ToggleButton>
  );
}; 