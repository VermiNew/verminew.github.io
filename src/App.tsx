import React, { Suspense, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { ThemeProvider as CustomThemeProvider, useTheme } from '@/context/ThemeContext';
import { AnimationProvider, AnimationContext } from '@/context/AnimationContext';
import { ToastProvider } from '@/context/ToastContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider as CustomThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/context/hooks/useTheme';
import { ToastProvider } from '@/context/ToastContext';
import { DeferredSection } from '@/components/layout/DeferredSection';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { Header } from '@/components/layout/Header';
import Settings from '@/components/settings/Settings';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { OrderSection } from '@/components/sections/OrderSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { SectionTransition } from '@/components/layout/SectionTransition';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { ReloadPopup } from '@/components/ui/ReloadPopup';
import { LanguageNotification } from '@/components/ui/LanguageNotification';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SkipLink } from '@/components/layout/SkipLink';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipLink } from '@/components/layout/SkipLink';
import { HeroSection } from '@/components/sections/HeroSection';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import type { SupportedLanguage } from '@/i18n';

const AboutSection = lazy(() => import('@/components/sections/AboutSection').then((module) => ({ default: module.AboutSection })));
const ServicesSection = lazy(() => import('@/components/sections/ServicesSection').then((module) => ({ default: module.ServicesSection })));
const SkillsSection = lazy(() => import('@/components/sections/SkillsSection').then((module) => ({ default: module.SkillsSection })));
const ProjectsSection = lazy(() => import('@/components/sections/ProjectsSection').then((module) => ({ default: module.ProjectsSection })));
const OrderSection = lazy(() => import('@/components/sections/OrderSection').then((module) => ({ default: module.OrderSection })));
const FaqSection = lazy(() => import('@/components/sections/FaqSection').then((module) => ({ default: module.FaqSection })));
const ContactSection = lazy(() => import('@/components/sections/ContactSection').then((module) => ({ default: module.ContactSection })));
const Settings = lazy(() => import('@/components/settings/Settings'));
const LanguageNotification = lazy(() => import('@/components/ui/LanguageNotification').then((module) => ({ default: module.LanguageNotification })));

interface AppSectionProps {
  name: string;
  deferred?: boolean;
  children: React.ReactNode;
}

const AppSection: React.FC<AppSectionProps> = ({ name, deferred = true, children }) => {
  const content = (
    <ErrorBoundary section={name}>
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );

  return deferred ? <DeferredSection id={name}>{content}</DeferredSection> : content;
};

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const language: SupportedLanguage = i18n.language.split('-')[0] === 'pl' ? 'pl' : 'en';

  usePageMetadata(language, theme);

  useEffect(() => {
    if (!window.location.hash) return;

    const rawTargetId = window.location.hash.slice(1);
    let targetId = rawTargetId;
    try {
      targetId = decodeURIComponent(rawTargetId);
    } catch {
      // Keep the raw hash when it contains malformed escape sequences.
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <GlobalStyle theme={theme} />
      <SkipLink />
      <Header />
      <AnimatePresence mode="wait">
        <main id="main" tabIndex={-1}>
          <ErrorBoundary section="hero">
            <SectionTransition>
              <HeroSection />
            </SectionTransition>
          </ErrorBoundary>
          
          <ErrorBoundary section="about">
            <SectionTransition>
              <AboutSection />
            </SectionTransition>
          </ErrorBoundary>

          <ErrorBoundary section="projects">
            <SectionTransition>
              <ProjectsSection />
            </SectionTransition>
          </ErrorBoundary>

          <ErrorBoundary section="skills">
            <SectionTransition>
              <SkillsSection />
            </SectionTransition>
          </ErrorBoundary>

          <ErrorBoundary section="services">
            <SectionTransition>
              <ServicesSection />
            </SectionTransition>
          </ErrorBoundary>

          <ErrorBoundary section="order">
            <SectionTransition>
              <OrderSection />
            </SectionTransition>
          </ErrorBoundary>

          <ErrorBoundary section="faq">
            <SectionTransition>
              <FaqSection />
            </SectionTransition>
          </ErrorBoundary>

          <ErrorBoundary section="contact">
            <SectionTransition>
              <ContactSection />
            </SectionTransition>
          </ErrorBoundary>
        </main>
      </AnimatePresence>
      <Footer />
      <Suspense fallback={null}>
        <Settings />
        <LanguageNotification />
      </Suspense>
    </>
  );
};

const MotionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ctx = useContext(AnimationContext);
  return (
    <MotionConfig reducedMotion={ctx?.reducedMotion ? 'always' : 'never'}>
      {children}
    </MotionConfig>
  );
};

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <AnimationProvider>
        <MotionWrapper>
          <ToastProvider>
            <SettingsProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <AppContent />
              </Suspense>
            </SettingsProvider>
          </ToastProvider>
        </MotionWrapper>
      </AnimationProvider>
    </CustomThemeProvider>
  );
};

export default App;
