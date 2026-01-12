import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { FiAlertTriangle } from 'react-icons/fi';

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
  background: ${({ theme }) => `${theme.colors.error}20`};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: 0.5rem;
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
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  font-size: 0.95rem;
`;

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.section || 'component'}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <ErrorContainer role="alert" aria-live="assertive">
            <IconWrapper>
              <FiAlertTriangle aria-hidden="true" />
            </IconWrapper>
            <ErrorTitle>Something went wrong</ErrorTitle>
            <ErrorMessage>
              {this.props.section
                ? `Failed to load ${this.props.section} section`
                : 'An error occurred while rendering this content'}
            </ErrorMessage>
          </ErrorContainer>
        )
      );
    }

    return this.props.children;
  }
}
