import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { getSavedLang, setSavedLang } from '../services/settings';
import { STRINGS, type Strings } from './strings';

export type Lang = 'cs' | 'en';

interface LangValue {
  lang: Lang;
  t: Strings;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const LangContext = createContext<LangValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => getSavedLang() ?? 'cs');

  const setLang = useCallback((next: Lang) => {
    setSavedLang(next);
    setLangState(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next = prev === 'cs' ? 'en' : 'cs';
      setSavedLang(next);
      return next;
    });
  }, []);

  const value = useMemo<LangValue>(
    () => ({ lang, t: STRINGS[lang], setLang, toggleLang }),
    [lang, setLang, toggleLang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

function useLangCtx(): LangValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useT/useLang must be used within LanguageProvider');
  return ctx;
}

/** The strings for the active language. */
export function useT(): Strings {
  return useLangCtx().t;
}

/** Language controls (current language + setters). */
export function useLang(): Omit<LangValue, 't'> {
  const { lang, setLang, toggleLang } = useLangCtx();
  return { lang, setLang, toggleLang };
}

/** Interpolate {key} placeholders, e.g. fmt(t.toast.unknownCard, { uid }). */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
