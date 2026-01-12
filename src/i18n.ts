import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationPL from './locales/pl/translation.json';

export const SUPPORTED_LANGUAGES = ['en', 'pl'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

const resources = {
  en: {
    translation: translationEN
  },
  pl: {
    translation: translationPL
  }
} as const;

export type TranslationKeys = keyof typeof translationEN;

const normalizeLanguage = (lang: string): SupportedLanguage => {
  // Usuń region z kodu języka (np. pl-PL -> pl)
  const baseLang = lang.split('-')[0].toLowerCase();
  return SUPPORTED_LANGUAGES.includes(baseLang as SupportedLanguage)
    ? (baseLang as SupportedLanguage)
    : 'en';
};

const savedLanguage = localStorage.getItem('i18nextLng');
const normalizedLanguage = savedLanguage ? normalizeLanguage(savedLanguage) : 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: normalizedLanguage,
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: true
    }
  });

export const changeLanguageWithReload = async (language: SupportedLanguage) => {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    console.error(`Unsupported language: ${language}`);
    return;
  }

  const normalizedLang = normalizeLanguage(language);
  await i18n.changeLanguage(normalizedLang);
  localStorage.setItem('i18nextLng', normalizedLang);
  // react-i18next automatically updates all connected components
};

export const getBrowserLanguage = (): SupportedLanguage => {
  const browserLang = navigator.language.toLowerCase();
  return normalizeLanguage(browserLang);
};

export const shouldShowLanguageNotification = (): boolean => {
  const browserLang = getBrowserLanguage();
  const currentLang = normalizeLanguage(i18n.language);
  const hasSeenNotification = localStorage.getItem('hasSeenLangNotification');
  
  return browserLang !== currentLang && !hasSeenNotification;
};

export default i18n; 