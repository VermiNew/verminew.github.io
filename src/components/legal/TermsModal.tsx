import React from 'react';
import { useTranslation } from 'react-i18next';
import { LegalModal } from './LegalModal';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Section {
  title: string;
  paragraphs?: string[];
  list?: string[];
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const sections = t('terms.sections', { returnObjects: true }) as Section[];

  return (
    <LegalModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('terms.title')}
      closeLabel={t('terms.close')}
    >
      <p>
        <strong>{t('terms.lastUpdatedLabel')}:</strong> {t('terms.lastUpdated')}
      </p>
      <p>{t('terms.intro')}</p>

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
    </LegalModal>
  );
};
