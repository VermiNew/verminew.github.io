import { AnimatePresence } from 'framer-motion';
import { MdArrowBack, MdChevronRight, MdWarningAmber } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import {
  DeadlineWarning,
  Field,
  FieldError,
  FormNav,
  Label,
  Select,
  Textarea,
} from '@/features/order/styles';
import { OrderStepFrame } from './OrderStepFrame';
import type { BaseOrderStepProps, RenderOrderOptions } from './types';

const DEADLINE_ERROR_ID = 'order-deadline-error';
const DESCRIPTION_ERROR_ID = 'order-description-error';
const CONTENT_READY_ERROR_ID = 'order-content-ready-error';

interface OrderDetailsStepProps extends BaseOrderStepProps {
  deadlineMissing: boolean;
  descriptionMissing: boolean;
  contentReadyMissing: boolean;
  strictDeadline: boolean;
  renderOptions: RenderOrderOptions;
  onBack: () => void;
  onNext: () => void;
}

export const OrderDetailsStep = ({
  form,
  isDark,
  reducedMotion,
  direction,
  headingRef,
  onChange,
  deadlineMissing,
  descriptionMissing,
  contentReadyMissing,
  strictDeadline,
  renderOptions,
  onBack,
  onNext,
}: OrderDetailsStepProps) => {
  const { t } = useTranslation();

  return (
    <OrderStepFrame
      current={4}
      titleKey="order.form.stepDetails"
      direction={direction}
      reducedMotion={reducedMotion}
      headingRef={headingRef}
    >
      <Field>
        <Label htmlFor="order-deadline" $required>{t('order.form.deadline')}</Label>
        <Select
          $isDark={isDark}
          id="order-deadline"
          name="deadline"
          required
          aria-invalid={deadlineMissing || undefined}
          aria-describedby={deadlineMissing ? DEADLINE_ERROR_ID : undefined}
          value={form.deadline}
          onChange={onChange}
        >
          <option value="" disabled>{t('order.form.deadlinePlaceholder')}</option>
          {renderOptions('deadline', 'order.form.deadlineOptions')}
        </Select>
        {deadlineMissing && <FieldError id={DEADLINE_ERROR_ID}>{t('order.form.requiredField')}</FieldError>}
        <AnimatePresence>
          {strictDeadline && (
            <DeadlineWarning
              initial={reducedMotion ? false : { opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }}
              exit={reducedMotion ? undefined : { opacity: 0, height: 0, marginTop: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <MdWarningAmber aria-hidden="true" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{t('order.form.deadlineWarning')}</span>
            </DeadlineWarning>
          )}
        </AnimatePresence>
      </Field>

      <Field>
        <Label htmlFor="order-description" $required>{t('order.form.description')}</Label>
        <Textarea
          $isDark={isDark}
          id="order-description"
          name="description"
          required
          aria-invalid={descriptionMissing || undefined}
          aria-describedby={descriptionMissing ? DESCRIPTION_ERROR_ID : undefined}
          placeholder={t('order.form.descriptionPlaceholder')}
          value={form.description}
          onChange={onChange}
        />
        {descriptionMissing && <FieldError id={DESCRIPTION_ERROR_ID}>{t('order.form.requiredField')}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor="order-contentReady" $required>{t('order.form.contentReady')}</Label>
        <Select
          $isDark={isDark}
          id="order-contentReady"
          name="contentReady"
          required
          aria-invalid={contentReadyMissing || undefined}
          aria-describedby={contentReadyMissing ? CONTENT_READY_ERROR_ID : undefined}
          value={form.contentReady}
          onChange={onChange}
        >
          <option value="" disabled>{t('order.form.contentReadyPlaceholder')}</option>
          {renderOptions('contentReady', 'order.form.contentReadyOptions')}
        </Select>
        {contentReadyMissing && <FieldError id={CONTENT_READY_ERROR_ID}>{t('order.form.requiredField')}</FieldError>}
      </Field>

      <FormNav>
        <Button type="button" size="medium" variant="outline" onClick={onBack}>
          <MdArrowBack aria-hidden="true" style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
          {t('order.form.back')}
        </Button>
        <Button type="button" size="large" onClick={onNext}>
          {t('order.form.next')}
          <MdChevronRight aria-hidden="true" style={{ marginLeft: '0.25rem', verticalAlign: 'middle' }} />
        </Button>
      </FormNav>
    </OrderStepFrame>
  );
};
