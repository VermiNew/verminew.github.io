import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiSettings, FiX, FiXCircle } from 'react-icons/fi';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const NotificationOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

const NotificationContainer = styled(motion.div)<{ $isDark: boolean }>`
  background: ${({ theme, $isDark }) => 
    $isDark ? theme.colors.surface : theme.colors.background
  };
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.large};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  width: min(400px, 90%);
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: min(85%, 350px);
    padding: 1.25rem;
  }
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-right: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Message = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Tutorial = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => `${theme.colors.primary}10`};
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.primary};
`;

const PulsingIconWrapper = styled(IconWrapper)`
  animation: ${pulse} 2s infinite;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled(motion.button)<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ theme, $variant }) => 
    $variant === 'primary' ? theme.colors.primary : 'transparent'
  };
  color: ${({ theme, $variant }) => 
    $variant === 'primary' ? '#fff' : theme.colors.textSecondary
  };
  border: 1px solid ${({ theme, $variant }) => 
    $variant === 'primary' ? 'transparent' : theme.colors.textSecondary + '40'
  };

  &:hover {
    background: ${({ theme, $variant }) => 
      $variant === 'primary' 
        ? theme.colors.primary + 'dd'
        : theme.colors.textSecondary + '10'
    };
  }
`;

const highlight = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0); }
`;

const IUnderstandButton = styled(Button)`
  animation: ${highlight} 2s infinite;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const LanguageNotification: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    const showNotification = () => {
      const browserLang = navigator.language.toLowerCase().startsWith('pl');
      const isEnglish = i18n.language === 'en';
      const viewCount = parseInt(localStorage.getItem('langNotificationViews') || '0');
      const hasSeenNotification = localStorage.getItem('hasSeenLangNotification');

      if (browserLang && isEnglish && !hasSeenNotification && viewCount < 3) {
        setTimeout(() => {
          setIsVisible(true);
          localStorage.setItem('langNotificationViews', (viewCount + 1).toString());
        }, 2000);
      }
    };

    showNotification();
  }, [i18n.language]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDontShowAgain = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenLangNotification', 'true');
  };

  const handleIUnderstand = () => {
    // Symulacja kliknięcia przycisku ustawień
    const settingsButton = document.querySelector('[aria-label="Open Settings"]') as HTMLButtonElement;
    if (settingsButton) {
      settingsButton.click();
      // Daj czas na otwarcie menu
      setTimeout(() => {
        // Znajdź i kliknij zakładkę języka
        const languageTab = document.querySelector('[aria-label="Language"]') as HTMLButtonElement;
        if (languageTab) {
          languageTab.click();
        }
      }, 100);
    }
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <NotificationOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <NotificationContainer
            $isDark={isDark}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <Title>
              <span>🌍</span> {t('notifications.language.available')}
            </Title>
            <Message>
              {t('notifications.language.detected')}
            </Message>
            <Tutorial>
              <Step>
                <PulsingIconWrapper>
                  <FiSettings />
                </PulsingIconWrapper>
                <span>{t('notifications.language.settingsHint')}</span>
              </Step>
            </Tutorial>
            <ButtonsContainer>
              <Button onClick={handleDontShowAgain}>
                <FiXCircle />
                {t('notifications.language.dontShowAgain')}
              </Button>
              <IUnderstandButton 
                $variant="primary" 
                onClick={handleIUnderstand}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('notifications.language.understand')}
              </IUnderstandButton>
            </ButtonsContainer>
            <CloseButton
              onClick={handleClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX />
            </CloseButton>
          </NotificationContainer>
        </NotificationOverlay>
      )}
    </AnimatePresence>
  );
}; 