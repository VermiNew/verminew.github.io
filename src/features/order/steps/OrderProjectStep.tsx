import { MdArrowBack, MdChevronRight } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Field, FieldError, FieldHint, FormNav, Label, Select } from '@/features/order/styles';
import { OrderStepFrame } from './OrderStepFrame';
import type { BaseOrderStepProps, RenderOrderOptions } from './types';

const TYPE_ERROR_ID = 'order-project-type-error';
const EXISTING_PROJECT_ERROR_ID = 'order-existing-project-error';
const BUDGET_ERROR_ID = 'order-budget-error';

interface OrderProjectStepProps extends BaseOrderStepProps {
  typeMissing: boolean;
  existingProjectMissing: boolean;
  budgetMissing: boolean;
  renderOptions: RenderOrderOptions;
  onBack: () => void;
  onNext: () => void;
}

export const OrderProjectStep = ({
  form,
  isDark,
  reducedMotion,
  direction,
  headingRef,
  onChange,
  typeMissing,
  existingProjectMissing,
  budgetMissing,
  renderOptions,
  onBack,
  onNext,
}: OrderProjectStepProps) => {
  const { t } = useTranslation();

  return (
    <OrderStepFrame
      current={3}
      titleKey="order.form.stepProject"
      direction={direction}
      reducedMotion={reducedMotion}
      headingRef={headingRef}
    >
      <Field>
        <Label htmlFor="order-type" $required>{t('order.form.type')}</Label>
        <Select
          $isDark={isDark}
          id="order-type"
          name="type"
          required
          aria-invalid={typeMissing || undefined}
          aria-describedby={typeMissing ? TYPE_ERROR_ID : undefined}
          value={form.type}
          onChange={onChange}
        >
          <option value="" disabled>{t('order.form.typePlaceholder')}</option>
          {renderOptions('type', 'order.form.typeOptions')}
        </Select>
        {typeMissing && <FieldError id={TYPE_ERROR_ID}>{t('order.form.requiredField')}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor="order-existingProject" $required>{t('order.form.existingProject')}</Label>
        <Select
          $isDark={isDark}
          id="order-existingProject"
          name="existingProject"
          required
          aria-invalid={existingProjectMissing || undefined}
          aria-describedby={existingProjectMissing ? EXISTING_PROJECT_ERROR_ID : undefined}
          value={form.existingProject}
          onChange={onChange}
        >
          <option value="" disabled>{t('order.form.existingProjectPlaceholder')}</option>
          {renderOptions('existingProject', 'order.form.existingProjectOptions')}
        </Select>
        {existingProjectMissing && <FieldError id={EXISTING_PROJECT_ERROR_ID}>{t('order.form.requiredField')}</FieldError>}
      </Field>

      <Field>
        <Label htmlFor="order-budget" $required>{t('order.form.budget')}</Label>
        <FieldHint>{t('order.form.budgetHint')}</FieldHint>
        <Select
          $isDark={isDark}
          id="order-budget"
          name="budget"
          required
          aria-invalid={budgetMissing || undefined}
          aria-describedby={budgetMissing ? BUDGET_ERROR_ID : undefined}
          value={form.budget}
          onChange={onChange}
        >
          <option value="" disabled>{t('order.form.budgetPlaceholder')}</option>
          {renderOptions('budget', 'order.form.budgetOptions')}
        </Select>
        {budgetMissing && <FieldError id={BUDGET_ERROR_ID}>{t('order.form.requiredField')}</FieldError>}
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
