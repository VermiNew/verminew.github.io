# VermiNew Portfolio

Dwujęzyczne portfolio Michała Oślizło (VermiNew), zbudowane w React, TypeScript i Vite. Projekt łączy prezentację umiejętności i realizacji z lokalnym generatorem briefu zlecenia, rozbudowanym systemem motywów oraz automatyczną publikacją na GitHub Pages.

## Najważniejsze funkcje

- polska i angielska wersja językowa,
- 16 pełnoprawnych motywów z zapisem preferencji,
- ustawienia animacji i płynnego przewijania,
- responsywny interfejs z obsługą klawiatury,
- projekty aktualizowane przez GitHub Actions,
- lokalny generator briefu zlecenia w formacie ZIP,
- SEO, Open Graph, Twitter Card, sitemap i własna strona 404,
- podstawowa obsługa instalacji i pracy offline,
- automatyczne kontrole jakości, Lighthouse oraz proces wydawania wersji.

## Formularz zlecenia

Formularz nie wysyła danych automatycznie na serwer. Dane są przetwarzane lokalnie w przeglądarce i zapisywane tymczasowo w `sessionStorage`.

Po przejściu wszystkich kroków użytkownik generuje paczkę:

```text
verminew-order-<ID>.zip
├── order.json
├── brief-pl.txt
├── brief-en.txt
├── README.txt
└── attachments/
```

Pobranie paczki nie oznacza wysłania zgłoszenia. Użytkownik sam dołącza ZIP do wiadomości e-mail.

## Wymagania

- Node.js 26,
- npm 11,
- system wspierany przez Vite i Sharp.

Zalecana konfiguracja jest zapisana w `.nvmrc`, `package.json` i workflowach GitHub Actions.

## Instalacja

```bash
git clone https://github.com/VermiNew/verminew.github.io.git
cd verminew.github.io
nvm use
npm ci
```

## Praca lokalna

```bash
npm run dev
```

Vite wyświetli adres lokalnego serwera w terminalu.

## Kontrola jakości

```bash
npm run lint
npm run typecheck
npm run test
npm run validate
npm run build
```

Pełna kontrola:

```bash
npm run verify
```

Podgląd produkcyjnego buildu:

```bash
npm run preview
```

## Skrypty

| Polecenie | Działanie |
|---|---|
| `npm run dev` | Uruchamia serwer developerski Vite. |
| `npm run clean` | Usuwa build, cache TypeScript i raporty tymczasowe. |
| `npm run assets` | Odtwarza zoptymalizowane grafiki i ikony. |
| `npm run assets:check` | Odtwarza grafiki i sprawdza, czy wygenerowane pliki są commitowane. |
| `npm run lint` | Uruchamia ESLint dla aplikacji i skryptów Node. |
| `npm run typecheck` | Sprawdza projekty TypeScript przez project references. |
| `npm run test` | Uruchamia testy domenowe i kontraktowe Node. |
| `npm run validate` | Sprawdza strukturę projektu, dane i konfigurację. |
| `npm run build` | Czyści projekt, sprawdza typy i tworzy build Vite. |
| `npm run verify` | Uruchamia pełny zestaw kontroli przed wydaniem. |
| `npm run preview` | Uruchamia lokalny podgląd katalogu `dist`. |

## Aktualizacja projektów

Dane projektów są generowane przez `.github/scripts/fetch-repos.js` i zapisywane do:

```text
public/data/repos.json
```

Workflow `.github/workflows/update-repos.yml`:

1. pobiera publiczne repozytoria właściciela,
2. odrzuca forki i archiwalne repozytoria,
3. normalizuje dane i technologie,
4. waliduje plik wynikowy,
5. tworzy commit tylko wtedy, gdy dane rzeczywiście się zmieniły,
6. jawnie uruchamia deployment GitHub Pages.

Skrypt można uruchomić ręcznie w GitHub Actions jako normalne wykonanie, wymuszoną aktualizację albo dry run.

## Struktura

```text
.github/                  workflowy i skrypty automatyzacji
public/                   statyczne dane, manifest, SEO i service worker
scripts/                  lokalne skrypty utrzymaniowe
src/components/           interfejs i sekcje strony
src/content/              kuratorowane treści projektów
src/context/              globalne ustawienia aplikacji
src/features/order/       model, walidacja i kroki formularza
src/hooks/                hooki aplikacyjne
src/locales/              tłumaczenia PL i EN
src/styles/               style globalne oraz 16 motywów
src/utils/                wspólne funkcje techniczne
tests/                    testy domenowe, kontraktowe i automatyzacji
```

## Deployment i wydania

- `quality.yml` sprawdza pull requesty i zmiany na `main`.
- `deploy.yml` buduje oraz publikuje GitHub Pages.
- `update-repos.yml` aktualizuje dane projektów.
- `release.yml` weryfikuje tag, buduje projekt i publikuje archiwum źródłowe.
- `dependabot.yml` grupuje aktualizacje npm i GitHub Actions.

Przed tagiem wydania należy przejść `RELEASE_CHECKLIST.md`.

## Licencja

Kod projektu jest udostępniany na zasadach określonych w pliku licencji repozytorium.

Zdjęcia, opisy osobiste i inne treści autorskie są © 2026 Michał Oślizło. Nie wolno ich kopiować ani rozpowszechniać bez zgody autora.
