import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const StyledButton = styled(motion.button)<{
  $variant?: 'primary' | 'secondary' | 'outline';
  $size?: 'small' | 'medium' | 'large';
  $isDark?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  
  /* Size variants */
  padding: ${({ $size }) => {
    switch ($size) {
      case 'small': return '0.5rem 1rem';
      case 'large': return '1rem 2rem';
      default: return '0.75rem 1.5rem';
    }
  }};
  
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'small': return '0.875rem';
      case 'large': return '1.125rem';
      default: return '1rem';
    }
  }};

  /* Style variants */
  ${({ $variant, theme, $isDark }) => {
    switch ($variant) {
      case 'secondary':
        return `
          background: ${theme.colors.secondary};
          color: ${$isDark ? theme.colors.background : '#ffffff'};
          border: none;
          &:hover {
            background: ${theme.colors.accent};
            transform: translateY(-2px);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          &:hover {
            background: ${theme.colors.primary};
            color: ${$isDark ? theme.colors.background : '#ffffff'};
            transform: translateY(-2px);
          }
        `;
      default:
        return `
          background: ${theme.colors.primary};
          color: ${$isDark ? theme.colors.background : '#ffffff'};
          border: none;
          &:hover {
            background: ${theme.colors.accent};
            transform: translateY(-2px);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  ...props
}) => {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $isDark={isDark}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </StyledButton>
  );
}; 