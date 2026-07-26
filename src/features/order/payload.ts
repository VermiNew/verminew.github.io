import type { OrderFormData, OrderPayload } from './types';

export interface CreateOrderPayloadOptions {
  id: string;
  createdAt: string;
  updatedAt?: string;
  appVersion?: string;
  language: 'pl' | 'en';
  form: OrderFormData;
  files: File[];
}

export const createOrderId = (date = new Date()): string => {
  const year = date.getFullYear();
  const randomId = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID().replaceAll('-', '')
    : Array.from(crypto.getRandomValues(new Uint8Array(8)), (value) => value.toString(16).padStart(2, '0')).join('');
  return `VMN-${year}-${randomId.slice(0, 8).toUpperCase()}`;
};

const runtimeAppVersion = (): string =>
  typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'development';

export const createOrderPayload = ({
  id,
  createdAt,
  updatedAt = new Date().toISOString(),
  appVersion = runtimeAppVersion(),
  language,
  form,
  files,
}: CreateOrderPayloadOptions): OrderPayload => ({
  schemaVersion: 1,
  appVersion,
  id,
  language,
  createdAt,
  updatedAt,
  form: { ...form },
  attachments: files.map((file) => ({
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified,
  })),
});
