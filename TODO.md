# Portfolio Website - Plan implementacji

## Struktura projektu ✅

- [x] Konfiguracja React + TypeScript + Vite
- [x] Styled-components setup
- [x] System motywów
  - [x] Jasny/ciemny motyw
  - [x] Rozszerzony system motywów:
    - [x] Corporate Modern
    - [x] Tech Minimal
    - [x] Professional Dark
    - [x] Modern Neutral
    - [x] E-Ink (Light/Dark)
    - [x] Nord
    - [x] Solarized (Light/Dark)
    - [x] Sezonowe (Winter, Spring, Summer, Autumn)
    - [x] Pastel
  - [x] Menu wyboru motywu
  - [x] Zapisywanie preferencji
  - [ ] Optymalizacja kontrastu dla dostępności
- [x] Podstawowe komponenty UI
  - [x] Container
  - [x] Section
  - [x] Button
  - [x] SectionTitle

## Sekcje strony

### 1. Hero Section ✅

- [x] Interaktywne tło z cząsteczkami
- [x] Animowane logo
- [x] Responsywny układ
- [x] Przyciski nawigacji
- [x] Efekty hover i animacje

### 2. About Section ✅

- [x] Podstawowy układ
- [x] Zdjęcie profilowe (ava.jpg)
- [x] Opis osobisty
- [x] Animowane ikony technologii
- [x] Sekcja "Obecnie uczę się"
- [x] Responsywny układ
- [x] Animacje wejścia elementów

### 3. Skills Section ✅

- [x] Grid technologii
- [x] Grupowanie umiejętności:
  - [x] Web Development
  - [x] AI/ML
  - [x] Desktop Development
  - [x] Inne
- [x] Poziomy zaawansowania
- [x] Animacje ikon
- [x] Responsywny układ

### 4. Projects Section ✅

- [x] Filtrowanie projektów:
  - [x] Po technologii
  - [x] Po typie (web, AI, desktop)
- [x] Karty projektów z:
  - [x] Tytułem
  - [x] Opisem
  - [x] Użytymi technologiami
  - [x] Linkiem do GitHub
- [x] Animacje hover
- [x] Responsywny grid
- [x] Wyróżnione projekty (np. Luna)

### 5. Blog/Dziennik nauki ✅

- [x] Lista wpisów
- [x] System tagów
- [x] System komentarzy (Giscus)
- [x] Responsywny układ

---

## 🔴 Krytyczne do naprawy

### Ostrzeżenia ESLint

- [ ] `TechnologyIcon.tsx`: Przenieść `levelFallbackMap` do wnętrza `useMemo`
- [ ] `ThemeContext.tsx` → oddzielić `useTheme` hook do osobnego pliku
- [ ] `ToastContext.tsx` → oddzielić `useToast` hook do osobnego pliku

---

## 🟠 Ważne ulepszenia

### Wydajność (Bundle size: 509KB → cel <300KB)

- [ ] Code splitting - dynamiczne importy dla sekcji:

  ```tsx
  const AboutSection = lazy(() => import('./sections/AboutSection'));
  ```

- [ ] Rozdzielić vendor chunks w vite.config.ts (framer-motion, react-icons)
- [ ] Lazy loading dla ikon technologii (react-icons)
- [ ] Optymalizacja obrazów - użyć srcset dla różnych rozmiarów

### Dostępność (A11y) - SZCZEGÓŁOWO

#### Skip Link ✅
- [x] Dodać "Skip to main content" link na początku strony (commit 112cc6f)

#### Focus States ✅
- [x] `Button.tsx` - `:focus-visible` styles dodane (commit ed58d8c)
- [x] `NavLink`, `FilterButton`, `ContactCard`, `MobileNavLink` - focus states (commit ed58d8c)

#### ARIA Attributes ✅
- [x] `Toast.tsx` - `role="alert"` dodane (commit 63b9582)
- [x] `LoadingSpinner` - `aria-busy="true"` i `aria-label` (commit 63b9582)
- [x] `ErrorMessage` - `role="alert"` (commit 63b9582)
- [x] Ikony - `aria-hidden="true"` lub `aria-label` (commit fbe7832)
- [x] Menu button - `aria-expanded` (commit fbe7832)

#### Nawigacja klawiaturą ✅
- [x] Menu mobilne - focus trap gdy otwarte (commit 0458b18)
- [x] Escape key zamyka menu mobilne (commit 0458b18)
- [x] Theme toggle - `aria-label` z aktualnym stanem (commit fbe7832)

