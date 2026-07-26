import React, { useState, useCallback } from 'react';
import { SettingsContext, type SettingsTab } from './SettingsContextValue';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('language');

  const openSettings = useCallback((tab: SettingsTab = 'language') => {
    setActiveSettingsTab(tab);
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  return (
    <SettingsContext.Provider value={{ isSettingsOpen, activeSettingsTab, openSettings, closeSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
