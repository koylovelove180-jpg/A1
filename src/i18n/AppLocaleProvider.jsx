import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getStoredLocale, setStoredLocale, translate } from './localeBundles';

const AppLocaleContext = createContext(null);

export function AppLocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(getStoredLocale);

  const setLocale = useCallback((next) => {
    setStoredLocale(next);
    setLocaleState(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'th';
  }, [locale]);

  const t = useCallback((key, params) => translate(locale, key, params), [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <AppLocaleContext.Provider value={value}>{children}</AppLocaleContext.Provider>;
}

export function useAppLocale() {
  const context = useContext(AppLocaleContext);
  if (!context) {
    throw new Error('useAppLocale must be used within AppLocaleProvider');
  }
  return context;
}
