import type { OrderFormData } from './types';

export const ORDER_OPTION_IDS = {
  clientType: ['private', 'company', 'startup', 'public-institution'],
  contactMethod: ['email', 'phone', 'discord', 'other'],
  source: ['referral', 'github', 'social-media', 'search-engine', 'other'],
  type: ['web-app', 'desktop-app', 'mobile-app', 'backend-api', 'automation', 'iot', 'other'],
  existingProject: ['new', 'extension', 'repair-rewrite', 'unknown'],
  budget: ['tier-1', 'tier-2', 'tier-3', 'tier-4', 'tier-5', 'quote-needed'],
  deadline: ['two-weeks', 'one-month', 'two-three-months', 'over-three-months', 'flexible'],
  contentReady: ['ready', 'partial', 'needs-help'],
  hasDomain: ['domain-and-hosting', 'domain-only', 'hosting-only', 'none'],
} as const satisfies Partial<Record<keyof OrderFormData, readonly string[]>>;

export type OrderOptionField = keyof typeof ORDER_OPTION_IDS;

export const getOptionLabel = (
  field: OrderOptionField,
  value: string,
  labels: readonly string[],
): string => {
  const index = ORDER_OPTION_IDS[field].indexOf(value as never);
  return index >= 0 ? labels[index] ?? value : value;
};
