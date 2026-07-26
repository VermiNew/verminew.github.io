import { MdChevronRight } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Field, FieldError, FormNav, Input, Label } from '@/features/order/styles';
import { OrderStepFrame } from './OrderStepFrame';
import type { BaseOrderStepProps } from './types';

const NAME_ERROR_ID = 'order-name-error';
const EMAIL_ERROR_ID = 'order-email-error';

interface OrderBasicsStepProps extends BaseOrderStepProps {
  nameMissing: boolean;
  emailMissing: boolean;
  emailInvalid: boolean;
  onNext: () => void;
}

export const OrderBasicsStep = ({
  form,
  isDark,
  reducedMotion,
  direction,
  headingRef,
  onChange,
  nameMissing,
  emailMissing,
  emailInvalid,
  onNext,
}: OrderBasicsStepProps) => {
  const { t } = useTranslation();
  const emailDescribedBy = emailMissing || emailInvalid ? EMAIL_ERROR_ID : undefined;

  return (
    <OrderStepFrame
      current={1}
      titleKey="order.form.stepBasic"
      direction={direction}
      reducedMotion={reducedMotion}
      headingRef={headingRef}
    >
      <Field>
        <Label htmlFor="order-name" $required>{t('order.form.name')}</Label>
        <Input
          $isDark={isDark}
          id="order-name"
          name="name"
          type="text"
          required
          aria-invalid={nameMissing || undefined}
          aria-describedby={nameMissing ? NAME_ERROR_ID : undefined}
          placeholder={t('order.form.namePlaceholder')}
          value={form.name}
          onChange={onChange}
        />
        {nameMissing && <FieldError id={NAME_ERROR_ID}>{t('order.form.requiredField')}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor="order-email" $required>{t('order.form.email')}</Label>
        <Input
          $isDark={isDark}
          id="order-email"
          name="email"
          type="email"
          required
          aria-invalid={emailMissing || emailInvalid || undefined}
          aria-describedby={emailDescribedBy}
          placeholder={t('order.form.emailPlaceholder')}
          value={form.email}
          onChange={onChange}
        />
        {emailMissing && <FieldError id={EMAIL_ERROR_ID}>{t('order.form.requiredField')}</FieldError>}
        {!emailMissing && emailInvalid && <FieldError id={EMAIL_ERROR_ID}>{t('order.form.invalidEmail')}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor="order-phone">{t('order.form.phone')}</Label>
        <Input
          $isDark={isDark}
          id="order-phone"
          name="phone"
          type="tel"
          placeholder={t('order.form.phonePlaceholder')}
          value={form.phone}
          onChange={onChange}
        />
      </Field>

      <FormNav>
        <div />
        <Button type="button" size="large" onClick={onNext}>
          {t('order.form.next')}
          <MdChevronRight aria-hidden="true" style={{ marginLeft: '0.25rem', verticalAlign: 'middle' }} />
        </Button>
      </FormNav>
    </OrderStepFrame>
  );
};
