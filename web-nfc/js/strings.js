/* JukeNFC landing — i18n strings (EN / CS).
   Plain data, no framework. js/app.js fills every [data-i18n] node from here. */
window.LANGS = [['en', 'English'], ['cs', 'Čeština']];

window.STRINGS = {
  en: {
    nav: { how: 'How it works', private: 'Private by design', use: 'Use cases', features: 'Features', android: 'Android', getApp: 'Get the app' },
    hero: {
      badge: 'No extra hardware',
      l1: 'Tap a card.', pre: 'Hear a ', accent: 'sound', post: '.',
      sub: 'JukeNFC turns your phone into a tap-to-play sound box. Map any NFC card to a sound from your own files — then just tap to play. No internet, no cloud, no account.',
      ctaPrimary: 'Get it on Android', ctaSecondary: 'See how it works',
      chips: [['library', 'Plays your own files'], ['wifi-off', 'Works fully offline'], ['user-x', 'No account needed']],
      cards: ['Lion', 'Drum', 'Doorbell'],
    },
    how: {
      eyebrow: 'How it works', title: 'Three taps from box to bop',
      steps: [
        { title: 'Register a card', body: 'Switch to registration mode and tap any NFC card to the back of your phone. JukeNFC reads its unique ID.' },
        { title: 'Assign a sound', body: 'Pick an audio file from your phone — MP3, WAV or M4A. It’s copied into the app and stored locally.' },
        { title: 'Tap to play', body: 'Switch to play mode. Every tap of that card plays its sound. Tap another card and the first one stops.' },
      ],
    },
    private: {
      eyebrow: 'Private by design', title: 'Everything stays on your phone',
      sub: 'No servers, no syncing, no strings. JukeNFC keeps your cards and sounds entirely on-device — so it just works, and it stays yours.',
      pillars: [
        { title: 'Your own files', body: 'Import MP3, WAV or M4A straight from your phone. Files are copied into the app and live on the device.' },
        { title: 'No internet', body: 'JukeNFC never goes online. Tap-to-play works in airplane mode, in a basement — anywhere.' },
        { title: 'No cloud', body: 'Cards, sounds and settings sit in a local database on the phone. Nothing is uploaded, ever.' },
        { title: 'No account', body: 'No sign-up, no email, no login. Install the app and start tapping right away.' },
      ],
      note: 'local database + files · 0 network calls · 0 trackers',
    },
    use: {
      eyebrow: 'Use cases', title: 'One tap, endless play',
      sub: 'A phone, a stack of cards, and a little imagination. Here’s where JukeNFC shines.',
      cases: [
        { title: 'Kids & learning', body: 'Tap an animal card → animal sound. Flashcards that talk, sing, and count.' },
        { title: 'Accessibility', body: 'Communication boards where physical cards trigger spoken phrases.' },
        { title: 'Events & kiosks', body: 'Leave a phone in kiosk mode; visitors tap cards at exhibits and stands.' },
        { title: 'Tabletop & games', body: 'Character or item cards that play themed audio cues at the table.' },
        { title: 'Soundboards', body: 'Quick, physical triggers for effects, jingles, and cues on demand.' },
      ],
      dream: { title: '…and whatever you dream up', body: 'Any card. Any sound. It’s your soundboard.' },
    },
    features: {
      eyebrow: 'Features', title: 'Small app. Big bag of tricks.',
      items: [
        ['Phone’s own NFC antenna', 'No external reader hardware needed. Just tap and go.'],
        ['Your own sound library', 'Import MP3, WAV or M4A. Files are copied in and stored locally.'],
        ['Two clear modes', 'Registration to add cards, Play to use them — with a guard so you never leave setup by accident.'],
        ['Instant playback', 'A new tap stops the current sound and starts the next. One sound at a time.'],
        ['Background & lock screen', 'Audio keeps playing when backgrounded, with media controls and the sound name on the lock screen.'],
        ['Kiosk-friendly', 'Keeps the screen awake and resumes listening — ideal for an always-on tap station.'],
        ['Fully offline', 'No server, no internet. A local database and files — that’s it.'],
        ['Live reader status', 'See at a glance whether NFC is listening, ready, off, or unsupported.'],
      ],
    },
    library: {
      eyebrow: 'Your library', title: 'Every card is a little button',
      sub: 'Give each card a name and a sound from your own files. Tap to play in the app — tap a card here to preview.',
      badge: 'One sound at a time',
      cards: ['Lion', 'Drum', 'Birdie', 'Magic', 'Car', 'Bell'],
    },
    cta: {
      title: 'Turn any card into a sound',
      sub: 'Free to try. Works fully offline. Just install and start tapping — no account, no setup.',
      primary: 'Get it on Android', secondary: 'See how it works',
      note: 'Android only — iOS can’t listen for NFC continuously.',
    },
    footer: {
      tagline: 'The mobile NFC jukebox. Tap a card, hear a sound — no extra hardware.',
      cols: [
        ['Product', ['How it works', 'Private by design', 'Use cases', 'Features', 'Download']],
        ['Support', ['Help', 'FAQ', 'Contact']],
        ['Legal', ['Privacy', 'Terms']],
      ],
      copyright: '© 2026 JukeNFC. Made for tappers everywhere.',
      offline: 'Works fully offline',
    },
  },

  cs: {
    nav: { how: 'Jak to funguje', private: 'Soukromí v základu', use: 'Využití', features: 'Funkce', android: 'Android', getApp: 'Stáhnout aplikaci' },
    hero: {
      badge: 'Žádný hardware navíc',
      l1: 'Přiložte kartu.', pre: 'Ozve se ', accent: 'zvuk', post: '.',
      sub: 'JukeNFC promění váš telefon v zvukový panel na dotek. Přiřaďte libovolné NFC kartě zvuk z vlastních souborů — a pak stačí přiložit. Žádný internet, žádný cloud, žádný účet.',
      ctaPrimary: 'Stáhnout pro Android', ctaSecondary: 'Jak to funguje',
      chips: [['library', 'Přehrává vaše soubory'], ['wifi-off', 'Funguje bez připojení'], ['user-x', 'Bez účtu']],
      cards: ['Lev', 'Buben', 'Zvonek'],
    },
    how: {
      eyebrow: 'Jak to funguje', title: 'Tři přiložení a hraje to',
      steps: [
        { title: 'Zaregistrujte kartu', body: 'Přepněte do režimu registrace a přiložte libovolnou NFC kartu k zadní straně telefonu. JukeNFC načte její jedinečné ID.' },
        { title: 'Přiřaďte zvuk', body: 'Vyberte zvukový soubor z telefonu — MP3, WAV nebo M4A. Zkopíruje se do aplikace a uloží se lokálně.' },
        { title: 'Přiložte a hrajte', body: 'Přepněte do režimu přehrávání. Každé přiložení karty přehraje její zvuk. Přiložíte jinou kartu a první se zastaví.' },
      ],
    },
    private: {
      eyebrow: 'Soukromí v základu', title: 'Všechno zůstává v telefonu',
      sub: 'Žádné servery, žádná synchronizace, žádné háčky. JukeNFC drží vaše karty i zvuky kompletně v zařízení — takže to prostě funguje a zůstává to vaše.',
      pillars: [
        { title: 'Vaše vlastní soubory', body: 'Importujte MP3, WAV nebo M4A přímo z telefonu. Soubory se zkopírují do aplikace a žijí v zařízení.' },
        { title: 'Žádný internet', body: 'JukeNFC nikdy nechodí online. Přehrávání na dotek funguje i v režimu letadlo, ve sklepě — kdekoli.' },
        { title: 'Žádný cloud', body: 'Karty, zvuky i nastavení leží v lokální databázi v telefonu. Nic se nikdy nenahrává.' },
        { title: 'Žádný účet', body: 'Žádná registrace, žádný e-mail, žádné přihlašování. Nainstalujte a hned přikládejte.' },
      ],
      note: 'lokální databáze + soubory · 0 síťových volání · 0 sledování',
    },
    use: {
      eyebrow: 'Využití', title: 'Jedno přiložení, nekonečná zábava',
      sub: 'Telefon, hromádka karet a špetka fantazie. Tady JukeNFC září.',
      cases: [
        { title: 'Děti a učení', body: 'Přiložíte kartu se zvířátkem → ozve se zvíře. Kartičky, které mluví, zpívají a počítají.' },
        { title: 'Přístupnost', body: 'Komunikační tabule, kde fyzické karty spouští namluvené fráze.' },
        { title: 'Akce a kiosky', body: 'Nechte telefon v režimu kiosku; návštěvníci přikládají karty u exponátů a stánků.' },
        { title: 'Stolní hry', body: 'Karty postav nebo předmětů, které u stolu přehrají tematické zvuky.' },
        { title: 'Zvukové panely', body: 'Rychlé fyzické spouštění efektů, znělek a hlášek na povel.' },
      ],
      dream: { title: '…a cokoli vymyslíte', body: 'Jakákoli karta. Jakýkoli zvuk. Je to váš zvukový panel.' },
    },
    features: {
      eyebrow: 'Funkce', title: 'Malá aplikace. Velký pytel triků.',
      items: [
        ['Vlastní NFC anténa telefonu', 'Žádný externí čtecí hardware není potřeba. Stačí přiložit.'],
        ['Vaše vlastní knihovna zvuků', 'Importujte MP3, WAV nebo M4A. Soubory se zkopírují dovnitř a uloží lokálně.'],
        ['Dva jasné režimy', 'Registrace pro přidání karet, Přehrávání pro jejich použití — s pojistkou, abyste setup neopustili omylem.'],
        ['Okamžité přehrání', 'Nové přiložení zastaví aktuální zvuk a spustí další. Vždy jen jeden zvuk.'],
        ['Na pozadí i na zámku', 'Zvuk hraje dál i na pozadí, s ovládáním médií a názvem zvuku na zamykací obrazovce.'],
        ['Vhodné pro kiosk', 'Drží obrazovku rozsvícenou a samo obnoví poslouchání — ideální pro stálou stanici.'],
        ['Plně offline', 'Žádný server, žádný internet. Lokální databáze a soubory — nic víc.'],
        ['Živý stav čtečky', 'Na první pohled vidíte, zda NFC poslouchá, je připravené, vypnuté nebo nepodporované.'],
      ],
    },
    library: {
      eyebrow: 'Vaše knihovna', title: 'Každá karta je malé tlačítko',
      sub: 'Dejte každé kartě jméno a zvuk z vlastních souborů. V aplikaci přehrajete přiložením — tady přehrajete klepnutím na kartu.',
      badge: 'Vždy jen jeden zvuk',
      cards: ['Lev', 'Buben', 'Ptáček', 'Kouzlo', 'Auto', 'Zvonek'],
    },
    cta: {
      title: 'Proměňte kartu ve zvuk',
      sub: 'Zdarma k vyzkoušení. Funguje plně offline. Stačí nainstalovat a přikládat — bez účtu, bez nastavování.',
      primary: 'Stáhnout pro Android', secondary: 'Jak to funguje',
      note: 'Jen Android — iOS neumí NFC poslouchat průběžně.',
    },
    footer: {
      tagline: 'Mobilní NFC jukebox. Přiložte kartu, ozve se zvuk — žádný hardware navíc.',
      cols: [
        ['Produkt', ['Jak to funguje', 'Soukromí v základu', 'Využití', 'Funkce', 'Stáhnout']],
        ['Podpora', ['Nápověda', 'FAQ', 'Kontakt']],
        ['Právní', ['Soukromí', 'Podmínky']],
      ],
      copyright: '© 2026 JukeNFC. Pro všechny, kdo přikládají.',
      offline: 'Funguje plně offline',
    },
  },
};
