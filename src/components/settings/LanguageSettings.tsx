import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const blink = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0); }
`;

const LanguageButton = styled(motion.button)<{ $isActive: boolean; $isDark: boolean; $shouldBlink: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: ${({ $isActive, $isDark, theme }) => 
    $isActive 
      ? theme.colors.primary 
      : $isDark 
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.05)'
  };
  border: 1px solid ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary : 'transparent'
  };
  color: ${({ $isActive, theme }) => 
    $isActive ? '#fff' : theme.colors.text
  };
  cursor: pointer;
  width: 100%;
  transition: all ${({ theme }) => theme.transitions.default};
  font-weight: ${({ $isActive }) => ($isActive ? '600' : '400')};
  ${({ $shouldBlink }) => $shouldBlink && css`
    animation: ${blink} 1s ease-in-out 3;
  `}

  &:hover {
    background: ${({ $isActive, theme }) => 
      $isActive 
        ? theme.colors.primary 
        : `${theme.colors.primary}20`
    };
    transform: translateX(5px);
  }
`;

const CurrentLanguage = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

export const LanguageSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isDark = document.documentElement.classList.contains('dark');
  const [shouldBlink, setShouldBlink] = useState(false);

  useEffect(() => {
    // Start blinking animation
    setShouldBlink(true);
    
    // Stop blinking after 3 seconds
    const timer = setTimeout(() => {
      setShouldBlink(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLanguageChange = async (langCode: string) => {
    if (langCode !== i18n.language) {
      // Najpierw zmień język w i18n
      await i18n.changeLanguage(langCode);
      localStorage.setItem('i18nextLng', langCode);
      
      // Pokaż popup
      window.dispatchEvent(new Event('languageChanged'));
      
      // Poczekaj 3 sekundy i odśwież
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const getCurrentLanguage = () => {
    const lang = i18n.language.split('-')[0];
    return lang === 'pl' ? 'pl' : 'en';
  };

  const languages = [
    { code: 'en', name: t('language.settings.en') },
    { code: 'pl', name: t('language.settings.pl') }
  ];

  const currentLang = getCurrentLanguage();

  return (
    <Container>
      <Title>{t('language.settings.title')}</Title>
      <CurrentLanguage>
        {t('language.settings.current')}: {t(`language.settings.${currentLang}`)}
      </CurrentLanguage>
      {languages.map((lang) => (
        <LanguageButton
          key={lang.code}
          $isActive={currentLang === lang.code}
          $isDark={isDark}
          $shouldBlink={shouldBlink}
          onClick={() => handleLanguageChange(lang.code)}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          {lang.name}
        </LanguageButton>
      ))}
    </Container>
  );
}; 