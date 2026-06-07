import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import { MdClose } from 'react-icons/md';
import { useTheme } from '@/context/ThemeContext';
import { useAnimation } from '@/context/AnimationContext';
import { isDarkTheme } from '@/utils/themeUtils';

// ── Reusable legal modal shell (Privacy Policy / Terms of Service) ─────────────
// Visual style mirrors the modal used in OrderSection for consistency.

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
}

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 1200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
`;

const Container = styled(motion.div)<{ $isDark: boolean }>`
  width: 100%;
  max-width: 780px;
  margin: auto;
  padding: 2.5rem;
  border-radius: 20px;
  background: ${({ theme, $isDark }) =>
    $isDark ? theme.colors.surface : theme.colors.background};
  border: 1px solid ${({ theme }) => `${theme.colors.primary}20`};
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
  position: relative;
  flex-shrink: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => `${theme.colors.primary}15`};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}30`};
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.75rem;
  padding-right: 2.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const Body = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  line-height: 1.65;

  h3 {
    font-size: 1.05rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    margin: 1.5rem 0 0.5rem 0;
  }

  p {
    margin: 0 0 0.75rem 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  ul, ol {
    margin: 0 0 0.75rem 0;
    padding-left: 1.25rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  li {
    margin-bottom: 0.35rem;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.2 } },
};

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  title,
  closeLabel,
  children,
}) => {
  const { themeMode } = useTheme();
  const { reducedMotion } = useAnimation();
  const isDark = useMemo(() => isDarkTheme(themeMode), [themeMode]);
  const titleId = React.useId();

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Backdrop
          key="legal-backdrop"
          variants={!reducedMotion ? backdropVariants : undefined}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <FocusTrap
            focusTrapOptions={{
              allowOutsideClick: true,
              escapeDeactivates: false,
              returnFocusOnDeactivate: true,
            }}
          >
            <Container
              $isDark={isDark}
              variants={!reducedMotion ? modalVariants : undefined}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <CloseButton onClick={onClose} aria-label={closeLabel} type="button">
                <MdClose aria-hidden="true" />
              </CloseButton>
              <Header>
                <Title id={titleId}>{title}</Title>
              </Header>
              <Body>{children}</Body>
            </Container>
          </FocusTrap>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};
