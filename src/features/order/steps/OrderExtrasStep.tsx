import type { ChangeEventHandler, FormEventHandler, RefObject } from 'react';
import { MdArrowBack, MdAttachFile, MdChevronRight } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { ACCEPTED_FILE_TYPES, type FileValidationError } from '@/features/order/validation';
import {
  CheckboxInput,
  CheckboxRow,
  CheckboxText,
  Field,
  FieldError,
  FieldHint,
  FileCount,
  FileInputWrapper,
  FormNav,
  InlineLinkButton,
  Label,
  Select,
  Textarea,
} from '@/features/order/styles';
import { OrderStepFrame } from './OrderStepFrame';
import type { BaseOrderStepProps, RenderOrderOptions } from './types';

const DOMAIN_ERROR_ID = 'order-domain-error';
const ATTACHMENT_ERROR_ID = 'order-attachments-error';
const CONSENT_ERROR_ID = 'order-rodo-error';

interface OrderExtrasStepProps extends BaseOrderStepProps {
  domainMissing: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  fileCount: number;
  fileError: FileValidationError | null;
  fileErrorMessage: string;
  consent: boolean;
  consentTouched: boolean;
  renderOptions: RenderOrderOptions;
  onFilesChange: ChangeEventHandler<HTMLInputElement>;
  onConsentChange: ChangeEventHandler<HTMLInputElement>;
  onOpenPrivacy: () => void;
  onBack: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const OrderExtrasStep = ({
  form,
  isDark,
  reducedMotion,
  direction,
  headingRef,
  onChange,
  domainMissing,
  fileInputRef,
  fileCount,
  fileError,
  fileErrorMessage,
  consent,
  consentTouched,
  renderOptions,
  onFilesChange,
  onConsentChange,
  onOpenPrivacy,
  onBack,
  onSubmit,
}: OrderExtrasStepProps) => {
  const { t } = useTranslation();
  const consentInvalid = !consent && consentTouched;

  return (
    <OrderStepFrame
      current={5}
      titleKey="order.form.stepExtras"
      direction={direction}
      reducedMotion={reducedMotion}
      headingRef={headingRef}
    >
      <form onSubmit={onSubmit} noValidate>
        <Field>
          <Label htmlFor="order-hasDomain" $required>{t('order.form.hasDomain')}</Label>
          <Select
            $isDark={isDark}
            id="order-hasDomain"
            name="hasDomain"
            required
            value={form.hasDomain}
            onChange={onChange}
            aria-invalid={domainMissing || undefined}
            aria-describedby={domainMissing ? DOMAIN_ERROR_ID : undefined}
          >
            <option value="" disabled>{t('order.form.hasDomainPlaceholder')}</option>
            {renderOptions('hasDomain', 'order.form.hasDomainOptions')}
          </Select>
          {domainMissing && <FieldError id={DOMAIN_ERROR_ID}>{t('order.form.requiredField')}</FieldError>}
        </Field>

        <Field>
          <Label htmlFor="order-references">{t('order.form.references')}</Label>
          <Textarea
            $isDark={isDark}
            id="order-references"
            name="references"
            placeholder={t('order.form.referencesPlaceholder')}
            value={form.references}
            onChange={onChange}
            style={{ minHeight: '80px' }}
          />
        </Field>

        <Field>
          <Label htmlFor="order-attachments">{t('order.form.attachments')}</Label>
          <FieldHint>{t('order.form.attachmentsHint')}</FieldHint>
          <FileInputWrapper
            htmlFor="order-attachments"
            $isDark={isDark}
            $hasError={fileError !== null}
          >
            <MdAttachFile aria-hidden="true" size={20} style={{ flexShrink: 0, opacity: 0.6 }} />
            <FileCount $hasError={fileError !== null} role="status" aria-live="polite">
              {fileError
                ? fileErrorMessage
                : fileCount === 0
                  ? t('order.form.attachmentsCount_zero')
                  : t('order.form.attachmentsCount', { count: fileCount })}
            </FileCount>
            <input
              id="order-attachments"
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_FILE_TYPES}
              onChange={onFilesChange}
              aria-invalid={fileError !== null || undefined}
              aria-describedby={fileError ? ATTACHMENT_ERROR_ID : undefined}
            />
          </FileInputWrapper>
          {fileError && <FieldError id={ATTACHMENT_ERROR_ID} role="alert">{fileErrorMessage}</FieldError>}
        </Field>

        <Field>
          <CheckboxRow>
            <CheckboxInput
              id="order-rodo-consent"
              type="checkbox"
              checked={consent}
              onChange={onConsentChange}
              required
              aria-invalid={consentInvalid || undefined}
              aria-describedby={consentInvalid ? CONSENT_ERROR_ID : undefined}
            />
            <CheckboxText>
              <label htmlFor="order-rodo-consent">{t('order.form.rodoConsentBefore')}</label>
              <InlineLinkButton type="button" onClick={onOpenPrivacy}>
                {t('order.form.rodoConsentLink')}
              </InlineLinkButton>
              <label htmlFor="order-rodo-consent">{t('order.form.rodoConsentAfter')}</label>
            </CheckboxText>
          </CheckboxRow>
          {consentInvalid && <FieldError id={CONSENT_ERROR_ID}>{t('order.form.rodoRequired')}</FieldError>}
        </Field>

        <FormNav>
          <Button type="button" size="medium" variant="outline" onClick={onBack}>
            <MdArrowBack aria-hidden="true" style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
            {t('order.form.back')}
          </Button>
          <Button type="submit" size="large">
            {t('order.form.generate')}
            <MdChevronRight aria-hidden="true" style={{ marginLeft: '0.25rem', verticalAlign: 'middle' }} />
          </Button>
        </FormNav>
      </form>
    </OrderStepFrame>
  );
};
