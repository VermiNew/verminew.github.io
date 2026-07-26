import type { OrderFormData } from './types';

export const MAX_TOTAL_SIZE_BYTES = 20 * 1024 * 1024;
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = 'image/*,.pdf,.zip,.txt,.doc,.docx';

const allowedExtensions = new Set([
  'png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'bmp', 'svg',
  'pdf', 'zip', 'txt', 'doc', 'docx',
]);

const allowedMimeTypes = new Set([
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/svg+xml',
]);

export type FileValidationError = 'total-size' | 'file-size' | 'type' | 'duplicate';

export interface FileValidationResult {
  files: File[];
  error: FileValidationError | null;
}

export const isEmailValid = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const hasRequiredValues = (
  form: OrderFormData,
  fields: readonly (keyof OrderFormData)[],
): boolean => fields.every((field) => form[field].trim() !== '');

const isMimeTypeAllowed = (file: File): boolean =>
  file.type === '' || file.type.startsWith('image/') || allowedMimeTypes.has(file.type.toLowerCase());

export const validateFiles = (selected: File[]): FileValidationResult => {
  const names = new Set<string>();
  let total = 0;

  for (const file of selected) {
    const normalizedName = file.name.trim().toLowerCase();
    if (names.has(normalizedName)) return { files: [], error: 'duplicate' };
    names.add(normalizedName);

    const extension = normalizedName.includes('.') ? normalizedName.split('.').pop() ?? '' : '';
    if (!allowedExtensions.has(extension) || !isMimeTypeAllowed(file)) {
      return { files: [], error: 'type' };
    }
    if (file.size > MAX_FILE_SIZE_BYTES) return { files: [], error: 'file-size' };

    total += file.size;
    if (total > MAX_TOTAL_SIZE_BYTES) return { files: [], error: 'total-size' };
  }

  return { files: selected, error: null };
};
