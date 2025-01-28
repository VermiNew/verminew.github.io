import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { ThemeProvider as CustomThemeProvider, useTheme } from './context/ThemeContext';
import { AnimationProvider } from './context/AnimationContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/layout/Header';
import Settings from './components/settings/Settings';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ContactSection } from './components/sections/ContactSection';
import { SectionTransition } from './components/layout/SectionTransition';
import { AnimatePresence } from 'framer-motion';
import { ReloadPopup } from './components/ui/ReloadPopup';
import { LanguageNotification } from './components/ui/LanguageNotification';

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyle theme={theme} />
      <Header />
      <AnimatePresence mode="wait">
        <main>
          <SectionTransition>
            <HeroSection />
          </SectionTransition>
          
          <SectionTransition delay={0.2}>
            <AboutSection />
          </SectionTransition>
          
          <SectionTransition delay={0.3}>
            <SkillsSection />
          </SectionTransition>
          
          <SectionTransition delay={0.4}>
            <ProjectsSection />
          </SectionTransition>

          <SectionTransition delay={0.5}>
            <ContactSection />
          </SectionTransition>
        </main>
      </AnimatePresence>
      <Settings />
      <ReloadPopup />
      <LanguageNotification />
    </StyledThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <AnimationProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AnimationProvider>
    </CustomThemeProvider>
  );
};

export default App;
