import React from 'react';
import { useTranslation } from 'react-i18next';
import { LegalModal } from './LegalModal';
import { socialConfig } from '@/config/social';
import { isRecord } from '@/utils/translationValues';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Section {
  title: string;
  paragraphs?: string[];
  list?: string[];
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const interpolation = { adminEmail: socialConfig.email.address };
  const rawSections = t('privacy.sections', { returnObjects: true, ...interpolation }) as unknown;
  const sections: Section[] = Array.isArray(rawSections)
    ? rawSections.flatMap((item) => {
        if (!isRecord(item) || typeof item.title !== 'string') return [];
        const paragraphs = Array.isArray(item.paragraphs)
          ? item.paragraphs.filter((value): value is string => typeof value === 'string')
          : undefined;
        const list = Array.isArray(item.list)
          ? item.list.filter((value): value is string => typeof value === 'string')
          : undefined;
        return [{ title: item.title, paragraphs, list }];
      })
    : [];

  return (
    <LegalModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('privacy.title')}
      closeLabel={t('privacy.close')}
    >
      <p>
        <strong>{t('privacy.lastUpdatedLabel')}:</strong> {t('privacy.lastUpdated')}
      </p>
      <p>{t('privacy.intro')}</p>

      {sections.map((section, idx) => (
        <React.Fragment key={idx}>
          <h3>
            {idx + 1}. {section.title}
          </h3>
          {section.paragraphs?.map((p, pi) => (
            <p key={pi}>{p}</p>
          ))}
          {section.list && (
            <ul>
              {section.list.map((item, li) => (
                <li key={li}>{item}</li>
              ))}
            </ul>
          )}
        </React.Fragment>
      ))}

      <p>
        {t('privacy.puodoNote')}{' '}
        <a href="https://uodo.gov.pl" target="_blank" rel="noopener noreferrer">
          uodo.gov.pl
        </a>
      </p>
    </LegalModal>
  );
};
