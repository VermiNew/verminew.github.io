import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings, FiX, FiGlobe, FiZap } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { LanguageSettings } from '@/components/settings/LanguageSettings';
import { useTranslation } from 'react-i18next';
import { useAnimation } from '@/context/AnimationContext';

const SettingsButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: ${({ theme }) => theme.zIndices.modal - 1};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  opacity: 0.3;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: ${({ theme }) => theme.zIndices.modal - 1};
`;

const Panel = styled(motion.div)<{ $isDark: boolean }>`
  position: fixed;
  bottom: 5rem;
  right: 2rem;
  width: 300px;
  background: ${({ theme, $isDark }) => 
    $isDark ? theme.colors.surface : theme.colors.background
  };
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.large};
  z-index: ${({ theme }) => theme.zIndices.modal};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PanelTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  margin: 0;
`;

const CloseButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const panelVariants = {
  hidden: {
    opacity: 0,
    x: '120%',
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  },
  exit: {
    opacity: 0,
    x: '120%',
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  }
};

const PanelContent = styled.div`
  overflow: hidden;
  max-height: calc(100vh - 15rem);
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.25rem;
  background: ${({ theme }) => theme.colors.background}40;
  border-radius: 0.5rem;
`;

const Tab = styled(motion.button)<{ $isActive: boolean }>`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  background: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary : 'transparent'
  };
  color: ${({ theme, $isActive }) => 
    $isActive ? '#fff' : theme.colors.text
  };
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme, $isActive }) => 
      $isActive ? theme.colors.primary : theme.colors.primary + '20'
    };
  }
`;

const PreferencesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PreferenceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background}40;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background}60;
  }
`;

const PreferenceLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;
`;

const Switch = styled.input`
  appearance: none;
  width: 40px;
  height: 20px;
  background: ${({ theme }) => theme.colors.background}80;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;

  &:checked {
    background: ${({ theme }) => theme.colors.primary};
  }

  &::before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    background: white;
    transition: transform 0.2s ease;
  }

  &:checked::before {
    transform: translateX(20px);
  }
`;

type TabType = 'language' | 'preferences';

const Settings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('language');
  const { reducedMotion, setReducedMotion } = useAnimation();
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const buttonTimer = useRef<NodeJS.Timeout | null>(null);
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const { t } = useTranslation();

  const handleButtonVisibility = () => {
    setIsButtonVisible(true);
    if (buttonTimer.current) {
      clearTimeout(buttonTimer.current);
    }
    buttonTimer.current = setTimeout(() => {
      if (!isOpen) {
        setIsButtonVisible(false);
      }
    }, 3000);
  };

  useEffect(() => {
    setTimeout(() => {
      if (!isOpen) {
        setIsButtonVisible(false);
      }
    }, 5000);

    return () => {
      if (buttonTimer.current) {
        clearTimeout(buttonTimer.current);
      }
    };
  }, [isOpen]);

  const handleReducedMotionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReducedMotion(e.target.checked);
  };

  return (
    <>
      <SettingsButton
        onClick={() => setIsOpen(true)}
        onMouseEnter={handleButtonVisibility}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: 1, 
          rotate: 0,
          opacity: isButtonVisible ? 1 : 0.3
        }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 1
        }}
        whileHover={{ 
          scale: 1.1,
          rotate: 180,
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open Settings"
      >
        <FiSettings />
      </SettingsButton>

      <AnimatePresence>
        {isOpen && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <Panel
              $isDark={isDark}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <PanelHeader>
                <PanelTitle>{t('settings.title')}</PanelTitle>
                <CloseButton
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX />
                </CloseButton>
              </PanelHeader>

              <TabContainer>
                <Tab
                  $isActive={activeTab === 'language'}
                  onClick={() => setActiveTab('language')}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Language"
                >
                  <FiGlobe />
                  {t('settings.tabs.language')}
                </Tab>
                <Tab
                  $isActive={activeTab === 'preferences'}
                  onClick={() => setActiveTab('preferences')}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiZap />
                  {t('settings.tabs.preferences')}
                </Tab>
              </TabContainer>

              <PanelContent>
                <AnimatePresence mode="wait">
                  {activeTab === 'language' ? (
                    <motion.div
                      key="language"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LanguageSettings />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preferences"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PreferencesContainer>
                        <PreferenceItem>
                          <PreferenceLabel>
                            <FiZap />
                            {t('settings.preferences.reducedMotion')}
                          </PreferenceLabel>
                          <Switch
                            type="checkbox"
                            checked={reducedMotion}
                            onChange={handleReducedMotionChange}
                          />
                        </PreferenceItem>
                      </PreferencesContainer>
                    </motion.div>
                  )}
                </AnimatePresence>
              </PanelContent>
            </Panel>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Settings; 