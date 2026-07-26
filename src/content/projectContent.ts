import type { SupportedLanguage } from '@/i18n';

interface ProjectCopy {
  description: string;
  featuredReason?: string;
}

type BilingualProjectCopy = Record<SupportedLanguage, ProjectCopy>;

const PROJECT_COPY: Record<string, BilingualProjectCopy> = {
  'verminew.github.io': {
    pl: {
      description: 'Dwujęzyczne portfolio zbudowane w React i TypeScript, obejmujące projekty, usługi, motywy oraz lokalny generator briefu zlecenia.',
      featuredReason: 'Główny projekt portfolio pokazujący architekturę interfejsu, dostępność, automatyzację i dbałość o szczegóły.',
    },
    en: {
      description: 'A bilingual React and TypeScript portfolio featuring projects, services, themes and a local project-brief generator.',
      featuredReason: 'The main portfolio project demonstrating UI architecture, accessibility, automation and attention to detail.',
    },
  },
  AudioAnalyzers: {
    pl: {
      description: 'Internetowe narzędzie do analizy i obróbki dźwięku z wizualizacją przebiegu, analizą widma i oddzielnym sterowaniem ścieżkami.',
      featuredReason: 'Projekt prezentujący pracę z dźwiękiem, wizualizacją danych i interaktywnym interfejsem webowym.',
    },
    en: {
      description: 'A browser-based audio analysis and processing tool with waveform visualization, spectrum analysis and separate track controls.',
      featuredReason: 'A project demonstrating audio processing, data visualization and interactive web interfaces.',
    },
  },
  PortableBlenderManager: {
    pl: {
      description: 'Narzędzie wspierające przenośną edycję Blendera, porządkowanie danych po pracy oraz przechowywanie konfiguracji obok skryptu.',
      featuredReason: 'Praktyczna automatyzacja usprawniająca zarządzanie przenośnym środowiskiem pracy.',
    },
    en: {
      description: 'A utility for Blender Portable that cleans up data after use and stores configuration alongside the management script.',
      featuredReason: 'Practical automation that improves management of a portable creative workspace.',
    },
  },
  'w-chrystusie': {
    pl: {
      description: 'Aplikacja webowa zawierająca modlitwy, różaniec i pieśni, zaprojektowana z myślą o czytelnym i spokojnym korzystaniu.',
      featuredReason: 'Rozbudowana aplikacja treściowa z naciskiem na organizację informacji i wygodę użytkownika.',
    },
    en: {
      description: 'A web application with prayers, the rosary and hymns, designed for a clear and calm reading experience.',
      featuredReason: 'A content-rich application focused on information structure and user comfort.',
    },
  },
  'energy-monitoring-system': {
    pl: {
      description: 'Panel monitorowania zużycia energii dla systemu smart home, zbudowany w React i TypeScript.',
      featuredReason: 'Projekt pokazujący prezentację danych pomiarowych oraz budowę czytelnego panelu kontrolnego.',
    },
    en: {
      description: 'A React and TypeScript smart-home dashboard for monitoring energy consumption.',
      featuredReason: 'A project demonstrating measurement-data presentation and clear dashboard design.',
    },
  },
};

export const getProjectCopy = (
  id: string,
  language: SupportedLanguage,
  fallback: ProjectCopy,
): ProjectCopy => PROJECT_COPY[id]?.[language] ?? fallback;
