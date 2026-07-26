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

export const THEME_MODES: readonly ThemeMode[] = [
  'light',
  'dark',
  'corporateModern',
  'techMinimal',
  'professionalDark',
  'modernNeutral',
  'eInkLight',
  'eInkDark',
  'nord',
  'solarizedLight',
  'solarizedDark',
  'winter',
  'spring',
  'summer',
  'autumn',
  'pastel',
] as const;

export const isThemeMode = (value: unknown): value is ThemeMode =>
  typeof value === 'string' && THEME_MODES.includes(value as ThemeMode);

export const isDarkTheme = (themeMode: ThemeMode): boolean => {
  const darkThemes: ThemeMode[] = [
    'dark',
    'professionalDark',
    'eInkDark',
    'nord',
    'solarizedDark'
  ];
  return darkThemes.includes(themeMode);
};

export const getThemeByMode = (mode: ThemeMode): Theme => {
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
