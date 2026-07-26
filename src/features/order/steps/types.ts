import type { ChangeEventHandler, ReactNode, RefObject } from 'react';
import type { OrderOptionField } from '@/features/order/options';
import type { OrderFormData } from '@/features/order/types';

export type OrderFieldChangeHandler = ChangeEventHandler<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export type RenderOrderOptions = (field: OrderOptionField, translationKey: string) => ReactNode;

export interface BaseOrderStepProps {
  form: OrderFormData;
  isDark: boolean;
  reducedMotion: boolean;
  direction: number;
  headingRef: RefObject<HTMLDivElement>;
  onChange: OrderFieldChangeHandler;
}
