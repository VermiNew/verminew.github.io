import { MdArrowBack, MdChevronRight } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Field, FieldError, FormNav, Label, Select } from '@/features/order/styles';
import { OrderStepFrame } from './OrderStepFrame';
import type { BaseOrderStepProps, RenderOrderOptions } from './types';

const CLIENT_TYPE_ERROR_ID = 'order-client-type-error';
const CONTACT_METHOD_ERROR_ID = 'order-contact-method-error';

interface OrderContactStepProps extends BaseOrderStepProps {
  clientTypeMissing: boolean;
  contactMethodMissing: boolean;
  renderOptions: RenderOrderOptions;
  onBack: () => void;
  onNext: () => void;
}

export const OrderContactStep = ({
  form,
  isDark,
  reducedMotion,
  direction,
  headingRef,
  onChange,
  clientTypeMissing,
  contactMethodMissing,
  renderOptions,
  onBack,
  onNext,
}: OrderContactStepProps) => {
  const { t } = useTranslation();

  return (
    <OrderStepFrame
      current={2}
      titleKey="order.form.stepContact"
      direction={direction}
      reducedMotion={reducedMotion}
      headingRef={headingRef}
    >
      <Field>
        <Label htmlFor="order-clientType" $required>{t('order.form.clientType')}</Label>
        <Select
          $isDark={isDark}
          id="order-clientType"
          name="clientType"
          required
          aria-invalid={clientTypeMissing || undefined}
          aria-describedby={clientTypeMissing ? CLIENT_TYPE_ERROR_ID : undefined}
          value={form.clientType}
          onChange={onChange}
        >
          <option value="" disabled>{t('order.form.clientTypePlaceholder')}</option>
          {renderOptions('clientType', 'order.form.clientTypeOptions')}
        </Select>
        {clientTypeMissing && <FieldError id={CLIENT_TYPE_ERROR_ID}>{t('order.form.requiredField')}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor="order-contactMethod" $required>{t('order.form.contactMethod')}</Label>
        <Select
          $isDark={isDark}
          id="order-contactMethod"
          name="contactMethod"
          required
          aria-invalid={contactMethodMissing || undefined}
          aria-describedby={contactMethodMissing ? CONTACT_METHOD_ERROR_ID : undefined}
          value={form.contactMethod}
          onChange={onChange}
        >
          <option value="" disabled>{t('order.form.contactMethodPlaceholder')}</option>
          {renderOptions('contactMethod', 'order.form.contactMethodOptions')}
        </Select>
        {contactMethodMissing && <FieldError id={CONTACT_METHOD_ERROR_ID}>{t('order.form.requiredField')}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor="order-source">{t('order.form.source')}</Label>
        <Select
          $isDark={isDark}
          id="order-source"
          name="source"
          value={form.source}
          onChange={onChange}
        >
          <option value="" disabled>{t('order.form.sourcePlaceholder')}</option>
          {renderOptions('source', 'order.form.sourceOptions')}
        </Select>
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
