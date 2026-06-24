import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.background};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SpinnerContainer
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={t('common.loading')}
    >
      <Spinner aria-hidden="true" />
    </SpinnerContainer>
  );
}; 