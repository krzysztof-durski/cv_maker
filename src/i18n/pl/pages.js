// Polski tekst stron: Pomoc, O projekcie, Regulamin, Prywatność.
// Struktura (sekcje i bloki) musi być taka sama jak w ../en/pages.js — pilnuje tego test.
// Znaczniki w tekście: **pogrubienie**, *kursywa*, `kod`, [tekst](link).

export default {
  pages: {
    updatedLabel: 'Ostatnia aktualizacja',
    help: {
      title: 'Pomoc i poradnik',
      subtitle: 'Wszystko, co trzeba wiedzieć, by stworzyć świetne CV.',
      sections: [
        { title: 'Na początek', blocks: [{ ol: [
          'Uzupełnij **Dane osobowe** — imię i nazwisko, e-mail, telefon, LinkedIn, GitHub i lokalizację.',
          'W panelu **Sekcje** włączaj i wyłączaj sekcje oraz przeciągaj je, by zmienić kolejność.',
          'Wypełnij każdą włączoną sekcję. Kliknij przycisk **?** w nagłówku sekcji, aby zobaczyć wskazówki dla niej.',
          'Na komputerze podgląd na żywo aktualizuje się obok edytora; na telefonie przełącz się na kartę **Podgląd**.',
        ] }] },
        { title: 'Język', blocks: [
          { p: 'Przełącznik **EN / PL** w nagłówku zmienia język aplikacji. Przy pierwszej wizycie aplikacja używa języka Twojej przeglądarki.' },
          { p: 'Ustawienie **Język CV** na karcie Szablon jest osobne: określa język nagłówków drukowanych na CV (Doświadczenie, Wykształcenie, „Obecnie”…) w podglądzie, w pliku PDF i w pliku Word. Domyślnie podąża za językiem aplikacji, ale możesz korzystać z aplikacji po polsku i mimo to drukować CV po angielsku — albo odwrotnie.' },
          { note: 'Tekst, który wpisujesz, nigdy nie jest tłumaczony automatycznie. Aby go przetłumaczyć, użyj gotowego polecenia **Przetłumacz** w asystencie AI.' },
          { p: 'Gdy AI pisze lub tłumaczy po polsku, opisuje Twoją pracę w pierwszej osobie („Founded and developed X” to „Założyłem i rozwijałem X”). Polskie czasowniki zmieniają się z rodzajem, więc wybierz **Formy gramatyczne w polskim tekście** na karcie Szablon: męskie („założyłem”), żeńskie („założyłam”) albo *Wykryj z mojego tekstu*, które bierze formy z tego, co już napisano, i nigdy nie zgaduje po imieniu.' },
        ] },
        { title: 'Zapisywanie pracy', blocks: [{ ul: [
          'Twoje CV jest **zapisywane automatycznie** w tej przeglądarce — przetrwa odświeżenie strony i ponowne uruchomienie przeglądarki.',
          'Otwórz **menu ⋯** w nagłówku i wybierz **Zapisz kopię zapasową**, aby pobrać plik `.json`, który możesz bezpiecznie przechowywać lub przenieść na inne urządzenie.',
          'Wybierz **Przywróć kopię zapasową**, aby wczytać wcześniej zapisany plik — przydaje się przy zmianie urządzenia lub przeglądarki.',
        ] }] },
        { title: 'Cofanie i ponawianie', blocks: [{ p: 'Użyj **strzałek wstecz i dalej** w nagłówku (albo **Ctrl/Cmd+Z** i **Ctrl/Cmd+Shift+Z**, gdy nie piszesz w żadnym polu), aby przejść przez swoje zmiany — także te wprowadzone przez AI, przywrócenie kopii zapasowej i wczytanie CV domyślnego. Pisanie jest grupowane, więc jeden krok cofa serię pisania, a nie pojedynczą literę. Historia trwa do zamknięcia lub odświeżenia strony.' }] },
        { title: 'CV domyślne do dopasowanych wersji', blocks: [
          { p: 'Trzymaj jedno kompletne, ogólne CV i dopasowuj jego kopię do każdej oferty. Otwórz **menu ⋯** i wybierz **Zapisz jako CV domyślne**, aby zapisać edytowane CV jako domyślne. Gdy zaczynasz nową aplikację, wybierz **Wczytaj CV domyślne**, a potem dopasuj je ręcznie lub z pomocą asystenta AI. Dopasowywanie nigdy nie zmienia zapisanego CV domyślnego; ponowne zapisanie je zastępuje.' },
          { note: 'Tak jak wszystko inne jest przechowywane tylko w tej przeglądarce. Użyj **Zapisz kopię zapasową**, aby zachować kopię bieżącego CV jako plik; CV domyślne nie wchodzi do kopii zapasowych.' },
        ] },
        { title: 'Eksport do PDF', blocks: [
          { ol: [
            'Kliknij **Zapisz PDF** w nagłówku.',
            'W oknie drukowania ustaw miejsce docelowe na **Zapisz jako PDF**.',
            'Ustaw marginesy na **Brak** — aplikacja sama zadba o marginesy.',
            'Kliknij Zapisz. Otrzymasz czysty, poprawnie sformatowany plik PDF w formacie A4.',
          ] },
          { note: 'Wskazówka: do najlepszych efektów użyj Chrome lub Edge. Safari może nieco inaczej wyświetlać czcionki.' },
        ] },
        { title: 'Eksport do Worda (.docx)', blocks: [{ p: 'Wolisz edytować w Microsoft Word lub Dokumentach Google? Otwórz menu ⋯ i wybierz **Eksportuj do Worda (.docx)**. Powstanie plik `.docx` w stylu Harvard z takim samym układem, czcionkami i sekcjami jak w podglądzie — otwórz go w Wordzie albo wgraj na Dysk Google i otwórz w Dokumentach Google. Tworzony jest w całości w Twojej przeglądarce, tak samo jak PDF.' }] },
        { title: 'Wskazówki do sekcji', blocks: [{ p: 'Każda sekcja w edytorze ma w nagłówku mały przycisk **?**. Kliknij go, aby zobaczyć porady dla tej sekcji — co zawrzeć, jak to sformułować i na co naprawdę patrzą rekruterzy.' }] },
        { title: 'Dopasowywanie i edycja CV z pomocą AI (opcjonalnie)', blocks: [
          { p: 'Możesz użyć własnego konta OpenAI (ChatGPT), Anthropic (Claude) lub Google (Gemini), aby przepisać części CV albo dopasować je do konkretnej oferty. To całkowicie opcjonalne i nic się nie dzieje, dopóki nie dodasz klucza.' },
          { ol: [
            'Kliknij **AI** w nagłówku, przycisk **AI** przy sekcji albo małe **✨** przy pojedynczej pracy, projekcie lub innym wpisie i wybierz **Dodaj klucz API**.',
            'Wybierz dostawcę, wklej klucz z panelu tego dostawcy i naciśnij **Sprawdź klucz i wczytaj modele**. Wybierz model.',
            'Wybierz, nad czym ma pracować AI (całe CV, jedna sekcja albo jedna praca lub projekt), a potem wybierz **gotowe polecenie**, np. „Dopasuj do tej oferty”, albo napisz własne. Możesz wkleić opis stanowiska lub dołączyć go jako plik PDF, Word, tekstowy lub HTML.',
            'Naciśnij **Pokaż propozycje**, a następnie zaznacz zmiany, które chcesz wprowadzić. Nic się nie zmieni, dopóki nie naciśniesz **Zastosuj**, a potem pojawi się przycisk **Cofnij**.',
          ] },
          { ul: [
            'Twój klucz zostaje w przeglądarce i jest wysyłany tylko do wybranego dostawcy. Domyślnie jest zapominany po zamknięciu karty; zaznacz **Zapamiętaj mój klucz na tym urządzeniu**, aby go zachować (nie na wspólnych komputerach).',
            'Dostawca nalicza opłaty na Twoim koncie. Zapytanie z całym CV jest zwykle małe, ale sprawdź cennik swojego dostawcy.',
            'AI potrafi przepisywać i zmieniać kolejność tekstu, **usuwać zduplikowane wpisy** i **przenosić wpis do właściwej sekcji**. Nie może zmieniać Twoich danych kontaktowych ani pracodawcy, uczelni, dat czy linków istniejącego wpisu. Wszystko nowe, co doda, jest oznaczone do sprawdzenia.',
            'Gdy dopasowujesz CV do oferty, **Twoje stanowisko staje się dokładną nazwą stanowiska** z opisu oferty (lub z tego, co napisano). AI nie może wymyślić innej.',
            'Każda zmiana ma własne pole wyboru, więc możesz przyjąć przepisanie, a odrzucić usunięcie. Przeniesienie między sekcjami przyjmuje się lub odrzuca w całości.',
            'Po pierwszej odpowiedzi możesz **rozmawiać dalej**: zapytać, dlaczego coś zmieniono, albo napisać, co poprawić (na przykład „skróć punkty w Initech”). Propozycje zostają na ekranie, możesz zamknąć okno i wrócić, a nieudana wiadomość nigdy ich nie kasuje. Odznaczone zmiany są odrzucane po wysłaniu następnej wiadomości.',
            'Liczby lub pracodawcy, które wprowadza AI, a których nie ma w Twoim CV ani w tym, co podano, są oznaczane ostrzeżeniem. Zawsze sprawdź, czy sformułowanie jest prawdziwe, zanim je zastosujesz.',
            'AI odpowiada Ci w języku aplikacji, a tekst Twojego CV zostawia w języku, w którym został napisany.',
          ] },
        ] },
        { title: 'Jeśli AI pisze, że jest zajęte lub ma problem', blocks: [
          { p: 'Komunikaty typu *„Google jest teraz zajęte”* albo *„Model jest przeciążony”* oznaczają, że dostawca nie może w tej chwili przyjąć Twojego zapytania. To nie jest problem z Twoim kluczem ani z CV.' },
          { component: 'busyAdvice' },
          { note: 'Błędy dotyczące **klucza** lub **limitu** są inne: wymagają nowego klucza albo większego salda w panelu dostawcy, a ponawianie nie pomoże.' },
        ] },
        { title: 'Szablony i zdjęcie', blocks: [
          { p: 'Karta **Szablon** na górze edytora przełącza układ nagłówka. **Klasyczny** to prosty, wyśrodkowany nagłówek. **Ze zdjęciem** umieszcza Twoje zdjęcie po lewej, a obok imię, nazwisko i dane kontaktowe; wybierz **Wgraj zdjęcie**, a zdjęcie zostanie przycięte do kwadratu ze środka. Ten sam układ jest użyty w PDF i w eksporcie do Worda.' },
          { note: 'Zdjęcie zostaje w tej przeglądarce, jest zawarte w pliku kopii zapasowej i nigdy nie jest wysyłane do dostawcy AI. Wielu pracodawców (i systemy ATS) woli CV bez zdjęcia, więc sprawdź, co jest przyjęte w danym kraju i na danym stanowisku.' },
        ] },
        { title: 'Więcej miejsca do pisania', blocks: [{ p: 'Na ekranie komputera przeciągnij cienki pasek między edytorem a podglądem, aby poszerzyć edytor (kliknij go dwukrotnie, aby przywrócić domyślną szerokość). Gdy pasek jest zaznaczony, możesz też użyć strzałek w lewo i w prawo. Pola tekstowe rosną podczas pisania, więc zawsze widzisz wszystko, co wpisano.' }] },
        { title: 'Pozostałe funkcje', blocks: [{ ul: [
          '**↺ Wyczyść** w nagłówku sekcji opróżnia tylko tę sekcję, po potwierdzeniu.',
          '**Usuń wszystkie dane** w menu ⋯ czyści całe Twoje CV po potwierdzeniu — nieodwracalnie.',
          'Przycisk **słońca / księżyca** przełącza ciemny motyw. Twój wybór jest zapamiętywany.',
          'Użyj przycisków powiększenia w prawym dolnym rogu podglądu, aby przyjrzeć się szczegółom lub zmieścić więcej na ekranie.',
          'Pola dat przyjmują dowolny tekst — spróbuj „Obecnie”, „Planowo cze 2027” albo samego „2023”.',
          '**Sekcję własną** można przemianować — przydaje się na Publikacje, Badania, Nagrody itd.',
        ] }] },
        { title: 'Jak pisać dobre punkty', blocks: [{ ul: [
          'Zacznij od mocnego czasownika: *Zbudowano, Skrócono, Poprowadzono, Wdrożono, Zaprojektowano, Zwiększono.*',
          'Trzymaj się wzoru: **Działanie + co + efekt**. Np. „Skrócono opóźnienie API o 40% dzięki cache’owaniu często odpytywanych endpointów.”',
          'Podawaj liczby wszędzie, gdzie się da — procenty, liczbę użytkowników, zaoszczędzony czas, wygenerowany przychód.',
          'Celuj w 2–4 punkty na stanowisko lub projekt. Jakość jest ważniejsza niż ilość.',
          'Unikaj ogólnikowych zapychaczy typu „odpowiadałem za” czy „wspierałem”.',
        ] }] },
        { title: 'Potrzebujesz jeszcze pomocy?', divider: true, blocks: [{ p: 'Jeśli coś nie działa albo masz sugestię, napisz na [contact@codepapa.xyz](mailto:contact@codepapa.xyz). Czytam każdą wiadomość.' }] },
      ],
    },

    about: {
      title: 'O tym projekcie',
      subtitle: 'Powstał ze złości. Pozostaje darmowy z zasady.',
      sections: [
        { title: 'Problem', blocks: [
          { p: 'Pewnie to znasz. Spędzasz 45 minut na starannym wypełnianiu CV na jednej z tych „darmowych” stron do tworzenia CV — formatujesz, dopracowujesz punkty, wybierasz układ. Wygląda świetnie. Klikasz **Pobierz**.' },
          { p: 'A potem: *„Przejdź na Premium, aby wyeksportować CV — od 9,99 USD miesięcznie.”*' },
          { p: 'Twoje dane są zakładnikiem. Cała ta strona była lejkiem sprzedażowym. Byłem w tej sytuacji nie raz i za każdym razem czułem się oszukany. Czas poszedł na marne i teraz albo zapłacisz, albo zaczniesz od nowa gdzie indziej.' },
        ] },
        { title: 'Dlaczego to zrobiłem', blocks: [
          { p: 'Jestem [Krzysztof Durski](https://codepapa.xyz) i stworzyłem CV Maker, bo miałem tego dość. Kreator CV nie jest skomplikowanym produktem. Nie potrzebuje backendu. Nie potrzebuje konta. Nie potrzebuje Twojej karty kredytowej.' },
          { p: 'Więc zrobiłem taki, który działa w całości w Twojej przeglądarce, zapisuje dane lokalnie i pozwala eksportować do PDF za darmo — zawsze — za pomocą funkcji drukowania, która jest już wbudowana w każdą przeglądarkę na świecie.' },
          { p: 'Żadnych kont. Żadnych subskrypcji. Żadnego poziomu „premium”. Żadnych sztuczek.' },
        ] },
        { title: 'Co go wyróżnia', blocks: [{ ul: [
          '**Naprawdę darmowy.** Eksportuj do PDF ile razy chcesz. Żadnego paywalla, nigdy.',
          '**Twoje dane zostają Twoje.** Wszystko jest przechowywane w localStorage Twojej przeglądarki. Nic nie jest wysyłane na żaden nasz serwer.',
          '**Przynieś własne AI.** Opcjonalnie dopasuj i edytuj CV za pomocą własnego klucza OpenAI, Claude lub Gemini. Łączy się bezpośrednio z Twojej przeglądarki z wybranym dostawcą, a każdą zmianę przeglądasz przed jej zastosowaniem.',
          '**Bez konta.** Otwórz stronę i zacznij pisać.',
          '**Styl Harvard.** Czysty, profesjonalny, powszechnie akceptowany format używany przez czołowe uczelnie i pracodawców.',
          '**Polski i angielski.** Przełączaj aplikację między językami i drukuj CV z polskimi lub angielskimi nagłówkami.',
          '**Kopia zapasowa i przywracanie.** Pobierz dane CV jako plik JSON i przywróć je na dowolnym urządzeniu lub w dowolnej przeglądarce.',
          '**Otwarcie i uczciwie.** Bez ciemnych wzorców, ukrytych opłat i wciskania dodatków.',
        ] }] },
        { title: 'Technologia', blocks: [{ p: 'Zbudowany w React, Vite i Tailwind CSS. Hostowany na Cloudflare Pages. Eksport do PDF korzysta z natywnego okna drukowania Twojej przeglądarki — bez zewnętrznych bibliotek, bez renderowania po stronie serwera, bez znaków wodnych.' }] },
        { divider: true, blocks: [{ note: 'Jeśli to uchroniło Cię przed kolejnym paywallem, cieszę się. Jeśli chcesz zobaczyć więcej takich projektów, odwiedź [codepapa.xyz](https://codepapa.xyz).' }] },
      ],
    },

    terms: {
      title: 'Regulamin',
      updated: 'październik 2026',
      sections: [
        { title: '1. O usłudze', blocks: [{ p: 'CV Maker to darmowe narzędzie działające w przeglądarce, które pozwala tworzyć CV w stylu Harvard. Nie ma kont, subskrypcji ani żadnych naszych serwerów — wszystko działa w Twojej przeglądarce. Opcjonalny asystent AI może łączyć się z wybranym przez Ciebie dostawcą AI bezpośrednio z Twojej przeglądarki (zob. punkt 3).' }] },
        { title: '2. Twoje dane', blocks: [{ p: 'Wszystkie wprowadzone dane CV są przechowywane wyłącznie w `localStorage` Twojej przeglądarki. Nigdy ich nie otrzymujemy, nie zapisujemy w żadnej bazie danych ani nie udostępniamy osobom trzecim. Jedyna droga, którą jakiekolwiek z nich opuszczają Twoją przeglądarkę, to skorzystanie z opcjonalnego asystenta AI. Wyczyszczenie danych lub pamięci przeglądarki trwale usunie Twoje CV.' }] },
        { title: '3. Opcjonalny asystent AI', blocks: [
          { p: 'Asystent AI działa wyłącznie z kluczem API, który sam podasz, od OpenAI, Anthropic lub Google. Gdy z niego korzystasz, Twoja przeglądarka wysyła istotne części CV i wszystko, co dołączysz, prosto do tego dostawcy. Korzystając z asystenta, zgadzasz się, że:' },
          { ul: [
            'odpowiadasz za swój klucz API, za wszelkie opłaty na koncie u dostawcy i za przestrzeganie jego warunków;',
            'wynik AI może być błędny, zmyślony lub źle sformułowany — każdą propozycję musisz sprawdzić przed zastosowaniem i przed wysłaniem CV komukolwiek;',
            'nie użyjesz go do zmyślania kwalifikacji, pracodawców, dat ani innych faktów o sobie;',
            'nie będziesz przesyłać danych osobowych innych osób, jeśli nie masz do tego prawa;',
            'nie kontrolujemy i nie odpowiadamy za to, jak dostawca postępuje z wysłanymi przez Ciebie danymi.',
          ] },
        ] },
        { title: '4. Brak gwarancji', blocks: [{ p: 'To narzędzie jest udostępniane „tak jak jest”, bez jakiejkolwiek gwarancji. Nie gwarantujemy, że usługa będzie działać nieprzerwanie i bez błędów ani że Twoje zapisane dane zostaną zachowane po aktualizacjach przeglądarki lub zmianie urządzenia. Zawsze trzymaj kopię danych CV w innym miejscu.' }] },
        { title: '5. Dozwolone użycie', blocks: [
          { p: 'Możesz używać CV Maker do tworzenia i eksportowania własnego CV w celach osobistych, naukowych lub zawodowych. Nie wolno używać tego narzędzia do:' },
          { ul: [
            'fałszowania lub przedstawiania w fałszywym świetle swoich kwalifikacji, dokumentów lub doświadczenia',
            'tworzenia sfałszowanych dokumentów mających wprowadzić w błąd pracodawców lub instytucje',
            'podszywania się pod inną osobę',
          ] },
          { p: 'Ponosisz wyłączną odpowiedzialność za prawdziwość i legalność tworzonych treści.' },
        ] },
        { title: '6. Własność intelektualna', blocks: [{ p: 'Treść tworzonego CV należy w całości do Ciebie. Nie rościmy sobie praw do niczego, co napiszesz. Kod aplikacji i projekt CV Maker są © {year} Krzysztof Durski, wszelkie prawa zastrzeżone.' }] },
        { title: '7. Zmiany regulaminu', blocks: [{ p: 'Możemy od czasu do czasu aktualizować niniejszy regulamin. Dalsze korzystanie z usługi po wprowadzeniu zmian oznacza akceptację zaktualizowanego regulaminu.' }] },
      ],
    },

    privacy: {
      title: 'Polityka prywatności',
      updated: 'październik 2026',
      sections: [
        { title: 'W skrócie', blocks: [{ lead: 'Nie zbieramy absolutnie niczego. Twoje dane zostają w Twojej przeglądarce — chyba że zdecydujesz się użyć opcjonalnego asystenta AI; wtedy wysyłany tekst trafia prosto z Twojej przeglądarki do wybranego dostawcy AI, nigdy przez nas.' }] },
        { title: '1. Brak zbierania danych', blocks: [{ p: 'CV Maker nie zbiera, nie przechowuje, nie przesyła ani nie przetwarza żadnych danych osobowych. Po naszej stronie nie ma skryptów analitycznych, pikseli śledzących, usług raportowania błędów ani integracji z podmiotami trzecimi. Aplikacja jest stroną statyczną bez backendu. Jedynym wyjątkiem jest opcjonalny asystent AI, nad którym masz kontrolę i który opisano w punkcie 5.' }] },
        { title: '2. Pamięć lokalna', blocks: [
          { p: 'Dane Twojego CV są zapisywane w `localStorage` Twojej przeglądarki pod kluczem `cv_maker_data`. Ta pamięć jest lokalna dla Twojego urządzenia i przeglądarki — to nie jest plik cookie, nie jest synchronizowana i nikt poza Tobą na Twoim urządzeniu nie może jej odczytać.' },
          { p: 'Jeśli dodasz zdjęcie, jego mała, kwadratowa kopia jest przechowywana w danych Twojego CV, więc wchodzi też do pliku kopii zapasowej. Nigdy nie jest nigdzie wysyłane ani przekazywane dostawcy AI. Szerokość panelu edytora jest zapisywana pod kluczem `cv_maker_editor_width`, a wybrany język pod kluczem `cv_maker_language`.' },
          { p: 'Jeśli zapiszesz CV domyślne, jego kopia jest przechowywana w taki sam sposób pod kluczem `cv_maker_master`.' },
          { p: 'Jeśli korzystasz z asystenta AI, wybrany dostawca, model i klucz API są przechowywane pod osobnymi kluczami zaczynającymi się od `cv_maker_ai_`. Domyślnie klucz znajduje się w `sessionStorage` i jest zapominany po zamknięciu karty; w `localStorage` jest zapisywany tylko wtedy, gdy zaznaczysz „Zapamiętaj mój klucz na tym urządzeniu”. Te ustawienia nigdy nie wchodzą do plików kopii zapasowych.' },
        ] },
        { title: '3. Brak plików cookie', blocks: [{ p: 'Nie ustawiamy żadnych plików cookie. `localStorage` nie jest plikiem cookie — to mechanizm pamięci przeglądarki, który trwa, dopóki go nie wyczyścisz. Nie wygasa automatycznie i nie jest wysyłany na żaden serwer wraz z zapytaniami.' }] },
        { title: '4. Analityka', blocks: [{ p: 'Ta strona korzysta z **Cloudflare Web Analytics**, aby liczyć odwiedziny i poznawać ogólne wzorce użycia (np. liczbę odwiedzających, kraje, typy urządzeń). Cloudflare Web Analytics nie używa plików cookie, nie śledzi osób, nie buduje profili ani nie udostępnia danych reklamodawcom. Nie są zbierane żadne dane osobowe. Szczegóły w [polityce prywatności Cloudflare](https://www.cloudflare.com/privacypolicy/).' }] },
        { title: '5. Opcjonalny asystent AI', blocks: [
          { p: 'Asystent AI jest wyłączony, dopóki nie dodasz własnego klucza API od OpenAI, Anthropic lub Google. Gdy poprosisz go o propozycje, Twoja przeglądarka wysyła bezpośrednio do wybranego dostawcy, z użyciem Twojego klucza, następujące dane:' },
          { ul: [
            'sekcje CV istotne dla Twojego polecenia (Twoje dane kontaktowe i zdjęcie nie są dołączane),',
            'Twoje polecenie (a w dłuższej rozmowie także Twoje wcześniejsze wiadomości i odpowiedzi AI) oraz',
            'wklejony lub dołączony opis stanowiska albo tekst z pliku.',
          ] },
          { p: 'Ten ruch nie przechodzi przez żaden nasz serwer; nigdy nie widzimy Twojego klucza, Twojego CV ani odpowiedzi AI. Dostawca przetwarza te dane zgodnie z własnym regulaminem i polityką prywatności ([OpenAI](https://openai.com/policies/privacy-policy), [Anthropic](https://www.anthropic.com/legal/privacy), [Google](https://policies.google.com/privacy)), a koszty są naliczane na Twoim koncie. Dołączone pliki są odczytywane w Twojej przeglądarce; wysyłany jest tylko ich tekst. Nie korzystaj z asystenta, jeśli nie chcesz udostępniać tych treści dostawcy.' },
        ] },
        { title: '6. Jak usunąć swoje dane', blocks: [
          { p: 'Wszystkie dane CV możesz usunąć w dowolnej chwili na kilka sposobów:' },
          { ul: [
            '**Przycisk resetu:** kliknij „Usuń wszystkie dane” w menu w nagłówku aplikacji i potwierdź okno dialogowe. Natychmiast usunie to wszystkie dane, łącznie z zapisanym kluczem API do AI, i wyczyści formularz.',
            '**Tylko klucz AI:** otwórz „Ustawienia AI i klucz API” w menu w nagłówku i wybierz „Usuń klucz”.',
            '**Narzędzia deweloperskie przeglądarki:** otwórz DevTools → karta Application → Local Storage → wybierz tę stronę → usuń klucze `cv_maker_data` i `cv_maker_master` oraz wszystkie klucze zaczynające się od `cv_maker_ai_`.',
            '**Ustawienia przeglądarki:** wyczyść dane witryn dla tej domeny w ustawieniach prywatności/bezpieczeństwa przeglądarki.',
          ] },
        ] },
        { title: '7. Hosting', blocks: [{ p: 'Ta strona jest hostowana w Cloudflare Pages. Cloudflare może zapisywać standardowe logi dostępu serwera (adres IP, ścieżkę żądania, znaczniki czasu) w ramach swojej infrastruktury. Nie mamy dostępu do tych logów ani wpływu na nie. Szczegóły dotyczące postępowania z danymi znajdziesz w polityce prywatności Cloudflare.' }] },
      ],
    },
  },
}
