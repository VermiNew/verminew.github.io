import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView, useAnimation, HTMLMotionProps } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface SectionTitleProps extends HTMLMotionProps<"h2"> {
  children: React.ReactNode;
  className?: string;
}

const StyledTitle = styled(motion.h2)<{ $isDark: boolean }>`
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

const Cursor = styled(motion.span)<{ $isDark: boolean }>`
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
    const isDark = themeMode === 'dark';
    const internalRef = useRef(null);
    const resolvedRef = (ref || internalRef) as React.RefObject<HTMLHeadingElement>;
    const isInView = useInView(resolvedRef, { once: true });
    const controls = useAnimation();
    const cursorControls = useAnimation();

    useEffect(() => {
      if (isInView) {
        controls.start({
          opacity: 1,
          transition: { duration: 0.5 }
        });

        controls.start(i => ({
          opacity: 1,
          transition: { delay: i * 0.05 }
        }));

        cursorControls.start({
          opacity: [1, 0],
          transition: {
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse"
          }
        });
      }
    }, [isInView, controls, cursorControls]);

    return (
      <StyledTitle
        ref={resolvedRef}
        className={className}
        $isDark={isDark}
        {...props}
      >
        {typeof children === 'string' ? (
          <>
            {children.split('').map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                animate={controls}
                initial={{ opacity: 0 }}
              >
                {char}
              </motion.span>
            ))}
            <Cursor 
              $isDark={isDark}
              animate={cursorControls} 
              initial={{ opacity: 0 }} 
            />
          </>
        ) : (
          children
        )}
      </StyledTitle>
    );
  }
);

SectionTitle.displayName = 'SectionTitle';

export const SectionTitleStyled = styled(motion.h2)<{ $isDark: boolean }>`
  font-size: 2.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
  text-align: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`; 