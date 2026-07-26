import translationEN from '@/locales/en/translation.json';
import translationPL from '@/locales/pl/translation.json';
import { getOptionLabel, type OrderOptionField } from './options';
import type { OrderFormData, OrderPayload } from './types';
import { createUniqueArchiveEntryName } from './attachmentNames';
import { createOrderPayload } from './payload';

export interface BuildArchiveOptions {
  id: string;
  createdAt: string;
  language: 'pl' | 'en';
  form: OrderFormData;
  files: File[];
  onProgress?: (percent: number) => void;
}

const translationByLanguage = {
  pl: translationPL,
  en: translationEN,
} as const;

const optionKeyByField: Record<OrderOptionField, keyof typeof translationEN.order.form> = {
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

const fieldLabelKeys: Partial<Record<keyof OrderFormData, keyof typeof translationEN.order.form>> = {
  name: 'name',
  email: 'email',
  phone: 'phone',
  clientType: 'clientType',
  contactMethod: 'contactMethod',
  source: 'source',
  type: 'type',
  deadline: 'deadline',
  existingProject: 'existingProject',
  budget: 'budget',
  description: 'description',
  contentReady: 'contentReady',
  hasDomain: 'hasDomain',
  references: 'references',
};

const optionFields = new Set<OrderOptionField>(Object.keys(optionKeyByField) as OrderOptionField[]);

export const createOrderBrief = (language: 'pl' | 'en', payload: OrderPayload): string => {
  const translation = translationByLanguage[language];
  const formTranslations = translation.order.form as Record<string, unknown>;
  const lines = [
    language === 'pl' ? 'BRIEF ZLECENIA VERMINEW' : 'VERMINEW PROJECT BRIEF',
    '========================================',
    `${translation.order.summary.idLabel}: ${payload.id}`,
    `${language === 'pl' ? 'Utworzono' : 'Created'}: ${payload.createdAt}`,
    '',
  ];

  for (const [field, value] of Object.entries(payload.form) as Array<[keyof OrderFormData, string]>) {
    if (!value.trim()) continue;
    const labelKey = fieldLabelKeys[field];
    const label = labelKey ? String(formTranslations[labelKey] ?? field) : field;
    let readableValue = value;

    if (optionFields.has(field as OrderOptionField)) {
      const optionField = field as OrderOptionField;
      const optionKey = optionKeyByField[optionField];
      const labels = formTranslations[optionKey];
      if (Array.isArray(labels)) readableValue = getOptionLabel(optionField, value, labels);
    }

    lines.push(`${label}:`);
    lines.push(readableValue);
    lines.push('');
  }

  if (payload.attachments.length > 0) {
    lines.push(language === 'pl' ? 'ZAŁĄCZNIKI:' : 'ATTACHMENTS:');
    for (const file of payload.attachments) {
      lines.push(`- ${file.name} (${Math.ceil(file.size / 1024)} KB)`);
    }
  }

  return `${lines.join('\n').trim()}\n`;
};

export const buildOrderArchive = async ({
  id,
  createdAt,
  language,
  form,
  files,
  onProgress,
}: BuildArchiveOptions): Promise<{ blob: Blob; filename: string; payload: OrderPayload }> => {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  const payload = createOrderPayload({ id, createdAt, language, form, files });

  zip.file('order.json', JSON.stringify(payload, null, 2));
  zip.file('brief-pl.txt', createOrderBrief('pl', payload));
  zip.file('brief-en.txt', createOrderBrief('en', payload));
  zip.file(
    'README.txt',
    'VermiNew project brief\n\n1. Review the generated brief.\n2. Send this ZIP file as an email attachment.\n3. The order has not been sent automatically.\n',
  );

  const attachments = zip.folder('attachments');
  const usedAttachmentNames = new Set<string>();
  for (const file of files) {
    attachments?.file(createUniqueArchiveEntryName(file.name, usedAttachmentNames), file);
  }

  const blob = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (metadata) => onProgress?.(Math.round(metadata.percent)),
  );
  return {
    blob,
    filename: `verminew-order-${id}.zip`,
    payload,
  };
};
