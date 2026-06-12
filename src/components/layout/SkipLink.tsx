import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const SkipLinkElement = styled.a`
  position: fixed;
  top: -40px;
  left: 0;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background} !important;
  padding: 8px 16px;
  text-decoration: none;
  font-weight: 600;
  z-index: ${({ theme }) => theme.zIndices.modal + 1};
  border-radius: 0 0 4px 0;
  outline: none;

  &:focus {
    top: 0;
  }

  &:hover,
  &:visited,
  &:active {
    color: ${({ theme }) => theme.colors.background} !important;
  }
`;

export const SkipLink: React.FC = () => {
  const { t } = useTranslation();

  const focusMainContent = () => {
    requestAnimationFrame(() => {
      document.getElementById('main')?.focus({ preventScroll: true });
    });
  };

  return (
    <SkipLinkElement
      href="#main"
      onClick={focusMainContent}
    >
      {t('accessibility.skipToContent')}
    </SkipLinkElement>
  );
};
