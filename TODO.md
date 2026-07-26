# VermiNew — plan stabilizacji i wydania

Dokument obejmuje wyłącznie istniejący zakres produktu oraz prace potrzebne do utrzymania wersji 1.x. Ukończone zmiany są przenoszone do `CHANGELOG.md` i raportów wdrożenia.

## Teraz — przed oznaczeniem wydania

- [ ] Uruchomić `npm ci` na czystym checkoutcie z Node.js 26 i npm 11.
- [ ] Potwierdzić `npm run verify` bez błędów i ostrzeżeń.
- [ ] Uruchomić produkcyjny podgląd i przejść kontrolę wizualną desktop/mobile.
- [ ] Przejść pełny formularz zlecenia w języku polskim i angielskim.
- [ ] Sprawdzić każdy z 16 motywów: tekst, przyciski, focus, dialogi i formularz.
- [ ] Sprawdzić obsługę klawiatury, Escape, focus trap i reduced motion.
- [ ] Uruchomić workflow aktualizacji projektów w trybie dry run oraz normalnym.
- [ ] Potwierdzić wdrożenie aktualnego `repos.json` na GitHub Pages.
- [ ] Zweryfikować social preview oraz metadane PL/EN na publicznym adresie.
- [ ] Przejść checklistę `RELEASE_CHECKLIST.md`.

## Następne — utrzymanie wersji 1.x

- [ ] Uzupełniać ręczne opisy PL/EN najważniejszych projektów.
- [ ] Okresowo sprawdzać kontrast po zmianach w motywach.
- [ ] Monitorować rozmiar bundla i wyniki Lighthouse.
- [ ] Aktualizować zależności wyłącznie po przejściu pełnej weryfikacji.
- [ ] Rozszerzać testy regresji przy każdej naprawie błędu formularza.
- [ ] Przeglądać politykę prywatności po zmianie przepływu danych.

## Zasady realizacji

Każda zmiana powinna być mała, odwracalna i zakończona:

```bash
npm run lint
npm run typecheck
npm run test
npm run validate
npm run build
```

Zmiany interfejsu wymagają również kontroli wizualnej i klawiaturowej. Commit tworzy właściciel repozytorium dopiero po zaakceptowaniu wyniku.
