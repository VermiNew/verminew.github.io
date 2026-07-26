import React, { useCallback, useEffect, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import type { ThemeMode } from '@/types/theme';
import { getThemeByMode, isThemeMode } from '@/utils/themeUtils';
import { safeStorage } from '@/utils/storage';
import { ThemeContext } from './ThemeContextValue';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedTheme = safeStorage.get('theme');
  const [followsSystemTheme, setFollowsSystemTheme] = useState(() => !isThemeMode(savedTheme));
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (isThemeMode(savedTheme)) return savedTheme;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setFollowsSystemTheme(false);
    setThemeModeState(mode);
  }, []);

  const theme = getThemeByMode(themeMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mediaQuery || !followsSystemTheme) return;

    const applySystemTheme = (matches: boolean) => setThemeModeState(matches ? 'dark' : 'light');
    const handleChange = (event: MediaQueryListEvent) => applySystemTheme(event.matches);

    applySystemTheme(mediaQuery.matches);
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, [followsSystemTheme]);

  useEffect(() => {
    if (followsSystemTheme) safeStorage.remove('theme');
    else safeStorage.set('theme', themeMode);
    document.body.setAttribute('data-theme', themeMode);
  }, [followsSystemTheme, themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, theme, setThemeMode }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
