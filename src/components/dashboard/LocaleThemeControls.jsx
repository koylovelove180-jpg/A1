import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAppLocale } from '../../i18n/AppLocaleProvider';

function LocaleThemeControls({ compact = false }) {
  const { locale, setLocale, t } = useAppLocale();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'gap-2'}`}>
      <div className="flex rounded-xl border border-slate-200 dark:border-slate-700" role="group" aria-label="Language">
        {['th', 'en'].map((code) => (
          <button
            key={code}
            type="button"
            aria-pressed={locale === code}
            onClick={() => setLocale(code)}
            className={`min-h-[44px] min-w-[44px] px-3 py-2 text-xs font-bold transition first:rounded-l-xl last:rounded-r-xl ${
              locale === code
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={toggleTheme}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 p-2 dark:border-slate-700 dark:bg-slate-900"
        aria-label={theme === 'dark' ? t('app.theme.light') : t('app.theme.dark')}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}

export default LocaleThemeControls;
