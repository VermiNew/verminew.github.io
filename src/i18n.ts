import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationPL from './locales/pl/translation.json';
import { safeStorage } from '@/utils/storage';

export const SUPPORTED_LANGUAGES = ['en', 'pl'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

const resources = {
  en: { translation: translationEN },
  pl: { translation: translationPL },
} as const;

export type TranslationKeys = keyof typeof translationEN;

const normalizeLanguage = (language: string | null | undefined): SupportedLanguage | null => {
  if (!language) return null;
  const baseLanguage = language.split('-')[0]?.toLowerCase();
  return SUPPORTED_LANGUAGES.includes(baseLanguage as SupportedLanguage)
    ? (baseLanguage as SupportedLanguage)
    : null;
};

const savedLanguage = localStorage.getItem('i18nextLng');
const initialLanguage = normalizeLanguage(savedLanguage ?? navigator.language);

  const queryLanguage = normalizeLanguage(new URLSearchParams(window.location.search).get('lang'));
  const storedLanguage = normalizeLanguage(safeStorage.get('i18nextLng'));
  const browserLanguage = normalizeLanguage(window.navigator.language);
  const documentLanguage = normalizeLanguage(document.documentElement.lang);

  return queryLanguage ?? storedLanguage ?? browserLanguage ?? documentLanguage ?? 'en';
};

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectInitialLanguage(),
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

i18n.on('languageChanged', (language) => {
  const normalizedLanguage = normalizeLanguage(language);
  if (normalizedLanguage) safeStorage.set('i18nextLng', normalizedLanguage);
});

export const getBrowserLanguage = (): SupportedLanguage =>
  normalizeLanguage(typeof navigator === 'undefined' ? null : navigator.language) ?? 'en';

export const shouldShowLanguageNotification = (): boolean => {
  const browserLang = getBrowserLanguage();
  const currentLang = normalizeLanguage(i18n.language);
  const hasLanguagePreference = localStorage.getItem('i18nextLng') !== null;
  const hasSeenNotification = localStorage.getItem('hasSeenLangNotification');

  return browserLang !== currentLang && !hasLanguagePreference && !hasSeenNotification;
};

export default i18n;
