import { Theme } from '@/types/theme';

const baseTheme = {
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
  transitions: {
    default: '0.3s ease',
    slow: '0.5s ease',
    fast: '0.2s ease',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.1)',
    large: '0 8px 16px rgba(0,0,0,0.1)',
  },
  zIndices: {
    header: 100,
    modal: 1000,
    tooltip: 500,
  },
};

export const lightTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#ffffff',
    surface: '#f8f9fa',
    primary: '#2563eb',
    secondary: '#3b82f6',
    accent: '#8b5cf6',
    text: '#2c3e50',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    error: '#ef4444',
    warning: '#d97706',
    info: '#0284c7',
    special: '#ea580c',
    professional: '#7c3aed',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.05)',
    medium: '0 4px 8px rgba(0,0,0,0.1)',
    large: '0 8px 16px rgba(0,0,0,0.15)',
  },
};

export const darkTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#0a1929',
    surface: '#1a2736',
    primary: '#60a5fa',
    secondary: '#93c5fd',
    accent: '#8b5cf6',
    text: '#e2e8f0',
    textSecondary: '#94a3b8',
    border: '#2d3748',
    success: '#34d399',
    error: '#f87171',
    warning: '#fbbf24',
    info: '#38bdf8',
    special: '#fb923c',
    professional: '#a78bfa',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.2)',
    medium: '0 4px 8px rgba(0,0,0,0.3)',
    large: '0 8px 16px rgba(0,0,0,0.4)',
  },
};

export const corporateModernTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#ffffff',
    surface: '#f5f7fa',
    primary: '#2c5282',
    secondary: '#4a5568',
    accent: '#3182ce',
    text: '#1a202c',
    textSecondary: '#4a5568',
    border: '#e2e8f0',
    success: '#38a169',
    error: '#e53e3e',
    warning: '#c27803',
    info: '#2b6cb0',
    special: '#b7791f',
    professional: '#553c9a',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.04)',
    medium: '0 4px 8px rgba(0,0,0,0.08)',
    large: '0 8px 16px rgba(0,0,0,0.12)',
  },
};

export const techMinimalTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#ffffff',
    surface: '#fafafa',
    primary: '#4f46e5',
    secondary: '#6366f1',
    accent: '#818cf8',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    success: '#059669',
    error: '#dc2626',
    warning: '#d97706',
    info: '#0891b2',
    special: '#ea580c',
    professional: '#7c3aed',
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.05)',
    medium: '0 4px 6px rgba(0,0,0,0.07)',
    large: '0 10px 15px rgba(0,0,0,0.1)',
  },
};

export const professionalDarkTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#111827',
    surface: '#1f2937',
    primary: '#6366f1',
    secondary: '#818cf8',
    accent: '#a5b4fc',
    text: '#f3f4f6',
    textSecondary: '#9ca3af',
    border: '#374151',
    success: '#34d399',
    error: '#f87171',
    warning: '#fbbf24',
    info: '#22d3ee',
    special: '#fb923c',
    professional: '#c4b5fd',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.3)',
    medium: '0 4px 8px rgba(0,0,0,0.4)',
    large: '0 8px 16px rgba(0,0,0,0.5)',
  },
};

export const modernNeutralTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#fafaf9',
    surface: '#f5f5f4',
    primary: '#44403c',
    secondary: '#78716c',
    accent: '#a8a29e',
    text: '#292524',
    textSecondary: '#57534e',
    border: '#e7e5e4',
    success: '#3f6212',
    error: '#9f1239',
    warning: '#92400e',
    info: '#1e40af',
    special: '#78350f',
    professional: '#581c87',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.03)',
    medium: '0 4px 6px rgba(0,0,0,0.06)',
    large: '0 8px 12px rgba(0,0,0,0.09)',
  },
};

export const eInkLightTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#f8f9fa',
    surface: '#f1f3f5',
    primary: '#212529',
    secondary: '#495057',
    accent: '#343a40',
    text: '#212529',
    textSecondary: '#495057',
    border: '#dee2e6',
    success: '#2b2b2b',
    error: '#4a4a4a',
    warning: '#5a5a5a',
    info: '#6a6a6a',
    special: '#3a3a3a',
    professional: '#505050',
  },
  shadows: {
    small: '0 1px 2px rgba(0,0,0,0.02)',
    medium: '0 2px 4px rgba(0,0,0,0.03)',
    large: '0 3px 6px rgba(0,0,0,0.04)',
  },
  transitions: {
    default: '0.15s ease',
    slow: '0.25s ease',
    fast: '0.1s ease',
  },
};

export const eInkDarkTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#121212',
    surface: '#1e1e1e',
    primary: '#e0e0e0',
    secondary: '#b0b0b0',
    accent: '#c0c0c0',
    text: '#f0f0f0',
    textSecondary: '#d0d0d0',
    border: '#404040',
    success: '#c8c8c8',
    error: '#a0a0a0',
    warning: '#b8b8b8',
    info: '#909090',
    special: '#d8d8d8',
    professional: '#a8a8a8',
  },
  shadows: {
    small: '0 1px 2px rgba(255,255,255,0.05)',
    medium: '0 2px 4px rgba(255,255,255,0.08)',
    large: '0 3px 6px rgba(255,255,255,0.1)',
  },
  transitions: {
    default: '0.15s ease',
    slow: '0.25s ease',
    fast: '0.1s ease',
  },
};

