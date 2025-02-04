import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeMode, Theme } from '@/types/theme';
import {
  lightTheme,
  darkTheme,
  corporateModernTheme,
  techMinimalTheme,
  professionalDarkTheme,
  modernNeutralTheme,
  eInkLightTheme,
  eInkDarkTheme,
  nordTheme,
  solarizedLightTheme,
  solarizedDarkTheme,
  winterTheme,
  springTheme,
  summerTheme,
  autumnTheme,
  pastelTheme,
} from '@/styles/themes';

interface ThemeContextType {
  themeMode: ThemeMode;
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getThemeByMode = (mode: ThemeMode): Theme => {
  switch (mode) {
    case 'light':
      return lightTheme;
    case 'dark':
      return darkTheme;
    case 'corporateModern':
      return corporateModernTheme;
    case 'techMinimal':
      return techMinimalTheme;
    case 'professionalDark':
      return professionalDarkTheme;
    case 'modernNeutral':
      return modernNeutralTheme;
    case 'eInkLight':
      return eInkLightTheme;
    case 'eInkDark':
      return eInkDarkTheme;
    case 'nord':
      return nordTheme;
    case 'solarizedLight':
      return solarizedLightTheme;
    case 'solarizedDark':
      return solarizedDarkTheme;
    case 'winter':
      return winterTheme;
    case 'spring':
      return springTheme;
    case 'summer':
      return summerTheme;
    case 'autumn':
      return autumnTheme;
    case 'pastel':
      return pastelTheme;
    default:
      return lightTheme;
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Sprawdź zapisany motyw
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme) return savedTheme;
    
    // Sprawdź preferencje systemowe
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const theme = getThemeByMode(themeMode);

  useEffect(() => {
    localStorage.setItem('theme', themeMode);
    // Aktualizuj klasę na body dla globalnych styli
    document.body.className = themeMode;
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, theme, setThemeMode }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 