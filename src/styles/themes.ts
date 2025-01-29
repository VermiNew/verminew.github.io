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
    success: '#10b981',
    error: '#ef4444',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.2)',
    medium: '0 4px 8px rgba(0,0,0,0.3)',
    large: '0 8px 16px rgba(0,0,0,0.4)',
  },
}; 