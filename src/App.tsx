import React, { Suspense, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { ThemeProvider as CustomThemeProvider } from '@/context/ThemeContext';
import { AnimationProvider } from '@/context/AnimationContext';
import { AnimationContext } from '@/context/AnimationContextValue';
import { useTheme } from '@/context/hooks/useTheme';
import { ToastProvider } from '@/context/ToastContext';
import { SettingsProvider } from '@/context/SettingsContext';
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

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language.split('-')[0];
    document.documentElement.lang = lang;
  }, [i18n.language]);

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
      <Settings />
      <ReloadPopup />
      <LanguageNotification />
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
