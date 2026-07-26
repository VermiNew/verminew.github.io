import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView, type HTMLMotionProps } from 'framer-motion';
import { useAnimation as useAnimationSettings } from '@/context/hooks/useAnimation';

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
  ({ children, className, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLHeadingElement>(null);
    const resolvedRef = (forwardedRef ?? internalRef) as React.RefObject<HTMLHeadingElement>;
    const isInView = useInView(resolvedRef, { once: true });
    const letterControls = useAnimation();
    const cursorControls = useAnimation();
    const { reducedMotion } = useAnimationSettings();
    const text = typeof children === 'string' ? children : null;

    useEffect(() => {
      if (!isInView || reducedMotion || !text) return;

      void letterControls.start((index: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.04, duration: 0.18 },
      }));
      void cursorControls.start({
        opacity: [1, 0],
        transition: { duration: 0.65, repeat: Infinity, repeatType: 'reverse' },
      });

      const timer = window.setTimeout(() => {
        cursorControls.stop();
        void cursorControls.start({ opacity: 0, transition: { duration: 0.2 } });
      }, text.length * 40 + 3_000);

      return () => window.clearTimeout(timer);
    }, [cursorControls, isInView, letterControls, reducedMotion, text]);

    return (
      <StyledTitle
        ref={resolvedRef}
        className={className}
        aria-label={text ?? undefined}
        {...props}
      >
        {text ? (
          <>
            <span aria-hidden="true">
              {text.split('').map((character, index) => (
                <motion.span
                  key={`${character}-${index}`}
                  custom={index}
                  animate={reducedMotion ? undefined : letterControls}
                  initial={reducedMotion ? false : { opacity: 0, y: 4 }}
                >
                  {character}
                </motion.span>
              ))}
              {!reducedMotion && (
                <Cursor aria-hidden="true" animate={cursorControls} initial={{ opacity: 0 }} />
              )}
            </span>
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
