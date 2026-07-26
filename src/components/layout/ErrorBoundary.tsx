import React, { type ReactNode } from 'react';
import styled from 'styled-components';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import i18n from '@/i18n';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  section?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const ErrorContainer = styled.div`
  padding: 2rem;
  margin: 2rem 0;
  background: ${({ theme }) => `${theme.colors.error}16`};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: 0.75rem;
  text-align: center;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.error};
`;

const ErrorTitle = styled.h3`
  color: ${({ theme }) => theme.colors.error};
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  font-size: 0.95rem;
`;

const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font: inherit;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.onAccent};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 3px;
  }
`;

const ErrorDetails = styled.details`
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8rem;
  text-align: left;

  pre {
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }
`;

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(`Error in ${this.props.section ?? 'component'}:`, error, errorInfo);
  }

  private reset = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload();
      return;
    }

    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    const section = this.props.section
      ? i18n.t('errors.sectionMessage', { section: i18n.t(`navigation.${this.props.section}`, { defaultValue: this.props.section }) })
      : i18n.t('errors.contentMessage');

    return (
      <ErrorContainer role="alert" aria-live="assertive">
        <IconWrapper><FiAlertTriangle aria-hidden="true" /></IconWrapper>
        <ErrorTitle>{i18n.t('errors.title')}</ErrorTitle>
        <ErrorMessage>{section}</ErrorMessage>
        <RetryButton type="button" onClick={this.reset}>
          <FiRefreshCw aria-hidden="true" />
          {i18n.t('errors.retry')}
        </RetryButton>
        {import.meta.env.DEV && this.state.error && (
          <ErrorDetails>
            <summary>{i18n.t('errors.details')}</summary>
            <pre>{this.state.error.message}</pre>
          </ErrorDetails>
        )}
      </ErrorContainer>
    );
  }
}
