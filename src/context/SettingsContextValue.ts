import { createContext } from 'react';

export type SettingsTab = 'language' | 'preferences';

export interface SettingsContextType {
  isSettingsOpen: boolean;
  activeSettingsTab: SettingsTab;
  openSettings: (tab?: SettingsTab) => void;
  closeSettings: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
