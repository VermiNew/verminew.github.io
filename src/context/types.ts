export type ToastType = 'success' | 'info' | 'error';

export interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

export type MotionPreference = 'system' | 'full' | 'reduced';

export interface AnimationContextType {
  motionPreference: MotionPreference;
  setMotionPreference: (value: MotionPreference) => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  smoothScroll: boolean;
  setSmoothScroll: (value: boolean) => void;
}
