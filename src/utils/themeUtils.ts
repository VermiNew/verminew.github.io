import { ThemeMode } from '@/types/theme';

export const isDarkTheme = (themeMode: ThemeMode): boolean => {
  const darkThemes: ThemeMode[] = [
    'dark',
    'professionalDark',
    'eInkDark',
    'nord',
    'solarizedDark',
    'autumn'
  ];
  return darkThemes.includes(themeMode);
};
