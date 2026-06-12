# Portfolio Website - Plan implementacji

## Struktura projektu ✅

- [x] Konfiguracja React + TypeScript + Vite
- [x] Styled-components setup
- [x] System motywów (16 motywów)
- [x] Podstawowe komponenty UI
- [x] Footer z copyright, social links, wersją aplikacji

---

## 🔴 Aktywny problem: Tooltip w Skills (TechnologyIcon)

Tooltip renderowany przez React Portal do `document.body` z `ThemeProvider` — nadal nie widoczny.
Próbowane podejścia: position fixed, portal, z-index 9999, usunięcie backdrop-filter i will-change z CategorySection.
**Podejście do wypróbowania jutro:** porzucić portal/fixed, zrobić tooltip jako `position: absolute` na poziomie sekcji z `overflow: visible` na Grid, albo użyć biblioteki floating-ui/popper.

---

## 🔴 Krytyczne do naprawy

### Pozostałe bugi wizualne
- [ ] Logo — hover animation stuck (ikona zostaje pod kątem gdy hover przerwany)
- [ ] "Zleć projekt" button — podwójny border psuje UX
- [ ] Filtry projektów — wyglądają jak prototyp
- [ ] "Wyróżniony" odznaka — wygląda jak AI generated
- [ ] Projekty — za dużo repozytoriów, potrzebny limit/paginacja (max ~6-9 aktywnych)
- [ ] Sekcja Usługi — wygląda jak template, za pusta
- [ ] Marginesy w About — "Urodzony" ma inne marginesy niż reszta
- [ ] Dostępność/warunki — za duża czcionka względem reszty

### ESLint warnings (pozostałe)
- [ ] `ThemeContext.tsx` → wydzielić `useTheme` hook do osobnego pliku
- [ ] `ToastContext.tsx` → wydzielić `useToast` hook do osobnego pliku

---

## 🟠 Ważne ulepszenia

### Wydajność (Bundle: ~696KB → cel <300KB)
- [ ] Code splitting — `React.lazy()` dla sekcji
- [ ] Rozdzielić vendor chunks w vite.config.ts (framer-motion, react-icons)
- [ ] Lazy loading ikon (react-icons)

### Treść i UX
- [ ] FAQ — rozszerzyć o więcej pytań (tematyka: proces, płatności, technologie, czas realizacji)
- [ ] Formularz zamówień — poprawić UX
- [ ] Nawigacja — dodać wyraźny CTA "Zleć projekt" w navbarze
- [ ] Model płatności w OrderSection — zmienić na 40/40/20 lub 50/50
- [ ] Kontakt — poprawić UX sekcji
- [ ] Wersja aplikacji — zmienić z 0.0.0 na 1.0.0 w package.json

### Dostępność (A11y)
- [ ] Sprawdzić czy WSZYSTKIE animacje respektują `prefers-reduced-motion`
- [ ] Hierarchia nagłówków (h1→h2→h3 bez przeskoków)
- [ ] `aria-labelledby` na sekcjach wskazujące na SectionTitle
- [ ] `FaqSection` — rozważyć `<details>/<summary>` lub ARIA accordion

### SEO
- [ ] Dynamiczne meta tagi hreflang PL/EN
- [ ] Sitemap.xml w build pipeline
- [ ] robots.txt w public/
- [ ] og:locale:alternate

---

## 🟡 Przyszłe rozszerzenia

- [ ] Licznik odwiedzin
- [ ] GitHub Statistics section
- [ ] Animacja progress bar przewijania (góra ekranu)
- [ ] Sekcja doświadczenia zawodowego (timeline)
- [ ] Snake game (Easter egg)
- [ ] Custom 404
- [ ] Service Worker (offline)
- [ ] Sezonowy auto-switch motywów
- [ ] Świąteczny motyw (grudzień)
- [ ] Testy (Vitest): `useRepos.test.ts`, `themeUtils.test.ts`
- [ ] CONTRIBUTING.md, CHANGELOG.md

---

## ✅ Ukończone (ta sesja)

- [x] Footer z copyright © 2026, email, GitHub, wersja aplikacji
- [x] Skills — poziomy zaktualizowane (HTML/CSS advanced, JS/TS intermediate)
- [x] Skills — Next.js przeniesiony z Planned do Frameworks (learning)
- [x] Skills — Docker usunięty, Bash zostaje w Planned
- [x] Skills — naprawione wysokości kart (min-height, word-break)
- [x] Skills — animacje ikon przez parent-driven variants (brak mrugania)
- [x] Skills — ikona hover rotation nie stuck po przerwaniu
- [x] About — INF.04 zdany (praktyczny i teoretyczny)
- [x] About — angielski B2 (matura rozszerzona)
- [x] About — zainteresowania zaktualizowane (AI, ESP32/STM32, eksploracja)
- [x] About — sekcja "Obszary rozwoju" usunięta
- [x] About — tekst o AI przepisany bez przepraszania
- [x] Email — zmieniony na werminew@protonmail.com
- [x] Email — połączony z socialConfig (jeden punkt zmiany)
- [x] Hero title — nowy, konkretny, bez "entuzjasta"
- [x] Skip link — kolor tekstu naprawiony
- [x] OrderSection — a11y (aria-invalid/describedby na deadline, description, contentReady)
- [x] PrivacyPolicy — email przez interpolację z socialConfig
