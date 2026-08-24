import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { useAnimation } from '@/context/AnimationContext';

type ToastType = 'success' | 'info' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const ToastContainer = styled(motion.div)<{ $type: ToastType }>`
  position: fixed;
  bottom: 2rem;
  left: 1rem;
  right: 1rem;
  width: max-content;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  background: ${({ theme, $type }) => {
    switch ($type) {
      case 'success':
        return theme.colors.success || '#10B981';
      case 'error':
        return theme.colors.error || '#EF4444';
      default:
        return theme.colors.primary;
    }
  }};
  color: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  max-width: calc(100% - 2rem);
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    bottom: 5.5rem;
  }
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
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0 0 0.5rem 0.5rem;
`;

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  const { reducedMotion } = useAnimation();

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck />;
      case 'error':
        return <FiAlertCircle />;
      default:
        return <FiInfo />;
    }
  };

  return (
    <AnimatePresence>
      <ToastContainer
        $type={type}
        initial={reducedMotion ? false : { opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? undefined : { opacity: 0, y: 20 }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', damping: 20 }}
      >
        <IconWrapper>{getIcon()}</IconWrapper>
        <Message>{message}</Message>
        {!reducedMotion && (
          <ProgressBar
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />
        )}
      </ToastContainer>
    </AnimatePresence>
  );
};
