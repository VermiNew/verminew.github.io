import styled from 'styled-components';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';

const SkipLinkElement = styled.a<{ $isDark: boolean }>`
  position: absolute;
  top: -40px;
  left: 0;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  padding: 8px 16px;
  text-decoration: none;
  z-index: 100;
  border-radius: 0 0 4px 0;

  &:focus {
    top: 0;
  }

  &:hover:focus {
    background: ${({ theme }) => theme.colors.primaryHover || theme.colors.primary};
  }
`;

export const SkipLink: React.FC = () => {
  const { themeMode } = useTheme();
  const { t } = useTranslation();
  const isDark = themeMode === 'dark';

  return (
    <SkipLinkElement
      href="#main"
      $isDark={isDark}
      role="complementary"
      aria-label={t('accessibility.skipContentLabel')}
    >
      {t('accessibility.skipToContent')}
    </SkipLinkElement>
  );
};
