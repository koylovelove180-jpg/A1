import { AppLocaleProvider } from '../i18n/AppLocaleProvider';
import { ThemeProvider } from '../context/ThemeContext';

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AppLocaleProvider>{children}</AppLocaleProvider>
    </ThemeProvider>
  );
}
