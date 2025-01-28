import React from 'react';
import styled from 'styled-components';

interface ContainerProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const StyledContainer = styled.div<{ $fullWidth?: boolean }>`
  width: 100%;
  max-width: ${props => props.$fullWidth ? '100%' : '1200px'};
  margin: 0 auto;
  padding: ${props => props.$fullWidth ? '0' : '0 1rem'};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${props => props.$fullWidth ? '0' : '0 1.5rem'};
  }
`;

export const Container: React.FC<ContainerProps> = ({ children, fullWidth = false }) => {
  return <StyledContainer $fullWidth={fullWidth}>{children}</StyledContainer>;
}; 