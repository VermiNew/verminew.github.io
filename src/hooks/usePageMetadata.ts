import { useEffect } from 'react';
import type { SupportedLanguage } from '@/i18n';
import type { Theme } from '@/types/theme';

const SITE_URL = 'https://verminew.github.io';
const SOCIAL_IMAGE = `${SITE_URL}/assets/images/social-card.png`;

const metadata: Record<SupportedLanguage, {
  title: string;
  description: string;
  locale: string;
  imageAlt: string;
}> = {
  en: {
    title: 'VermiNew — Developer Portfolio',
    description: 'Bilingual developer portfolio featuring web projects, programming skills, services and a project brief generator.',
    locale: 'en_US',
    imageAlt: 'VermiNew developer portfolio',
  },
  pl: {
    title: 'VermiNew — Portfolio programisty',
    description: 'Dwujęzyczne portfolio programisty: projekty webowe, umiejętności, usługi oraz generator briefu zlecenia.',
    locale: 'pl_PL',
    imageAlt: 'Portfolio programisty VermiNew',
  },
};

const setMeta = (selector: string, attribute: 'content', value: string): void => {
  const element = document.head.querySelector<HTMLMetaElement>(selector);
  if (element) element.setAttribute(attribute, value);
};

const setLink = (selector: string, href: string): void => {
  const element = document.head.querySelector<HTMLLinkElement>(selector);
  if (element) element.href = href;
};

export const usePageMetadata = (language: SupportedLanguage, theme: Theme): void => {
  useEffect(() => {
    const current = metadata[language];
    const localizedUrl = `${SITE_URL}/?lang=${language}`;

    document.documentElement.lang = language;
    document.title = current.title;

    setMeta('meta[name="description"]', 'content', current.description);
    setMeta('meta[name="theme-color"]', 'content', theme.colors.background);
    setMeta('meta[property="og:title"]', 'content', current.title);
    setMeta('meta[property="og:description"]', 'content', current.description);
    setMeta('meta[property="og:url"]', 'content', localizedUrl);
    setMeta('meta[property="og:locale"]', 'content', current.locale);
    setMeta('meta[property="og:image"]', 'content', SOCIAL_IMAGE);
    setMeta('meta[property="og:image:alt"]', 'content', current.imageAlt);
    setMeta('meta[name="twitter:title"]', 'content', current.title);
    setMeta('meta[name="twitter:description"]', 'content', current.description);
    setMeta('meta[name="twitter:image"]', 'content', SOCIAL_IMAGE);
    setMeta('meta[name="twitter:image:alt"]', 'content', current.imageAlt);
    setLink('link[rel="canonical"]', localizedUrl);

    const url = new URL(window.location.href);
    if (url.searchParams.get('lang') !== language) {
      url.searchParams.set('lang', language);
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }

    const structuredData = document.getElementById('structured-data');
    if (structuredData) {
      structuredData.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Michał Oślizło',
        alternateName: 'VermiNew',
        url: localizedUrl,
        sameAs: [
          'https://github.com/VermiNew',
          'https://www.linkedin.com/in/michał-oślizło-137879384/',
        ],
        jobTitle: language === 'pl' ? 'Programista frontend' : 'Frontend Developer',
        description: current.description,
        image: SOCIAL_IMAGE,
        inLanguage: language,
      });
    }
  }, [language, theme]);
};
