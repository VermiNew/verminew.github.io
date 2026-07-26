export type OrderStep = 'basics' | 'contact' | 'project' | 'details' | 'extras' | 'summary';

export interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  clientType: string;
  contactMethod: string;
  source: string;
  type: string;
  deadline: string;
  existingProject: string;
  budget: string;
  description: string;
  contentReady: string;
  hasDomain: string;
  references: string;
}

export interface OrderDraft {
  schemaVersion: 1;
  savedAt: string;
  form: OrderFormData;
}

export interface OrderFileMetadata {
  name: string;
  type: string;
  size: number;
  lastModified: number;
}

export interface OrderPayload {
  schemaVersion: 1;
  appVersion: string;
  id: string;
  language: 'pl' | 'en';
  createdAt: string;
  updatedAt: string;
  form: OrderFormData;
  attachments: OrderFileMetadata[];
}

export const emptyOrderForm: OrderFormData = {
  name: '',
  email: '',
  phone: '',
  clientType: '',
  contactMethod: '',
  source: '',
  type: '',
  deadline: '',
  existingProject: '',
  budget: '',
  description: '',
  contentReady: '',
  hasDomain: '',
  references: '',
};