#### Animacje i ruch
- [x] `reducedMotion` - zaimplementowane ✅
- [ ] Sprawdzić czy WSZYSTKIE animacje respektują `prefers-reduced-motion`
- [ ] `HeroBackground` z cząsteczkami - czy wyłącza się przy reduced motion?

#### Semantyka HTML
- [ ] Sprawdzić hierarchię nagłówków (h1 → h2 → h3, bez przeskoków)
- [ ] Sekcje strony - dodać `aria-labelledby` wskazujące na SectionTitle
- [ ] `FAQSection` - rozważyć użycie `<details>/<summary>` lub ARIA accordion
- [ ] Listy kontaktów - mogłyby być `<ul>` zamiast grid divów

### SEO

- [ ] Dynamiczne meta tagi dla języka (hreflang)
- [ ] Sitemap.xml generator w build pipeline
- [ ] Robots.txt w folderze public
- [ ] Dodać og:locale:alternate dla PL/EN

---

## Funkcjonalności globalne

### Nawigacja 🧭

- [x] Sticky header
- [x] Menu mobilne
- [x] Płynne przewijanie
- [x] Wskaźnik aktywnej sekcji
- [ ] Animacja progress bar przewijania strony (góra ekranu)

### Internacjonalizacja 🌍

- [x] System i18n
- [x] Tłumaczenia PL/EN
- [x] Przełącznik języków
- [ ] Poprawić wykrywanie języka przeglądarki

### Dodatkowe elementy 🎨

- [ ] Licznik odwiedzin
- [ ] Statystyki GitHub
- [x] Linki społecznościowe:
  - [x] GitHub
  - [x] Discord
  - [x] Email
  - [x] LinkedIn

### Optymalizacja 🚀

- [ ] Lazy loading komponentów
- [ ] Optymalizacja obrazów
- [ ] SEO
- [ ] Testy wydajności

---

## Deployment 🌐

- [x] Konfiguracja GitHub Pages
- [x] GitHub Actions dla automatycznego deploymentu
- [x] Lighthouse CI
- [ ] Testy przed deploymentem
- [ ] Dependabot dla aktualizacji zależności

---

## Dokumentacja 📚

- [ ] README.md
  - [ ] Screenshots/GIF demo
  - [ ] Instrukcja instalacji
  - [ ] Opis struktury projektu
  - [ ] Jak dodać nowy motyw
  - [ ] Jak dodać nowy projekt
- [ ] Komentarze w kodzie
- [ ] Instrukcje deploymentu
- [ ] CONTRIBUTING.md
- [ ] CHANGELOG.md

---

## Refaktoryzacja i jakość kodu 🔧

### Struktura projektu

- [ ] Utworzyć barrel exports (`index.ts`) dla folderów:
  - `components/ui/index.ts`
  - `components/sections/index.ts`
  - `hooks/index.ts`
- [ ] Przenieść styled-components do osobnych plików `.styles.ts` dla większych komponentów
- [ ] Dodać testy jednostkowe (Vitest):
  - `useRepos.test.ts`
  - `themeUtils.test.ts`
  - Komponenty UI

### TypeScript

- [ ] Włączyć strict mode w tsconfig (strictNullChecks już jest)
- [ ] Usunąć `any` types jeśli występują
- [ ] Dodać JSDoc komentarze do eksportowanych funkcji

---

## Przyszłe rozszerzenia 🔮

- [ ] System powiadomień o nowych wpisach
- [ ] Integracja z API GitHub dla automatycznych aktualizacji projektów
- [ ] Sekcja doświadczenia zawodowego (timeline)
- [ ] Dark mode toggle animation (sun/moon)
- [ ] Strona 404 custom
- [ ] Tryb offline (Service Worker)
- [ ] Motywy sezonowe auto-switch (based on date)
- [ ] Świąteczny motyw (grudzień)

---

## 📊 Metryki do osiągnięcia

### Lighthouse Scores (cel)

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

### Core Web Vitals

- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

---

## ✅ Ukończone niedawno

- [x] Dodanie kolorów semantycznych (warning, info, special, professional)
- [x] Dostosowanie kolorów do każdego motywu
- [x] e-Ink motywy w pełnej skali szarości
- [x] Nord z paletą Aurora
- [x] Solarized z oryginalnymi kolorami
