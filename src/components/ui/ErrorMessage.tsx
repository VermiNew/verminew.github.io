import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import { useAnimation } from '@/context/hooks/useAnimation';

interface ErrorMessageProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.error};
`;

const IconWrapper = styled.div`
  font-size: 2rem;
`;

const Message = styled.p`
  font-size: 1rem;
  max-width: 400px;
  line-height: 1.6;
`;

const ActionButton = styled.button`
  padding: 0.55rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: 999px;
  background: transparent;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  font: inherit;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => `${theme.colors.error}15`};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }
`;

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, actionLabel, onAction }) => {
  const { reducedMotion } = useAnimation();

  return (
    <Container
      role="alert"
      aria-live="assertive"
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.3 }}
    >
      <IconWrapper><FiAlertCircle aria-hidden="true" /></IconWrapper>
      <Message>{message}</Message>
      {actionLabel && onAction && (
        <ActionButton type="button" onClick={onAction}>{actionLabel}</ActionButton>
      )}
    </Container>
  );
};