export const nordTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#2E3440',
    surface: '#3B4252',
    primary: '#88C0D0',
    secondary: '#81A1C1',
    accent: '#5E81AC',
    text: '#ECEFF4',
    textSecondary: '#E5E9F0',
    border: '#4C566A',
    success: '#A3BE8C',
    error: '#BF616A',
    warning: '#EBCB8B',
    info: '#81A1C1',
    special: '#D08770',
    professional: '#B48EAD',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.3)',
    medium: '0 4px 8px rgba(0,0,0,0.4)',
    large: '0 8px 16px rgba(0,0,0,0.5)',
  },
};

export const solarizedLightTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#FDF6E3',
    surface: '#EEE8D5',
    primary: '#268BD2',
    secondary: '#2AA198',
    accent: '#6C71C4',
    text: '#073642',
    textSecondary: '#586E75',
    border: '#93A1A1',
    success: '#859900',
    error: '#DC322F',
    warning: '#B58900',
    info: '#268BD2',
    special: '#CB4B16',
    professional: '#6C71C4',
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.1)',
    medium: '0 3px 6px rgba(0,0,0,0.15)',
    large: '0 6px 12px rgba(0,0,0,0.2)',
  },
};

export const solarizedDarkTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#002B36',
    surface: '#073642',
    primary: '#839496',
    secondary: '#93A1A1',
    accent: '#6C71C4',
    text: '#FDF6E3',
    textSecondary: '#EEE8D5',
    border: '#586E75',
    success: '#859900',
    error: '#DC322F',
    warning: '#B58900',
    info: '#268BD2',
    special: '#CB4B16',
    professional: '#6C71C4',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.3)',
    medium: '0 4px 8px rgba(0,0,0,0.4)',
    large: '0 8px 16px rgba(0,0,0,0.5)',
  },
};

export const winterTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#f0f8ff',
    surface: '#e6f3ff',
    primary: '#2c5282',
    secondary: '#2b6cb0',
    accent: '#3182ce',
    text: '#1a365d',
    textSecondary: '#2a4365',
    border: '#bee3f8',
    success: '#2f855a',
    error: '#c53030',
    warning: '#805ad5',
    info: '#2b6cb0',
    special: '#4c51bf',
    professional: '#553c9a',
  },
  shadows: {
    small: '0 2px 4px rgba(44,82,130,0.1)',
    medium: '0 4px 8px rgba(44,82,130,0.15)',
    large: '0 8px 16px rgba(44,82,130,0.2)',
  },
};

export const springTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#f8fff8',
    surface: '#f0fff0',
    primary: '#2f855a',
    secondary: '#38a169',
    accent: '#48bb78',
    text: '#1c4532',
    textSecondary: '#276749',
    border: '#c6f6d5',
    success: '#2f855a',
    error: '#c53030',
    warning: '#d69e2e',
    info: '#319795',
    special: '#dd6b20',
    professional: '#805ad5',
  },
  shadows: {
    small: '0 2px 4px rgba(47,133,90,0.1)',
    medium: '0 4px 8px rgba(47,133,90,0.15)',
    large: '0 8px 16px rgba(47,133,90,0.2)',
  },
};

export const summerTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#fffaf0',
    surface: '#fff5eb',
    primary: '#c05621',
    secondary: '#dd6b20',
    accent: '#ed8936',
    text: '#7b341e',
    textSecondary: '#9c4221',
    border: '#feebc8',
    success: '#2f855a',
    error: '#c53030',
    warning: '#b7791f',
    info: '#2b6cb0',
    special: '#e53e3e',
    professional: '#6b46c1',
  },
  shadows: {
    small: '0 2px 4px rgba(192,86,33,0.1)',
    medium: '0 4px 8px rgba(192,86,33,0.15)',
    large: '0 8px 16px rgba(192,86,33,0.2)',
  },
};

export const autumnTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#fdf5e6',
    surface: '#fff5eb',
    primary: '#9c4221',
    secondary: '#c05621',
    accent: '#dd6b20',
    text: '#7b341e',
    textSecondary: '#9c4221',
    border: '#fbd38d',
    success: '#2f855a',
    error: '#c53030',
    warning: '#975a16',
    info: '#2c5282',
    special: '#c05621',
    professional: '#744210',
  },
  shadows: {
    small: '0 2px 4px rgba(156,66,33,0.1)',
    medium: '0 4px 8px rgba(156,66,33,0.15)',
    large: '0 8px 16px rgba(156,66,33,0.2)',
  },
};

export const pastelTheme: Theme = {
  ...baseTheme,
  colors: {
    background: '#fef6ff',
    surface: '#fdf2ff',
    primary: '#805ad5',
    secondary: '#6b46c1',
    accent: '#9f7aea',
    text: '#44337a',
    textSecondary: '#553c9a',
    border: '#e9d8fd',
    success: '#68d391',
    error: '#fc8181',
    warning: '#f6ad55',
    info: '#63b3ed',
    special: '#f687b3',
    professional: '#b794f4',
  },
  shadows: {
    small: '0 2px 4px rgba(128,90,213,0.1)',
    medium: '0 4px 8px rgba(128,90,213,0.15)',
    large: '0 8px 16px rgba(128,90,213,0.2)',
  },
};
