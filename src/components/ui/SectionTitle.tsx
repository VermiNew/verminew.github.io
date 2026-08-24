import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView, useAnimation as useAnimationControls, HTMLMotionProps } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useAnimation as useAnimationPreferences } from '@/context/AnimationContext';
import { isDarkTheme } from '@/utils/themeUtils';

interface SectionTitleProps extends HTMLMotionProps<'h2'> {
  children: React.ReactNode;
  className?: string;
}

const StyledTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;

const Cursor = styled(motion.span)`
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: ${({ theme }) => theme.colors.primary};
  margin-left: 2px;
  vertical-align: middle;
`;

export const SectionTitle = React.forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ children, className, ...props }, ref) => {
    const { themeMode } = useTheme();
    const { reducedMotion } = useAnimationPreferences();
    const isDark = isDarkTheme(themeMode);
    const internalRef = useRef(null);
    const resolvedRef = (ref || internalRef) as React.RefObject<HTMLHeadingElement>;
    const isInView = useInView(resolvedRef, { once: true });
    const controls = useAnimationControls();
    const cursorControls = useAnimationControls();

    useEffect(() => {
      if (!isInView || reducedMotion) return;

      void letterControls.start((index: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.04, duration: 0.18 },
      }));

      const textLength = typeof children === 'string' ? children.length : 0;
      const stopDelay = textLength * 50 + 1600;

      cursorControls.start({
        opacity: [1, 0],
        transition: { duration: 0.65, repeat: Infinity, repeatType: 'reverse' },
      });

      const timer = window.setTimeout(() => {
        cursorControls.stop();
        void cursorControls.start({ opacity: 0, transition: { duration: 0.2 } });
      }, text.length * 40 + 3_000);

      return () => clearTimeout(timer);
    }, [isInView, reducedMotion, controls, cursorControls, children]);

    return (
      <StyledTitle
        ref={resolvedRef}
        className={className}
        aria-label={text ?? undefined}
        {...props}
      >
        {text ? (
          <>
            {children.split('').map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                animate={reducedMotion ? { opacity: 1 } : controls}
                initial={{ opacity: reducedMotion ? 1 : 0 }}
              >
                {char}
              </motion.span>
            ))}
            {!reducedMotion && (
              <Cursor
                $isDark={isDark}
                animate={cursorControls}
                initial={{ opacity: 0 }}
              />
            )}
          </>
        ) : children}
      </StyledTitle>
    );
  },
);

SectionTitle.displayName = 'SectionTitle';

export const SectionTitleStyled = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;
