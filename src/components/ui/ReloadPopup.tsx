import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const PopupContent = styled(motion.div)<{ $isDark: boolean }>`
  background: ${({ theme, $isDark }) => 
    $isDark ? theme.colors.surface : theme.colors.background
  };
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
  border: 1px solid ${({ theme, $isDark }) =>
    $isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  };
`;

const Message = styled.p`
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const Timer = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

export const ReloadPopup: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(2);
  const { t } = useTranslation();
  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    const handleLanguageChange = () => {
      setShowPopup(true);
      setCountdown(2);
    };

    window.addEventListener('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    if (showPopup && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (showPopup && countdown === 0) {
      window.location.reload();
    }
  }, [showPopup, countdown]);

  return (
    <AnimatePresence>
      {showPopup && (
        <PopupOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <PopupContent
            $isDark={isDark}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <Message>
              {t('language.reloadMessage', 'Refreshing page to apply language changes...')}
            </Message>
            <Timer>{countdown}</Timer>
          </PopupContent>
        </PopupOverlay>
      )}
    </AnimatePresence>
  );
}; 