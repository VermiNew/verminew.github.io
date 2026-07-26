import React from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  MdArrowBack,
  MdCheck,
  MdChevronRight,
  MdContentCopy,
  MdDownload,
  MdEmail,
} from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { socialConfig } from '@/config/social';
import {
  ActionGrid,
  BackRow,
  DownloadRow,
  IdBox,
  IdCopyHint,
  IdLabel,
  IdValue,
  ManualRow,
  ManualRowLabel,
  ManualRowValue,
  ManualSection,
  ManualTitle,
  SummaryNotice,
  SummarySubtitle,
  SummaryTitle,
} from './styles';

interface OrderSummaryProps {
  isDark: boolean;
  reducedMotion: boolean;
  copied: boolean;
  orderId: string;
  archiveFilename: string;
  archiveProgress: number;
  hasDownloadedArchive: boolean;
  isGeneratingArchive: boolean;
  manualOpen: boolean;
  headingRef: React.RefObject<HTMLHeadingElement>;
  onCopyId: () => void;
  onDownloadZip: () => void;
  onOpenMailClient: () => void;
  onToggleManual: () => void;
  onBack: () => void;
}

const MANUAL_SECTION_ID = 'order-email-instructions';

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  isDark,
  reducedMotion,
  copied,
  orderId,
  archiveFilename,
  archiveProgress,
  hasDownloadedArchive,
  isGeneratingArchive,
  manualOpen,
  headingRef,
  onCopyId,
  onDownloadZip,
  onOpenMailClient,
  onToggleManual,
  onBack,
}) => {
  const { t } = useTranslation();
  const filename = archiveFilename || `verminew-order-${orderId}.zip`;

  return (
    <>
      <SummaryTitle ref={headingRef} tabIndex={-1}>{t('order.summary.title')}</SummaryTitle>
      <SummarySubtitle>{t('order.summary.subtitle')}</SummarySubtitle>
      <SummaryNotice $complete={hasDownloadedArchive} role="status" aria-live="polite">
        {hasDownloadedArchive
          ? t('order.summary.packageDownloaded')
          : t('order.summary.notSent')}
      </SummaryNotice>

      <IdBox
        $isDark={isDark}
        $copied={copied}
        onClick={onCopyId}
        type="button"
        aria-label={t('order.summary.copyId', { id: orderId })}
      >
        <div>
          <IdLabel>{t('order.summary.idLabel')}</IdLabel>
          <IdValue>{orderId}</IdValue>
        </div>
        <IdCopyHint aria-hidden="true">
          {copied ? <MdCheck /> : <MdContentCopy />}
        </IdCopyHint>
      </IdBox>

      <DownloadRow>
        <Button
          size="large"
          onClick={onDownloadZip}
          disabled={isGeneratingArchive}
          aria-busy={isGeneratingArchive}
          style={{ width: '100%' }}
        >
          <MdDownload style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} aria-hidden="true" />
          {isGeneratingArchive
            ? t('order.summary.preparingZip', { progress: archiveProgress })
            : t('order.summary.downloadZip')}
        </Button>
      </DownloadRow>

      <ActionGrid>
        <Button size="medium" onClick={onOpenMailClient}>
          <MdEmail style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} aria-hidden="true" />
          {t('order.summary.sendEmail')}
        </Button>
        <Button
          size="medium"
          variant="outline"
          onClick={onToggleManual}
          aria-expanded={manualOpen}
          aria-controls={MANUAL_SECTION_ID}
        >
          {t('order.summary.manual')}
          <MdChevronRight
            aria-hidden="true"
            style={{
              marginLeft: '0.25rem',
              verticalAlign: 'middle',
              transform: manualOpen ? 'rotate(90deg)' : 'none',
              transition: reducedMotion ? 'none' : 'transform 0.2s',
            }}
          />
        </Button>
      </ActionGrid>

      <AnimatePresence initial={false}>
        {manualOpen && (
          <ManualSection
            id={MANUAL_SECTION_ID}
            $isDark={isDark}
            key="manual"
            initial={reducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reducedMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <ManualTitle>{t('order.summary.manualTitle')}</ManualTitle>
            <ManualRow>
              <ManualRowLabel>{t('order.summary.manualTo')}</ManualRowLabel>
              <ManualRowValue>{socialConfig.email.address}</ManualRowValue>
            </ManualRow>
            <ManualRow>
              <ManualRowLabel>{t('order.summary.manualSubject')}</ManualRowLabel>
              <ManualRowValue>{t('order.summary.mailSubject', { id: orderId })}</ManualRowValue>
            </ManualRow>
            <ManualRow>
              <ManualRowLabel>{t('order.summary.manualAttach')}</ManualRowLabel>
              <ManualRowValue>{filename}</ManualRowValue>
            </ManualRow>
          </ManualSection>
        )}
      </AnimatePresence>

      <BackRow>
        <Button size="medium" variant="outline" onClick={onBack}>
          <MdArrowBack style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} aria-hidden="true" />
          {t('order.summary.back')}
        </Button>
      </BackRow>
    </>
  );
};
