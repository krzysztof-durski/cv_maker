// Polski tekst interfejsu: powłoka aplikacji, edytor i napisy drukowane na samym CV.
// Struktura kluczy musi być taka sama jak w ../en/ui.js (pilnuje tego test).

export default {
  meta: {
    title: 'CV Maker — styl Harvard',
    description: 'Stwórz CV w stylu Harvard online. Za darmo, prywatnie, bez konta — Twoje dane zostają w przeglądarce, a opcjonalnie pomoże Ci AI z użyciem własnego klucza API.',
  },

  lang: {
    label: 'Język',
    names: { en: 'angielski', pl: 'polski' }, // nazwy języków w tym języku interfejsu (po „na język …”)
  },

  common: {
    close: 'Zamknij',
    done: 'Gotowe',
    show: 'Pokaż',
    hide: 'Ukryj',
  },

  nav: {
    help: 'Pomoc i poradnik',
    about: 'O projekcie',
    terms: 'Regulamin',
    privacy: 'Prywatność',
    home: 'Strona główna',
    helpShort: 'Pomoc',
    backToEditor: '← Wróć do edytora',
  },

  app: {
    resetConfirm: 'To trwale usunie wszystkie dane Twojego CV, zapisane CV domyślne oraz zapisany klucz API do AI i nie będzie można tego cofnąć. Czy na pewno?',
    replaceDefaultConfirm: 'Zastąpić zapisane CV domyślne CV, które właśnie edytujesz?',
    saveDefaultFailed: 'Nie udało się zapisać CV domyślnego: pamięć przeglądarki jest pełna lub zablokowana.',
    loadDefaultConfirm: 'Zastąpić edytowane CV zapisanym CV domyślnym? Obecne zmiany przepadną, jeśli wcześniej nie zapiszesz kopii zapasowej.',
    uploadConfirm: 'To zastąpi obecne dane CV danymi z wczytanego pliku. Kontynuować?',
    uploadInvalid: 'Nieprawidłowy plik — wczytaj plik kopii zapasowej .json z CV Maker.',
    docxFailed: 'Nie udało się utworzyć dokumentu Word. Spróbuj ponownie.',
  },

  header: {
    brand: 'CV Maker',
    tagline: 'styl Harvard',
    edit: 'Edycja',
    preview: 'Podgląd',
    undo: 'Cofnij',
    redo: 'Ponów',
    undoHint: 'Ctrl/Cmd+Z',
    redoHint: 'Ctrl/Cmd+Shift+Z',
    ai: 'AI',
    aiTitle: 'Dopasuj lub edytuj CV z pomocą AI',
    savePdf: 'Zapisz PDF',
    savePdfTitle: 'Wydrukuj CV lub zapisz je jako PDF',
    toLight: 'Przełącz na jasny motyw',
    toDark: 'Przełącz na ciemny motyw',
    more: 'Więcej opcji',
  },

  menu: {
    saveBackup: 'Zapisz kopię zapasową',
    restoreBackup: 'Przywróć kopię zapasową',
    exportDocx: 'Eksportuj do Worda (.docx)',
    exporting: 'Eksportowanie…',
    aiSettings: 'Ustawienia AI i klucz API',
    saveDefault: 'Zapisz jako CV domyślne',
    saveDefaultTitle: 'Zachowaj kopię tego CV, od której zaczniesz każdą dopasowaną wersję',
    loadDefault: 'Wczytaj CV domyślne',
    savedOn: 'Zapisano {date}',
    noneSaved: 'Nic jeszcze nie zapisano',
    resetAll: 'Usuń wszystkie dane',
  },

  sections: {
    personal: 'Stanowisko',
    profile: 'Profil',
    education: 'Wykształcenie',
    experience: 'Doświadczenie',
    projects: 'Projekty',
    skills: 'Umiejętności',
    languages: 'Języki',
    certifications: 'Certyfikaty i nagrody',
    volunteer: 'Wolontariat i działalność dodatkowa',
    custom: 'Sekcja własna',
  },

  linkTypes: {
    linkedin: 'LinkedIn',
    github: 'GitHub',
    portfolio: 'Portfolio',
    other: 'Inny',
  },

  cv: {
    headings: {
      profile: 'Profil',
      education: 'Wykształcenie',
      experience: 'Doświadczenie',
      projects: 'Projekty',
      skills: 'Umiejętności techniczne',
      languages: 'Języki',
      certifications: 'Certyfikaty i nagrody',
      volunteer: 'Wolontariat i działalność dodatkowa',
      custom: 'Sekcja własna',
    },
    present: 'Obecnie',
    degreeInField: '{degree}, {field}',
  },

  editor: {
    title: 'Edytor',
    autoSaved: 'Zapisywane automatycznie',
    resizeHandle: 'Zmień szerokość edytora',
    resizeHint: 'Przeciągnij, aby zmienić szerokość · kliknij dwukrotnie, aby przywrócić',
  },

  shell: {
    reset: '↺ Wyczyść',
    resetTitle: 'Wyczyść: {title}',
    resetConfirm: 'Wyczyścić sekcję „{title}”? Wszystkie wpisy zostaną usunięte.',
    showTips: 'Pokaż wskazówki dla tej sekcji',
    showTipsShort: 'Pokaż wskazówki',
    addEntry: '+ Dodaj wpis',
  },

  entry: {
    moveUp: 'Przenieś w górę',
    moveDown: 'Przenieś w dół',
    remove: 'Usuń wpis',
  },

  dates: {
    start: 'Data rozpoczęcia',
    end: 'Data zakończenia',
    startPlaceholder: 'wrz 2022',
    endPlaceholder: 'cze 2026',
    ongoing: 'Trwa nadal',
  },

  bullets: {
    label: 'Punkty',
    placeholder: 'Opisz swoje osiągnięcie lub obowiązki...',
    ariaLabel: 'Punkt {n}',
    remove: 'Usuń punkt',
    add: '+ Dodaj punkt',
  },

  sectionManager: {
    title: 'Sekcje',
    hint: 'Włączaj i wyłączaj · Przeciągaj, aby zmienić kolejność',
    drag: 'Przeciągnij, aby zmienić kolejność',
  },

  template: {
    title: 'Szablon',
    classic: { label: 'Klasyczny', description: 'Wyśrodkowane imię i nazwisko oraz dane kontaktowe. Prosty i przyjazny dla systemów ATS.' },
    photo: { label: 'Ze zdjęciem', description: 'Zdjęcie po lewej, a obok imię, nazwisko i dane kontaktowe.' },
    upload: 'Wgraj zdjęcie',
    change: 'Zmień zdjęcie',
    removePhoto: 'Usuń',
    reading: 'Wczytywanie…',
    noPhoto: 'Brak zdjęcia',
    yourPhoto: 'Twoje zdjęcie',
    photoFile: 'Plik zdjęcia',
    photoNote: 'Przycinane do kwadratu ze środka. Zostaje w tej przeglądarce i nigdy nie jest wysyłane do AI.',
    photoOf: 'Zdjęcie: {name}',
    photoAlt: 'Zdjęcie',
    cvLanguage: 'Język CV',
    cvLanguageHint: 'Język nagłówków drukowanych na CV (Doświadczenie, Wykształcenie…). Twój tekst pozostaje bez zmian.',
    cvLanguageAuto: 'Jak w aplikacji ({language})',
    gender: 'Formy gramatyczne w polskim tekście',
    genderHint: 'Polskie czasowniki zmieniają się z rodzajem („założyłem” lub „założyłam”). To mówi AI, której formy użyć, gdy pisze lub tłumaczy po polsku. „Wykryj” bierze rodzaj z Twojego tekstu i nigdy nie zgaduje go po imieniu.',
    genderAuto: 'Wykryj z mojego tekstu',
    genderMasculine: 'Męskie (założyłem)',
    genderFeminine: 'Żeńskie (założyłam)',
  },

  photoErrors: {
    wrongType: 'Wybierz zdjęcie w formacie JPG, PNG, WebP lub GIF.',
    tooLarge: 'To zdjęcie jest za duże. Wybierz plik mniejszy niż 15 MB.',
    unreadable: 'Nie udało się odczytać tego pliku jako zdjęcia. Spróbuj innego.',
  },

  personal: {
    title: 'Dane osobowe',
    fullName: 'Imię i nazwisko',
    fullNamePlaceholder: 'Anna Kowalska',
    jobTitle: 'Stanowisko',
    jobTitlePlaceholder: 'Starszy inżynier oprogramowania',
    phone: 'Telefon',
    phonePlaceholder: '+48 000 000 000',
    email: 'E-mail',
    emailPlaceholder: 'ty@email.com',
    location: 'Lokalizacja',
    locationPlaceholder: 'Warszawa, Polska',
    links: 'Linki',
    linkUrl: 'Adres linku',
    linkUrlPlaceholder: 'https://...',
    linkLabel: 'Tekst linku',
    linkLabelPlaceholder: 'Tekst do wyświetlenia (opcjonalnie — domyślnie skrócony adres)',
    removeLink: 'Usuń link',
    addLink: '+ {type}',
    resetConfirm: 'Wyczyścić dane osobowe? Wszystkie pola zostaną opróżnione.',
  },

  profile: {
    bio: 'Opis',
    placeholder: 'Inżynier backendu z 5-letnim doświadczeniem w budowaniu systemów płatności na dużą skalę. Stawiam na niezawodność, narzędzia dla programistów i szybkie wdrażanie bez psucia rzeczy.',
    characters: {
      one: '{count} znak · celuj w 3–5 zdań',
      few: '{count} znaki · celuj w 3–5 zdań',
      many: '{count} znaków · celuj w 3–5 zdań',
      other: '{count} znaku · celuj w 3–5 zdań',
    },
    resetConfirm: 'Wyczyścić opis profilu? Zostanie usunięty.',
    resetTitle: 'Wyczyść profil',
  },

  fields: {
    location: 'Lokalizacja',
    locationPlaceholder: 'Miasto, kraj',
    education: {
      school: 'Szkoła / uczelnia',
      schoolPlaceholder: 'Uniwersytet Przykładowy',
      degree: 'Tytuł / stopień',
      degreePlaceholder: 'Licencjat',
      field: 'Kierunek studiów',
      fieldPlaceholder: 'Inżynieria oprogramowania',
      add: '+ Dodaj wykształcenie',
    },
    experience: {
      title: 'Stanowisko',
      titlePlaceholder: 'Założyciel i CEO / Inżynier Full Stack',
      company: 'Firma',
      companyPlaceholder: 'Acme Sp. z o.o.',
      add: '+ Dodaj doświadczenie',
    },
    projects: {
      name: 'Nazwa projektu',
      namePlaceholder: 'Mój projekt',
      technologies: 'Technologie',
      technologiesPlaceholder: 'React, Node.js, Supabase',
      description: 'Podtytuł / opis',
      descriptionPlaceholder: 'Krótki opis projektu',
      link: 'Link (opcjonalnie)',
      linkPlaceholder: 'https://...',
      add: '+ Dodaj projekt',
    },
    skills: {
      category: 'Kategoria',
      categoryPlaceholder: 'Języki programowania',
      items: 'Umiejętności (po przecinku)',
      itemsPlaceholder: 'Python, JavaScript, SQL, Java',
      add: '+ Dodaj kategorię umiejętności',
    },
    languages: {
      language: 'Język',
      languagePlaceholder: 'Angielski',
      proficiency: 'Poziom',
      proficiencyPlaceholder: 'Zaawansowany (C1/C2)',
      add: '+ Dodaj język',
    },
    certifications: {
      name: 'Nazwa',
      namePlaceholder: 'AWS Certified Developer',
      issuer: 'Wystawca / organizacja',
      issuerPlaceholder: 'Amazon Web Services',
      date: 'Data',
      datePlaceholder: 'cze 2024',
      description: 'Opis (opcjonalnie)',
      descriptionPlaceholder: 'Krótki opis...',
      add: '+ Dodaj certyfikat lub nagrodę',
    },
    volunteer: {
      role: 'Rola / stanowisko',
      rolePlaceholder: 'Przewodniczący koła',
      org: 'Organizacja',
      orgPlaceholder: 'Koło programistyczne',
      add: '+ Dodaj wpis',
    },
    custom: {
      sectionTitle: 'Tytuł sekcji',
      sectionTitlePlaceholder: 'np. Publikacje, Badania, Nagrody...',
      title: 'Tytuł',
      titlePlaceholder: 'Tytuł wpisu',
      subtitle: 'Podtytuł (opcjonalnie)',
      subtitlePlaceholder: 'Podtytuł (kursywą)',
      add: '+ Dodaj wpis',
      resetConfirm: 'Wyczyścić „Sekcję własną”? Wszystkie wpisy zostaną usunięte.',
      resetTitle: 'Wyczyść sekcję własną',
    },
  },

  howTo: {
    title: '? Jak korzystać',
    blocks: [
      { heading: 'Na początek', ol: [
        'Uzupełnij **Dane osobowe** — imię i nazwisko, e-mail, telefon, LinkedIn, GitHub i lokalizację.',
        'W panelu **Sekcje** włączaj i wyłączaj sekcje oraz przeciągaj je, by zmienić kolejność.',
        'Wypełnij każdą włączoną sekcję. W punktach opisuj osiągnięcia, podając liczby i efekty.',
        'Na telefonie dotknij **Podgląd** w nagłówku, aby na bieżąco sprawdzać wynik.',
      ] },
      { heading: 'Zapisywanie pracy', ul: [
        'Twoje CV jest **zapisywane automatycznie** w tej przeglądarce — przetrwa odświeżenie strony.',
        'Otwórz **menu ⋯** i kliknij **Zapisz kopię zapasową**, aby pobrać plik `.json`, który możesz bezpiecznie przechowywać lub użyć na innym urządzeniu.',
        'Kliknij **Przywróć kopię zapasową**, aby wczytać wcześniej zapisany plik.',
      ] },
      { heading: 'Korzystanie z AI (opcjonalnie)', ul: [
        'Kliknij **AI** w nagłówku, przycisk **AI** przy sekcji albo małe ✨ przy pojedynczej pracy lub projekcie i dodaj własny klucz API OpenAI, Claude lub Gemini.',
        'Wybierz gotowe polecenie albo napisz własne i opcjonalnie wklej lub dołącz opis stanowiska.',
        'Przejrzyj proponowane zmiany, wybierz, które zastosować, rozmawiaj dalej, by je dopracować, i użyj **Cofnij**, jeśli zmienisz zdanie.',
        'AI potrafi usuwać duplikaty i przenosić wpisy między sekcjami, a Twoje stanowisko staje się dokładną nazwą stanowiska, na które dopasowujesz CV. Nigdy nie zmienia danych kontaktowych ani pracodawców, uczelni i dat istniejących wpisów. Zawsze sprawdź jego sformułowania, zanim wyślesz CV.',
        'Jeśli AI pisze, że jest zajęte, przełącz się na inny model albo anuluj i wyślij ponownie. Więcej w Pomocy.',
      ] },
      { heading: 'Eksport do PDF', ul: [
        'Kliknij **Zapisz PDF** w nagłówku.',
        'W oknie drukowania wybierz jako miejsce docelowe **Zapisz jako PDF**.',
        'Ustaw marginesy na **Brak** — aplikacja sama zadba o marginesy.',
      ] },
      { heading: 'Wskazówki', ul: [
        'Każda sekcja ma przycisk **↺ Wyczyść**, który opróżnia tylko ją.',
        'Przycisk słońca / księżyca przełącza ciemny motyw.',
        'Na komputerze przeciągnij pasek między edytorem a podglądem, aby poszerzyć edytor.',
        'Karta **Szablon** pozwala wybrać nagłówek ze zdjęciem.',
        'Pola dat przyjmują dowolny tekst — np. „Obecnie”, „Planowo cze 2027”.',
        'Przełącznik języka (EN / PL) zmienia język aplikacji. Ustawienie języka CV zmienia nagłówki na CV.',
      ] },
    ],
  },

  tips: {
    personal: {
      intro: 'Twój nagłówek kontaktowy — pierwsze, co widzi rekruter. Niech będzie czysty i prawdziwy.',
      items: [
        'Użyj pełnego imienia i nazwiska, tak jak w dokumentach urzędowych.',
        'Podaj numer telefonu z numerem kierunkowym kraju (np. +48 123 456 789).',
        'Dodawaj linki przyciskami szybkiego dodawania — LinkedIn, GitHub, Portfolio itd.',
        'Możesz wkleić pełne adresy (https://...) albo samą ścieżkę — oba warianty działają.',
        'Jako lokalizację podaj tylko miasto i kraj — nigdy pełnego adresu zamieszkania.',
        'Dodawaj tylko aktualne i profesjonalne linki.',
      ],
    },
    profile: {
      intro: 'Krótki opis na górze CV — 2–4 zdania o tym, kim jesteś i co wnosisz.',
      items: [
        'Zacznij od swojej roli lub dziedziny, potem podaj 1–2 najmocniejsze osiągnięcia lub obszary wiedzy.',
        'Pisz bez zaimków, np. „Inżynier backendu z 5-letnim doświadczeniem w budowaniu systemów płatności.”',
        'Zmieść się w 3–5 zdaniach. To haczyk, a nie list motywacyjny.',
        'Dopasuj opis do stanowiska, o które się ubiegasz — wspomnij o branży lub technologiach, jeśli to istotne.',
        'Pomiń ogólniki w stylu „pracowity team player” — niech udowodni to sekcja Doświadczenie.',
      ],
    },
    education: {
      intro: 'Wymień swoje stopnie w odwrotnej kolejności chronologicznej (najnowszy pierwszy).',
      items: [
        'Średnią ocen podawaj tylko wtedy, gdy jest naprawdę wysoka.',
        'W punktach wpisz istotne przedmioty, wyróżnienia, temat pracy dyplomowej lub osiągnięcia naukowe.',
        'Jeśli masz dyplom studiów, nie musisz wymieniać liceum.',
        'Przy trwających studiach zaznacz „Trwa nadal” zamiast daty zakończenia.',
        'Kierunek studiów powinien odpowiadać temu, co widnieje w dyplomie lub suplemencie.',
      ],
    },
    experience: {
      intro: 'Twoja najważniejsza sekcja. Skup się na osiągnięciach, nie na obowiązkach.',
      items: [
        'Wymieniaj stanowiska w odwrotnej kolejności chronologicznej (najnowsze pierwsze).',
        'Zaczynaj każdy punkt od mocnego czasownika w formie bezosobowej: Zbudowano, Zaprojektowano, Skrócono, Poprowadzono, Wdrożono.',
        'Podawaj liczby, gdzie tylko się da — procenty, kwoty, liczbę użytkowników, zaoszczędzony czas.',
        'Unikaj ogólników w rodzaju „wspierałem” czy „odpowiadałem za”.',
        'Celuj w 2–4 punkty na stanowisko. Jakość jest ważniejsza niż ilość.',
      ],
    },
    projects: {
      intro: 'Pokaż własne projekty, prace open source lub projekty akademickie, które dowodzą realnych umiejętności.',
      items: [
        'Dodaj link do GitHuba lub wersji demo, jeśli projekt jest publiczny.',
        'Wypisz główne technologie w polu Technologie — rekruterzy je przeglądają.',
        'Opis to jedno zdanie w nagłówku (np. „Platforma open source do oceniania używana przez 3 uczelnie”).',
        'W punktach opisz, co zostało zbudowane, co było trudne i jaki był efekt.',
        'Projekty z prawdziwymi użytkownikami, gwiazdkami lub współautorami wyróżniają się najbardziej.',
      ],
    },
    skills: {
      intro: 'Sekcja do szybkiego przejrzenia — umiejętności techniczne. Czytają ją zarówno rekruterzy, jak i systemy ATS.',
      items: [
        'Grupuj umiejętności w kategorie — np. Języki, Frameworki, Bazy danych, Narzędzia.',
        'Wpisuj tylko to, o czym możesz pewnie rozmawiać na rozmowie kwalifikacyjnej.',
        'Nie używaj pasków ani poziomów (początkujący / ekspert) — są subiektywne i zabierają miejsce.',
        'W każdej kategorii najpierw wpisz umiejętności najbardziej istotne dla stanowiska.',
        'Bądź zwięzły — najwyżej 4–6 kategorii.',
      ],
    },
    languages: {
      intro: 'Języki, którymi mówisz — nie języki programowania (te trafiają do Umiejętności).',
      items: [
        'Używaj standardowych poziomów: ojczysty, biegły, zaawansowany (C1), średnio zaawansowany (B2), podstawowy (B1), początkujący (A1/A2).',
        'Wpisuj tylko języki, które naprawdę da się wykorzystać w pracy.',
        'Język ojczysty zwykle wynika z kontekstu, ale warto go wymienić.',
      ],
    },
    certifications: {
      intro: 'Formalne certyfikaty, licencje oraz znaczące nagrody i wygrane konkursy.',
      items: [
        'Podaj organizację wystawiającą i datę uzyskania.',
        'Przy wygranych konkursach dodaj kontekst w opisie — liczbę uczestników i to, co powstało.',
        'Wymieniaj tylko aktualne i istotne certyfikaty. Wygasłe możesz pominąć.',
        'Certyfikaty AWS, GCP i Azure są wysoko cenione na stanowiskach inżynierskich.',
        'Możesz tu wpisać miejsca w hackathonach, stypendia lub wyróżnienia.',
      ],
    },
    volunteer: {
      intro: 'Wolontariat i działalność społeczna. Traktuj to jak doświadczenie — używaj czasowników i liczb.',
      items: [
        'Szczególnie cenne, jeśli dopiero kończysz studia i masz niewielkie doświadczenie zawodowe.',
        'Pokaż wpływ w liczbach: ile osób przeszkolono, ile wydarzeń zorganizowano, ile środków zebrano.',
        'Podaj nazwę organizacji, swoją rolę i daty.',
        'Role przywódcze (lider zespołu, instruktor, organizator) wyróżniają się najbardziej.',
      ],
    },
    custom: {
      intro: 'W pełni elastyczna sekcja — użyj jej na publikacje, badania, patenty, wystawy lub cokolwiek, co nie pasuje gdzie indziej.',
      items: [
        'Zmień tytuł sekcji na coś konkretnego: „Publikacje”, „Badania”, „Nagrody”, „Konferencje”.',
        'Pole podtytułu świetnie nadaje się na nazwę czasopisma, konferencji lub współautorów.',
        'Punkty pisz zwięźle — zwykle wystarczy jedno mocne zdanie.',
        'W CV akademickim wpisuj publikacje w standardowym formacie cytowania w podtytule.',
      ],
    },
  },

  zoom: { out: 'Pomniejsz', in: 'Powiększ', reset: 'Przywróć powiększenie' },
}
