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
  const baseLang = lang.split('-')[0].toLowerCase();
  return SUPPORTED_LANGUAGES.includes(baseLang as SupportedLanguage)
    ? (baseLang as SupportedLanguage)
    : 'en';
};

const savedLanguage = localStorage.getItem('i18nextLng');
const initialLanguage = normalizeLanguage(savedLanguage ?? navigator.language);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: initialLanguage,
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

export const getBrowserLanguage = (): SupportedLanguage => {
  const browserLang = navigator.language.toLowerCase();
  return normalizeLanguage(browserLang);
};

export const shouldShowLanguageNotification = (): boolean => {
  const browserLang = getBrowserLanguage();
  const currentLang = normalizeLanguage(i18n.language);
  const hasLanguagePreference = localStorage.getItem('i18nextLng') !== null;
  const hasSeenNotification = localStorage.getItem('hasSeenLangNotification');

  return browserLang !== currentLang && !hasLanguagePreference && !hasSeenNotification;
};

export default i18n;
