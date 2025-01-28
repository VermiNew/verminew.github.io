export type ThemeMode = 'light' | 'dark';

export interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    error: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  transitions: {
    default: string;
    slow: string;
    fast: string;
  };
  zIndices: {
    header: number;
    modal: number;
    tooltip: number;
  };
} 