import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Placeholder = styled.section`
  min-height: 40vh;
`;

interface DeferredSectionProps {
  children: React.ReactNode;
  id?: string;
  rootMargin?: string;
}

export const DeferredSection: React.FC<DeferredSectionProps> = ({
  children,
  id,
  rootMargin = '800px 0px',
}) => {
  const markerRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const marker = markerRef.current;
    if (!marker) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, [rootMargin, visible]);

  return visible ? <>{children}</> : <Placeholder id={id} ref={markerRef} aria-hidden="true" />;
};
