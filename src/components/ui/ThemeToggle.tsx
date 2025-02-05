import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMonitor, FiBook, FiCloud, FiDroplet, FiWind, FiSunrise } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { ThemeMode } from '@/types/theme';

const ThemeContainer = styled.div`
  position: relative;
  display: inline-block;
`;

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

const ThemeMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  padding: 8px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.large};
  z-index: 1000;
  min-width: 200px;
`;

const ThemeOption = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary + '20' : 'transparent'
  };
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : theme.colors.text
  };
  cursor: pointer;
  border-radius: 4px;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme, $isActive }) => 
      $isActive ? theme.colors.primary + '30' : theme.colors.primary + '10'
    };
    color: ${({ theme }) => theme.colors.primary};
    transform: translateX(4px);
  }

  svg {
    margin-right: 8px;
  }
`;

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

const iconVariants = {
  initial: { scale: 0.5, opacity: 0, rotate: -180 },
  animate: { scale: 1, opacity: 1, rotate: 0 },
  exit: { scale: 0.5, opacity: 0, rotate: 180 }
};

const menuVariants = {
  hidden: { 
    opacity: 0,
    y: -15,
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeOut'
    }
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      duration: 0.2
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
      ease: 'easeIn'
    }
  }
};

const getThemeIcon = (mode: ThemeMode) => {
  switch (mode) {
    case 'light':
      return <FiSun />;
    case 'dark':
      return <FiMoon />;
    case 'corporateModern':
    case 'techMinimal':
      return <FiMonitor />;
    case 'eInkLight':
    case 'eInkDark':
      return <FiBook />;
    case 'nord':
      return <FiCloud />;
    case 'solarizedLight':
    case 'solarizedDark':
      return <FiSun />;
    case 'winter':
      return <FiCloud />;
    case 'spring':
      return <FiDroplet />;
    case 'summer':
      return <FiSun />;
    case 'autumn':
      return <FiWind />;
    case 'pastel':
      return <FiSunrise />;
    default:
      return <FiSun />;
  }
};

const getThemeName = (mode: ThemeMode): string => {
  switch (mode) {
    case 'light':
      return 'Light';
    case 'dark':
      return 'Dark';
    case 'corporateModern':
      return 'Corporate Modern';
    case 'techMinimal':
      return 'Tech Minimal';
    case 'professionalDark':
      return 'Professional Dark';
    case 'modernNeutral':
      return 'Modern Neutral';
    case 'eInkLight':
      return 'E-Ink Light';
    case 'eInkDark':
      return 'E-Ink Dark';
    case 'nord':
      return 'Nord';
    case 'solarizedLight':
      return 'Solarized Light';
    case 'solarizedDark':
      return 'Solarized Dark';
    case 'winter':
      return 'Winter';
    case 'spring':
      return 'Spring';
    case 'summer':
      return 'Summer';
    case 'autumn':
      return 'Autumn';
    case 'pastel':
      return 'Pastel';
    default:
      return 'Light';
  }
};

export const ThemeToggle: React.FC = () => {
  const { themeMode, setThemeMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDark = themeMode.includes('dark');

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
    setIsMenuOpen(false);
  };

  const themeOptions: ThemeMode[] = [
    'light',
    'dark',
    'corporateModern',
    'techMinimal',
    'professionalDark',
    'modernNeutral',
    'eInkLight',
    'eInkDark',
    'nord',
    'solarizedLight',
    'solarizedDark',
    'winter',
    'spring',
    'summer',
    'autumn',
    'pastel',
  ];

  return (
    <ThemeContainer ref={containerRef}>
      <ToggleButton
        $isDark={isDark}
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen(!isMenuOpen);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle theme menu"
        aria-expanded={isMenuOpen}
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
            {getThemeIcon(themeMode)}
          </IconWrapper>
        </motion.div>
      </ToggleButton>

      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <ThemeMenu
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
          >
            {themeOptions.map((mode, index) => (
              <ThemeOption
                key={mode}
                $isActive={mode === themeMode}
                onClick={(e) => {
                  e.stopPropagation();
                  handleThemeChange(mode);
                }}
                as={motion.button}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { 
                    delay: index * 0.02,
                    duration: 0.15
                  }
                }}
                exit={{ 
                  opacity: 0,
                  x: -10,
                  transition: { 
                    duration: 0.1,
                    delay: index * 0.01
                  }
                }}
              >
                {getThemeIcon(mode)}
                {getThemeName(mode)}
              </ThemeOption>
            ))}
          </ThemeMenu>
        )}
      </AnimatePresence>
    </ThemeContainer>
  );
}; 