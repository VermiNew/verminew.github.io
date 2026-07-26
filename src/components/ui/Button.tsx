import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
}

const StyledButton = styled.button<{
  $variant: 'primary' | 'secondary' | 'outline';
  $size: 'small' | 'medium' | 'large';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

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

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'secondary':
        return `
          background: ${theme.colors.secondary};
          color: ${theme.colors.onSecondary};
          border: none;
          &:hover {
            background: ${theme.colors.accent};
            color: ${theme.colors.onAccent};
            transform: translateY(-2px);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.link};
          border: 2px solid ${theme.colors.primary};
          &:hover {
            background: ${theme.colors.primary};
            color: ${theme.colors.onPrimary};
            transform: translateY(-2px);
          }
        `;
      default:
        return `
          background: ${theme.colors.primary};
          color: ${theme.colors.onPrimary};
          border: none;
          &:hover {
            background: ${theme.colors.accent};
            color: ${theme.colors.onAccent};
            transform: translateY(-2px);
          }
        `;
    }
  }}

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    background: ${({ theme }) => `${theme.colors.textSecondary}30`};
    color: ${({ theme }) => theme.colors.textSecondary};
    border-color: ${({ theme }) => `${theme.colors.textSecondary}30`};
    transform: none;

    &:hover {
      background: ${({ theme }) => `${theme.colors.textSecondary}30`};
      color: ${({ theme }) => theme.colors.textSecondary};
      transform: none;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const MotionButton = motion.create(StyledButton);

export const Button = ({
  variant = 'primary',
  size = 'medium',
  children,
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) => (
  <MotionButton
    $variant={variant}
    $size={size}
    type={type}
    disabled={disabled}
    whileHover={disabled ? undefined : { scale: 1.05 }}
    whileTap={disabled ? undefined : { scale: 0.95 }}
    {...(props as Record<string, unknown>)}
  >
    {children}
  </MotionButton>
);
