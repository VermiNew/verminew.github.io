import translationEN from '../../locales/en/translation.json' with { type: 'json' };
import translationPL from '../../locales/pl/translation.json' with { type: 'json' };
import { ORDER_OPTION_IDS, type OrderOptionField } from './options.ts';
import { emptyOrderForm, type OrderDraft, type OrderFormData } from './types.ts';
import { safeSessionStorage } from '../../utils/storage.ts';

export const ORDER_SESSION_KEY = 'verminew:order-draft:v1';
const LEGACY_SESSION_KEY = 'order-form-data';

const formKeys = Object.keys(emptyOrderForm) as Array<keyof OrderFormData>;
const optionTranslationKey: Record<OrderOptionField, keyof typeof translationEN.order.form> = {
  clientType: 'clientTypeOptions',
  contactMethod: 'contactMethodOptions',
  source: 'sourceOptions',
  type: 'typeOptions',
  existingProject: 'existingProjectOptions',
  budget: 'budgetOptions',
  deadline: 'deadlineOptions',
  contentReady: 'contentReadyOptions',
  hasDomain: 'hasDomainOptions',
};

const normalizeOption = (field: OrderOptionField, value: string): string => {
  const ids = ORDER_OPTION_IDS[field];
  if (ids.some((id) => id === value)) return value;

  const translationKey = optionTranslationKey[field];
  for (const translation of [translationPL, translationEN] as const) {
    const labels = translation.order.form[translationKey as keyof typeof translation.order.form];
    if (!Array.isArray(labels)) continue;
    const index = labels.findIndex((label) => label === value);
    const migrated = ids[index];
    if (migrated) return migrated;
  }
  return '';
};

export const sanitizeOrderForm = (value: unknown): OrderFormData | null => {
  if (typeof value !== 'object' || value === null) return null;
  const candidate = value as Record<string, unknown>;
  const result = { ...emptyOrderForm };

  for (const key of formKeys) {
    const field = candidate[key];
    if (field !== undefined && typeof field !== 'string') return null;
    result[key] = field ?? '';
  }

  for (const field of Object.keys(ORDER_OPTION_IDS) as OrderOptionField[]) {
    result[field] = normalizeOption(field, result[field]);
  }

  return result;
};

export const loadOrderDraft = (): OrderFormData => {
  const raw = safeSessionStorage.get(ORDER_SESSION_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (typeof parsed === 'object' && parsed !== null) {
        const draft = parsed as Partial<OrderDraft>;
        if (draft.schemaVersion === 1 && typeof draft.savedAt === 'string' && !Number.isNaN(Date.parse(draft.savedAt))) {
          const form = sanitizeOrderForm(draft.form);
          if (form) return form;
        }
      }
    } catch {
      // Invalid JSON is discarded below.
    }
    safeSessionStorage.remove(ORDER_SESSION_KEY);
  }

  const legacy = safeSessionStorage.get(LEGACY_SESSION_KEY);
  if (legacy) {
    safeSessionStorage.remove(LEGACY_SESSION_KEY);
    try {
      const migrated = sanitizeOrderForm(JSON.parse(legacy));
      if (migrated) return migrated;
    } catch {
      // Invalid legacy data is ignored.
    }
  }

  return { ...emptyOrderForm };
};

export const saveOrderDraft = (form: OrderFormData): void => {
  if (!(Object.values(form) as string[]).some((value) => value.trim() !== '')) {
    clearOrderDraft();
    return;
  }

  const draft: OrderDraft = {
    schemaVersion: 1,
    savedAt: new Date().toISOString(),
    form,
  };

  safeSessionStorage.set(ORDER_SESSION_KEY, JSON.stringify(draft));
};

export const clearOrderDraft = (): void => {
  safeSessionStorage.remove(ORDER_SESSION_KEY);
  safeSessionStorage.remove(LEGACY_SESSION_KEY);
};
