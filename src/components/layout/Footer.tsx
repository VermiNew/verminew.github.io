import React from 'react';
import styled from 'styled-components';
import { MdEmail } from 'react-icons/md';
import { SiGithub } from 'react-icons/si';
import { socialConfig } from '@/config/social';
import { useTranslation } from 'react-i18next';

const CURRENT_YEAR = new Date().getFullYear();

const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1.5rem 2rem;
  text-align: center;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const Links = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const FooterLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }

  svg {
    font-size: 1rem;
    flex-shrink: 0;
  }
`;

const Meta = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.6;
  margin: 0;
`;

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FooterWrapper>
      <Inner>
        <Copyright>
          © {CURRENT_YEAR} Michał Oślizło / VermiNew
        </Copyright>
        <Links>
          <FooterLink href={socialConfig.email.url} aria-label={t('footer.sendEmail')}>
            <MdEmail aria-hidden="true" />
            {socialConfig.email.address}
          </FooterLink>
          <FooterLink
            href={socialConfig.github.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('footer.githubProfile')}
          >
            <SiGithub aria-hidden="true" />
            {socialConfig.github.username}
          </FooterLink>
        </Links>
        <Meta>v{__APP_VERSION__} · {CURRENT_YEAR}</Meta>
      </Inner>
    </FooterWrapper>
  );
};
