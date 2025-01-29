export type ToastType = 'success' | 'info' | 'error';

export interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

export interface AnimationContextType {
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
} 