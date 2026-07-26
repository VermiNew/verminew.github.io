import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import { useTranslation } from 'react-i18next';
import { FiSettings, FiX, FiXCircle } from 'react-icons/fi';
import { useTheme } from '@/context/hooks/useTheme';
import { isDarkTheme } from '@/utils/themeUtils';
import { useSettings } from '@/context/hooks/useSettings';
import { useAnimation } from '@/context/hooks/useAnimation';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { safeStorage } from '@/utils/storage';

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
  background-color: ${({ theme }) => theme.colors.overlay};
  z-index: ${({ theme }) => theme.zIndices.modal + 200};
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

const PulsingIconWrapper = styled(IconWrapper)<{ $animate: boolean }>`
  animation: ${({ $animate }) => $animate ? pulse : 'none'} 2s infinite;
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
    $variant === 'primary' ? theme.colors.onPrimary : theme.colors.textSecondary
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

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`;

const highlight = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0); }
`;

const IUnderstandButton = styled(Button)<{ $animate: boolean }>`
  animation: ${({ $animate }) => $animate ? highlight : 'none'} 2s infinite;
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

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
    border-radius: 50%;
  }
`;

export const LanguageNotification: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const { themeMode } = useTheme();
  const isDark = isDarkTheme(themeMode);
  const { openSettings } = useSettings();
  const { reducedMotion } = useAnimation();
  useBodyScrollLock(isVisible);

  useEffect(() => {
    let timer: number | undefined;
    const showNotification = () => {
      const browserLang = navigator.language.toLowerCase().startsWith('pl');
      const isEnglish = i18n.language.toLowerCase().startsWith('en');
      const parsedViewCount = Number.parseInt(safeStorage.get('langNotificationViews') ?? '0', 10);
      const viewCount = Number.isFinite(parsedViewCount) ? parsedViewCount : 0;
      const hasSeenNotification = safeStorage.get('hasSeenLangNotification');

      if (browserLang && isEnglish && !hasSeenNotification && viewCount < 3) {
        timer = window.setTimeout(() => {
          setIsVisible(true);
          safeStorage.set('langNotificationViews', (viewCount + 1).toString());
        }, 2000);
      }
    };

    showNotification();
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [i18n.language]);

  useEffect(() => {
    if (!isVisible) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsVisible(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDontShowAgain = () => {
    setIsVisible(false);
    safeStorage.set('hasSeenLangNotification', 'true');
  };

  const handleIUnderstand = () => {
    // Open the settings panel on the language tab via React context
    openSettings('language');
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <NotificationOverlay
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          onClick={handleClose}
        >
          <FocusTrap focusTrapOptions={{ allowOutsideClick: true, returnFocusOnDeactivate: true, escapeDeactivates: false }}>
          <NotificationContainer
            $isDark={isDark}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lang-notification-title"
            initial={reducedMotion ? false : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reducedMotion ? undefined : { scale: 0.9, opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : { type: 'spring', damping: 20 }}
            onClick={(event) => event.stopPropagation()}
          >
            <Title id="lang-notification-title">
              <span aria-hidden="true">🌍</span> {t('notifications.language.available')}
            </Title>
            <Message>
              {t('notifications.language.detected')}
            </Message>
            <Tutorial>
              <Step>
                <PulsingIconWrapper $animate={!reducedMotion}>
                  <FiSettings aria-hidden="true" />
                </PulsingIconWrapper>
                <span>{t('notifications.language.settingsHint')}</span>
              </Step>
            </Tutorial>
            <ButtonsContainer>
              <Button onClick={handleDontShowAgain}>
                <FiXCircle aria-hidden="true" />
                {t('notifications.language.dontShowAgain')}
              </Button>
              <IUnderstandButton
                $animate={!reducedMotion}
                $variant="primary" 
                onClick={handleIUnderstand}
                whileHover={reducedMotion ? undefined : { scale: 1.05 }}
                whileTap={reducedMotion ? undefined : { scale: 0.95 }}
              >
                {t('notifications.language.understand')}
              </IUnderstandButton>
            </ButtonsContainer>
            <CloseButton
              type="button"
              aria-label={t('notifications.language.close')}
              onClick={handleClose}
              whileHover={reducedMotion ? undefined : { scale: 1.1 }}
              whileTap={reducedMotion ? undefined : { scale: 0.9 }}
            >
              <FiX aria-hidden="true" />
            </CloseButton>
          </NotificationContainer>
          </FocusTrap>
        </NotificationOverlay>
      )}
    </AnimatePresence>
  );
}; 