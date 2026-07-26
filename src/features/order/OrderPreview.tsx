import { forwardRef } from 'react';
import type { Variants } from 'framer-motion';
import { MdEdit } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import {
  PreviewCard,
  PreviewCta,
  PreviewField,
  PreviewHint,
  PreviewInput,
  PreviewLabel,
  PreviewOverlay,
  PreviewRow,
  PreviewTextarea,
} from './styles';

interface OrderPreviewProps {
  isDark: boolean;
  reducedMotion: boolean;
  itemVariants: Variants;
  onOpen: () => void;
}

export const OrderPreview = forwardRef<HTMLButtonElement, OrderPreviewProps>(({
  isDark,
  reducedMotion,
  itemVariants,
  onOpen,
}, ref) => {
  const { t } = useTranslation();

  return (
    <PreviewCard
      ref={ref}
      type="button"
      $isDark={isDark}
      variants={reducedMotion ? undefined : itemVariants}
      onClick={onOpen}
      aria-label={t('order.preview.cta')}
    >
      <PreviewField>
        <PreviewLabel $w="30%" />
        <PreviewInput />
      </PreviewField>
      <PreviewRow>
        <PreviewField>
          <PreviewLabel $w="40%" />
          <PreviewInput />
        </PreviewField>
        <PreviewField>
          <PreviewLabel $w="35%" />
          <PreviewInput />
        </PreviewField>
      </PreviewRow>
      <PreviewField>
        <PreviewLabel $w="45%" />
        <PreviewInput />
      </PreviewField>
      <PreviewField>
        <PreviewLabel $w="50%" />
        <PreviewTextarea />
      </PreviewField>

      <PreviewOverlay data-overlay>
        <MdEdit size={32} aria-hidden="true" />
        <PreviewCta>{t('order.preview.cta')}</PreviewCta>
        <PreviewHint>{t('order.preview.hint')}</PreviewHint>
      </PreviewOverlay>
    </PreviewCard>
  );
});

OrderPreview.displayName = 'OrderPreview';
