# Changelog

Wszystkie istotne zmiany projektu są dokumentowane w tym pliku.

## [Unreleased]

Zmiany poniżej przygotowują kod źródłowy do wydania `1.0.0`. Wydanie nie jest ukończone, dopóki pełny `npm run verify`, kontrola przeglądarkowa i workflowy GitHub Actions nie przejdą na czystym checkoutcie.

### Added

- Node.js 26 i npm 11 jako jednoznaczne środowisko projektu.
- Pełny zestaw skryptów `clean`, `typecheck`, `test`, `validate`, `build` i `verify`.
- Testy domenowe formularza, motywów, danych projektów, automatyzacji GitHub i procesu wydania.
- Workflow quality, release, Dependabot oraz rzeczywiste progi Lighthouse.
- Lokalny generator briefu z czytelnymi plikami PL/EN i wersjonowanym payloadem.
- Walidacja i migracja szkiców formularza.
- Semantyczne tokeny kolorów dla wszystkich 16 motywów.
- Dynamiczne metadane PL/EN, social card, robots, sitemap i własna strona 404.
- Service worker z wersjonowaniem cache, offline fallbackiem i odrębną strategią dla danych projektów.
- Kuratorowane dwujęzyczne opisy wybranych projektów.
- Raporty wydania i plan małych commitów dla właściciela repozytorium.

### Changed

- TypeScript korzysta z prawidłowych project references i nie emituje plików pomocniczych obok źródeł.
- Formularz zlecenia został podzielony na mniejsze moduły i komponenty kroków.
- Dane formularza korzystają ze stabilnych identyfikatorów niezależnych od języka.
- Projekty są ładowane z bieżącego deploymentu i używają cache jako ostrzeżenia, a nie błędu krytycznego.
- Automatyzacja repozytoriów zapisuje plik atomowo, pomija forki i archiwalne repozytoria oraz jawnie uruchamia deployment.
- Workflowy regenerują grafiki i odrzucają wydanie, jeżeli wygenerowane assety nie są zsynchronizowane z repozytorium.
- Providerzy i definicje kontekstów zostały rozdzielone dla poprawnej pracy Fast Refresh.
- Sekcje poniżej pierwszego ekranu są ładowane progresywnie.
- Canvas Hero respektuje reduced motion, DPR, rozmiar kontenera i widoczność karty.
- Dokumentacja opisuje faktyczny przepływ ZIP → klient pocztowy użytkownika.

### Fixed

- `TS6310` dla referencjonowanego projektu `tsconfig.node.json`.
- Niepełny typ kontekstu animacji i niespójne ustawienia smooth scroll.
- Błędy walidacji kroków formularza, budżetu, zgody oraz załączników.
- Zmiana języka nie unieważnia wybranych wartości formularza.
- Cache projektów nie jest zasłaniany ekranem błędu.
- Nord i pozostałe ciemne motywy używają wspólnego wykrywania.
- Kolory tekstu, przycisków, statusów, focus ringów i overlayów korzystają z kontraktu motywu.
- Tooltip technologii, dialogi, regiony live i etykiety ARIA są dostępniejsze.
- GitHub Automation nie zależy od katalogu roboczego ani od statystyk popularności repozytoriów.
- Service worker nie zwraca dokumentu HTML jako fallbacku dla `repos.json`.
- Metadane i opis prywatności są spójne z rzeczywistym kodem.
- Nawigacja do odroczonych sekcji działa również z linków kotwicowych i przy bezpośrednim wejściu z hashem.
- Błąd opcjonalnego załącznika nie blokuje formularza, a nazwy plików w ZIP są bezpieczne i unikalne.
- Generator projektów zachowuje repozytorium przy chwilowym błędzie danych językowych i odrzuca niebezpieczne adresy URL.
- Menu mobilne ma dostępny przycisk zamknięcia wewnątrz pułapki fokusu, a wspólny przycisk nie wysyła formularzy bez jawnego `type="submit"`.

### Removed

- Niedokończony moduł bloga i mockowane GitHub Discussions.
- Pusty komponent odświeżenia oraz nieużywany modal regulaminu.
- Nieużywane domyślne assety Vite i duże grafiki źródłowe publikowane w `public`.
- Śledzone pliki `.tsbuildinfo` i inne artefakty kompilatora.
- Odrzucone pomysły produktowe z planu oraz dokumentacji.
- Prezentacja gwiazdek i forków repozytoriów w interfejsie i danych automatyzacji.
