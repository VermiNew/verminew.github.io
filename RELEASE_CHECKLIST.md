# VermiNew 1.0 — checklista wydania

## A. Źródła i środowisko

- [x] `.nvmrc` wskazuje Node.js 26.
- [x] `package.json` określa Node.js 26, npm 11 i `npm@11.17.0`.
- [x] `package.json` oraz `package-lock.json` mają wersję `1.0.0`.
- [x] `package-lock.json` jest przeznaczony do commita właściciela repozytorium.
- [x] Build cache, `dist`, raporty testowe i pliki tymczasowe są ignorowane.
- [ ] `npm ci` przechodzi na czystym checkoutcie.

## B. Kontrola jakości

- [x] Testy domenowe i kontraktowe Node przechodzą lokalnie.
- [x] Walidator projektu przechodzi lokalnie.
- [x] Składnia TypeScript/TSX i lokalne importy zostały sprawdzone niezależnie.
- [ ] `npm run lint` przechodzi na kompletnej instalacji.
- [ ] `npm run typecheck` przechodzi z rzeczywistymi typami zależności.
- [ ] `npm run build` tworzy produkcyjny `dist`.
- [ ] `npm run verify` przechodzi w całości.
- [ ] Po buildzie `git status --short` nie pokazuje nowych artefaktów.

## C. Formularz zlecenia

- [x] Dane przechowują stabilne identyfikatory opcji.
- [x] Szkic ma wersję schematu i walidację runtime.
- [x] Załączniki mają walidację typu, rozmiaru i duplikatów.
- [x] JSZip jest ładowany dynamicznie.
- [x] Payload ma stabilne ID, `createdAt`, `updatedAt` i wersję aplikacji.
- [x] Interfejs informuje, że pobranie ZIP nie oznacza wysłania zgłoszenia.
- [ ] Przejść wszystkie kroki w języku polskim.
- [ ] Przejść wszystkie kroki w języku angielskim.
- [ ] Zmienić język w trakcie wypełniania i potwierdzić zachowanie danych.
- [ ] Sprawdzić przywrócenie, wyczyszczenie i odrzucenie uszkodzonego szkicu.
- [ ] Sprawdzić poprawne oraz odrzucone załączniki.
- [ ] Otworzyć wygenerowany ZIP i zweryfikować każdy plik.
- [ ] Potwierdzić poprawny adres, temat i treść `mailto:`.

## D. Projekty i GitHub Automation

- [x] Runtime pobiera `/data/repos.json` z bieżącego deploymentu.
- [x] Cache jest osobnym stanem ostrzeżenia.
- [x] Generator odrzuca forki i archiwalne repozytoria.
- [x] Generator nie korzysta ze statystyk popularności.
- [x] Ścieżka wyjściowa nie zależy od `cwd`.
- [x] Zapis jest atomowy i nie zmienia timestampu bez zmiany danych.
- [x] Commit automatyzacji obejmuje wyłącznie `public/data/repos.json`.
- [x] Deployment jest jawnie uruchamiany przez `repository_dispatch`.
- [ ] Uruchomić workflow jako dry run.
- [ ] Uruchomić wymuszoną aktualizację danych.
- [ ] Potwierdzić commit bota i późniejszy deployment Pages.
- [ ] Potwierdzić aktualną datę `lastUpdated` na publicznej stronie.

## E. Motywy i dostępność

- [x] Wszystkie 16 motywów spełnia kontrakt tokenów.
- [x] Automatyczne testy sprawdzają czytelne kolory semantyczne.
- [x] Nord jest poprawnie klasyfikowany jako ciemny motyw.
- [x] Dialogi korzystają z focus trap, Escape i scroll lock.
- [x] Tooltip technologii jest dostępny klawiaturą.
- [x] Region wyników projektów jest dostępny dla czytników ekranu.
- [ ] Sprawdzić każdy motyw na desktopie.
- [ ] Sprawdzić każdy motyw na urządzeniu mobilnym.
- [ ] Przejść stronę tylko klawiaturą.
- [ ] Potwierdzić widoczność focusu na wszystkich elementach interaktywnych.
- [ ] Sprawdzić tryb systemowy, pełne i ograniczone animacje.
- [ ] Sprawdzić powiększenie 200% i reflow bez poziomego scrolla.

## F. SEO, PWA i wydajność

- [x] Metadane PL/EN, canonical, hreflang, Open Graph i JSON-LD są obsługiwane.
- [x] Social card ma 1200 × 630 px.
- [x] Istnieją `robots.txt`, `sitemap.xml` oraz `404.html`.
- [x] Manifest ma osobne ikony maskable.
- [x] Service worker ma wersjonowany cache i osobny fallback JSON.
- [x] Produkcyjne assety mają hashe.
- [ ] Sprawdzić instalację aplikacji w obsługiwanej przeglądarce.
- [ ] Sprawdzić pierwszą instalację, aktualizację service workera i czyszczenie starego cache.
- [ ] Sprawdzić nawigację offline oraz cache `repos.json`.
- [ ] Potwierdzić social preview przez zewnętrzne debugery.
- [ ] Potwierdzić progi Lighthouse na publicznym wdrożeniu.

## G. GitHub Actions i wydanie

- [x] Workflowy używają `.nvmrc` i `npm ci`.
- [x] Nie jest cache’owany `node_modules`.
- [x] Quality workflow sprawdza PR oraz `main`.
- [x] Release workflow porównuje tag z wersją pakietu i lockfile.
- [ ] Wypchnąć gałąź roboczą i potwierdzić zielony quality workflow.
- [ ] Wdrożyć release candidate na GitHub Pages.
- [ ] Przejść kontrolę Chrome, Firefox, Edge oraz mobile.
- [ ] Uzupełnić datę wydania w `CHANGELOG.md`.
- [ ] Właściciel tworzy finalne commity.
- [ ] Właściciel tworzy tag `v1.0.0` i GitHub Release.
