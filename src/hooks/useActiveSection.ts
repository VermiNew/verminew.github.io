import { useEffect, useState } from 'react';

export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const observedSections = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      },
    );

    const syncObservedSections = () => {
      const currentSections = new Set(document.querySelectorAll('section[id]'));

      observedSections.forEach((section) => {
        if (!currentSections.has(section)) {
          observer.unobserve(section);
          observedSections.delete(section);
        }
      });

      currentSections.forEach((section) => {
        if (!observedSections.has(section)) {
          observedSections.add(section);
          observer.observe(section);
        }
      });
    };

    syncObservedSections();
    const mutationObserver = new MutationObserver(syncObservedSections);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      observedSections.clear();
    };
  }, []);

  return activeSection;
};
