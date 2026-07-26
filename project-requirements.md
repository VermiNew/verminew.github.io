# VermiNew Portfolio — wymagania produktu

## 1. Cel

Strona ma przedstawiać Michała Oślizło (VermiNew), jego umiejętności, sposób pracy i wybrane projekty. Drugim głównym celem jest umożliwienie potencjalnemu klientowi przygotowania kompletnego briefu zlecenia bez wysyłania danych do własnego backendu strony.

## 2. Odbiorcy

- rekruterzy i pracodawcy,
- osoby szukające wykonawcy strony lub aplikacji webowej,
- programiści i osoby zainteresowane projektami autora.

## 3. Zakres funkcjonalny

### 3.1 Sekcje

1. Hero — identyfikacja autora, CTA i animowane tło.
2. O mnie — edukacja, kwalifikacje, sposób pracy i dostępność.
3. Usługi — zakres możliwej współpracy.
4. Umiejętności — technologie pogrupowane według kategorii i poziomu.
5. Projekty — dane techniczne z GitHuba oraz kuratorowane treści PL/EN.
6. Zleć projekt — wieloetapowy lokalny generator briefu.
7. FAQ — warunki współpracy i odpowiedzi na najważniejsze pytania.
8. Kontakt — kanały kontaktu i dostępność.

### 3.2 Języki

- polski,
- angielski,
- zapamiętanie wyboru w bezpiecznym storage,
- spójna treść biznesowa i prawna w obu językach,
- metadane strony aktualizowane razem z językiem.

### 3.3 Motywy

Projekt utrzymuje 16 motywów:

- Light,
- Dark,
- Corporate Modern,
- Tech Minimal,
- Professional Dark,
- Modern Neutral,
- E-Ink Light,
- E-Ink Dark,
- Nord,
- Solarized Light,
- Solarized Dark,
- Winter,
- Spring,
- Summer,
- Autumn,
- Pastel.

Każdy motyw musi spełniać wspólny kontrakt semantycznych tokenów, mieć czytelne stany focus/hover oraz właściwy kontrast tekstu i elementów sterujących.

### 3.4 Ustawienia ruchu

- tryb systemowy,
- pełne animacje,
- ograniczone animacje,
- osobne ustawienie płynnego przewijania,
- reakcja na zmianę preferencji systemowej,
- brak ciągłych animacji w niewidocznej karcie.

### 3.5 Projekty

- dane publikowane w `public/data/repos.json`,
- aktualizacja przez GitHub Actions,
- brak bezpośredniego pobierania danych z gałęzi `main` w runtime,
- walidacja pełnego schematu,
- cache jako fallback z czytelnym ostrzeżeniem,
- ręczna lista projektów wyróżnionych,
- archiwalne repozytoria niewidoczne w aktywnych projektach,
- pusty stan filtrów oraz możliwość ponowienia pobrania.

### 3.6 Generator briefu

- pięć kroków formularza,
- walidacja po próbie przejścia dalej,
- fokus na pierwszym błędnym polu,
- stabilne identyfikatory wartości niezależne od języka,
- wersjonowany szkic w `sessionStorage`,
- walidacja i migracja szkicu,
- obsługa załączników z limitami typu i rozmiaru,
- generowanie ZIP dopiero na żądanie,
- stabilny identyfikator oraz daty utworzenia i aktualizacji,
- JSON techniczny oraz czytelne briefy PL/EN,
- jasna informacja, że pobranie nie oznacza wysłania zgłoszenia.

## 4. Stos technologiczny

- React 18,
- TypeScript 5.6,
- Vite 6,
- styled-components,
- Framer Motion,
- i18next oraz react-i18next,
- JSZip ładowany dynamicznie,
- GitHub Pages,
- GitHub Actions,
- Node.js 26 i npm 11.

## 5. Jakość techniczna

### 5.1 TypeScript

- project references dla aplikacji i konfiguracji Vite,
- brak `TS6310`,
- brak emitowanych plików obok źródeł,
- cache kompilatora w katalogu ignorowanym przez Git,
- brak niejawnego omijania plików podczas typechecku.

### 5.2 Build

- czysty build z `npm ci`,
- hashowane nazwy assetów,
- brak generowanych śmieci w repozytorium,
- progresywne ładowanie cięższych sekcji,
- dynamiczny import JSZip,
- zoptymalizowane obrazy publikowane w `public`.

### 5.3 Kontrola jakości

Przed wydaniem muszą przejść:

```bash
npm run lint
npm run typecheck
npm run test
npm run validate
npm run build
```

GitHub Actions musi wykonywać ten sam zestaw kontroli na czystej instalacji.

## 6. Automatyzacja GitHub

### 6.1 Aktualizacja danych projektów

- harmonogram codzienny,
- uruchomienie ręczne i dry run,
- opcjonalny token z bezpiecznym fallbackiem do limitu publicznego API,
- paginacja wyników,
- odrzucanie forków i repozytoriów archiwalnych,
- atomowy zapis JSON,
- brak commita przy niezmienionych danych,
- commit ograniczony do `public/data/repos.json`,
- jawne uruchomienie deploymentu po commicie automatyzacji.

### 6.2 Quality i deployment

- jedna wersja Node z `.nvmrc`,
- `npm ci` bez cache `node_modules`,
- testy oraz build na pull requestach i `main`,
- publikacja przez oficjalne GitHub Pages actions,
- Lighthouse po wdrożeniu,
- progi minimalne:
  - Performance: 90,
  - Accessibility: 95,
  - Best Practices: 95,
  - SEO: 95.

### 6.3 Wydania

- tag w formacie `vX.Y.Z`,
- zgodność wersji taga z `package.json` i `package-lock.json`,
- pełna weryfikacja przed utworzeniem GitHub Release,
- archiwum źródłowe generowane z oznaczonego commita.

## 7. Dostępność

- semantyczna hierarchia nagłówków,
- Skip Link,
- pełna obsługa klawiatury,
- widoczny focus we wszystkich motywach,
- focus trap, Escape i przywrócenie fokusu w dialogach,
- dostępne tooltipy,
- regiony live dla statusów,
- lokalizowane etykiety ARIA,
- obsługa reduced motion,
- kontrast zgodny co najmniej z WCAG AA dla zwykłego tekstu.

## 8. SEO i publikacja

- dynamiczne title i description PL/EN,
- canonical, hreflang, Open Graph i Twitter Card,
- lokalizowany JSON-LD,
- grafika social preview 1200 × 630,
- `robots.txt`, `sitemap.xml` i strona 404,
- manifest oraz osobne ikony maskable,
- service worker z kontrolowanym cache i poprawną aktualizacją wersji.

## 9. Wsparcie przeglądarek

- aktualne stabilne wersje Chrome, Edge i Firefox,
- Safari i iOS Safari w zakresie możliwości użytych API,
- Chrome na Androidzie,
- bezpieczne fallbacki dla Clipboard API, storage i service workera.

## 10. Definicja wersji 1.0

Wersja 1.0 jest gotowa, gdy:

- pełny pipeline przechodzi na czystym checkoutcie,
- wszystkie workflowy są zielone,
- 16 motywów przechodzi kontrolę wizualną,
- formularz działa od otwarcia do poprawnego ZIP w PL i EN,
- projekty aktualizują się i działają z cache,
- interfejs przechodzi kontrolę klawiaturową i mobilną,
- publiczny deployment odpowiada oznaczonemu commitowi,
- checklista wydania jest kompletna.
