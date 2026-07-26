import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { useAnimation } from '@/context/hooks/useAnimation';

export type ToastType = 'success' | 'info' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const ToastContainer = styled(motion.div)<{ $type: ToastType }>`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  background: ${({ theme, $type }) => {
    if ($type === 'success') return theme.colors.success;
    if ($type === 'error') return theme.colors.error;
    return theme.colors.info;
  }};
  color: ${({ theme, $type }) => {
    if ($type === 'success') return theme.colors.onSuccess;
    if ($type === 'error') return theme.colors.onError;
    return theme.colors.onInfo;
  }};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1100;
  min-width: 200px;
  max-width: 90%;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const Message = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.45;
  border-radius: 0 0 0.5rem 0.5rem;
`;

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const { reducedMotion } = useAnimation();

  useEffect(() => {
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onClose]);

  const icon = type === 'success'
    ? <FiCheck aria-hidden="true" />
    : type === 'error'
      ? <FiAlertCircle aria-hidden="true" />
      : <FiInfo aria-hidden="true" />;

  return (
    <AnimatePresence>
      <ToastContainer
        $type={type}
        role={type === 'error' ? 'alert' : 'status'}
        aria-live={type === 'error' ? 'assertive' : 'polite'}
        initial={reducedMotion ? false : { opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? undefined : { opacity: 0, y: 20 }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', damping: 20 }}
      >
        <IconWrapper>{icon}</IconWrapper>
        <Message>{message}</Message>
        {!reducedMotion && (
          <ProgressBar
            aria-hidden="true"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />
        )}
      </ToastContainer>
    </AnimatePresence>
  );
};
