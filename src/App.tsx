import React, { Suspense } from 'react';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { ThemeProvider as CustomThemeProvider, useTheme } from '@/context/ThemeContext';
import { AnimationProvider } from '@/context/AnimationContext';
import { ToastProvider } from '@/context/ToastContext';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { Header } from '@/components/layout/Header';
import Settings from '@/components/settings/Settings';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { SectionTransition } from '@/components/layout/SectionTransition';
import { AnimatePresence } from 'framer-motion';
import { ReloadPopup } from '@/components/ui/ReloadPopup';
import { LanguageNotification } from '@/components/ui/LanguageNotification';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <>
      <GlobalStyle theme={theme} />
      <Header />
      <AnimatePresence mode="wait">
        <main>
          <ErrorBoundary section="hero">
            <SectionTransition>
              <HeroSection />
            </SectionTransition>
          </ErrorBoundary>
          
          <ErrorBoundary section="about">
            <SectionTransition delay={0.2}>
              <AboutSection />
            </SectionTransition>
          </ErrorBoundary>
          
          <ErrorBoundary section="skills">
            <SectionTransition delay={0.3}>
              <SkillsSection />
            </SectionTransition>
          </ErrorBoundary>
          
          <ErrorBoundary section="projects">
            <SectionTransition delay={0.4}>
              <ProjectsSection />
            </SectionTransition>
          </ErrorBoundary>

          <ErrorBoundary section="contact">
            <SectionTransition delay={0.5}>
              <ContactSection />
            </SectionTransition>
          </ErrorBoundary>
        </main>
      </AnimatePresence>
      <Settings />
      <ReloadPopup />
      <LanguageNotification />
    </>
  );
};

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <AnimationProvider>
        <ToastProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <AppContent />
          </Suspense>
        </ToastProvider>
      </AnimationProvider>
    </CustomThemeProvider>
  );
};

export default App;
