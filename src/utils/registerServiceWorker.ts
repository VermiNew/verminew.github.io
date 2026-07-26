const getServiceWorkerUrl = (): string => `/sw.js?v=${encodeURIComponent(__APP_VERSION__)}`;

export const registerServiceWorker = (): void => {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    let refreshing = false;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    void navigator.serviceWorker.register(getServiceWorkerUrl()).then((registration) => {
      const activateWaitingWorker = (): void => {
        if (registration.waiting && navigator.serviceWorker.controller) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      };

      activateWaitingWorker();
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') activateWaitingWorker();
        });
      });

      void registration.update();
    }).catch((error: unknown) => {
      if (import.meta.env.DEV) console.warn('Service worker registration failed:', error);
    });
  }, { once: true });
};
