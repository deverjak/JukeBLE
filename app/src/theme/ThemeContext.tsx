import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { getSavedTheme, setSavedTheme } from '../services/settings';
import { darkTokens, lightTokens, type ThemeName, type Tokens } from './tokens';

interface ThemeValue {
  theme: ThemeName;
  tokens: Tokens;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => getSavedTheme() ?? 'dark');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      setSavedTheme(next);
      return next;
    });
  }, []);

  const value = useMemo<ThemeValue>(
    () => ({ theme, tokens: theme === 'dark' ? darkTokens : lightTokens, toggleTheme }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
