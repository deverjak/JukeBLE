/* JukeNFC landing — tiny vanilla behaviour layer.
   1) i18n: fill every [data-i18n] node from window.STRINGS
   2) language dropdown (open/close + persist in localStorage)
   3) sound-card "tap to preview" highlight (visual only — no audio)
   No framework, no build step. */
(function () {
  'use strict';

  var STORE_KEY = 'jukenfc_lang';
  var DEFAULT_LANG = 'en';

  /* Resolve a dotted path like "use.cases.0.title" against an object. */
  function resolve(obj, path) {
    return path.split('.').reduce(function (acc, key) {
      return acc == null ? undefined : acc[key];
    }, obj);
  }

  function applyLang(lang) {
    var dict = window.STRINGS[lang] || window.STRINGS[DEFAULT_LANG];

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = resolve(dict, el.getAttribute('data-i18n'));
      if (val != null) el.textContent = val;
    });

    document.documentElement.lang = lang;

    // language button label + active option state
    var label = document.querySelector('[data-lang-label]');
    if (label) label.textContent = lang.toUpperCase();
    document.querySelectorAll('[data-lang]').forEach(function (opt) {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
  }

  function init() {
    // ---- initial language ----
    var lang = DEFAULT_LANG;
    try { lang = localStorage.getItem(STORE_KEY) || DEFAULT_LANG; } catch (e) {}
    if (!window.STRINGS[lang]) lang = DEFAULT_LANG;
    applyLang(lang);

    // ---- language dropdown ----
    var picker = document.querySelector('[data-lang-picker]');
    var toggle = document.querySelector('[data-lang-toggle]');
    if (toggle && picker) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        picker.classList.toggle('open');
      });
      document.addEventListener('click', function (e) {
        if (!picker.contains(e.target)) picker.classList.remove('open');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') picker.classList.remove('open');
      });
      picker.querySelectorAll('[data-lang]').forEach(function (opt) {
        opt.addEventListener('click', function () {
          applyLang(opt.getAttribute('data-lang'));
          picker.classList.remove('open');
        });
      });
    }

    // ---- sound-card preview highlight (one at a time) ----
    var cards = document.querySelectorAll('[data-sound-card]');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        cards.forEach(function (c) { c.classList.remove('playing'); });
        card.classList.add('playing');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
