import { Menu, X } from 'lucide-react';
import LocaleThemeControls from './LocaleThemeControls';
import { useAppLocale } from '../../i18n/AppLocaleProvider';

function TopBar({ title, subtitle, onMenuClick, showMenuButton = false, actions = null }) {
  const { t } = useAppLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex min-h-[56px] items-center gap-3 px-4 py-3 sm:px-6" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        {showMenuButton && (
          <button
            type="button"
            onClick={onMenuClick}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={t('app.menu.open')}
          >
            <Menu size={22} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          {title && <h1 className="truncate text-lg font-extrabold text-slate-950 dark:text-white sm:text-xl">{title}</h1>}
          {subtitle && <p className="truncate text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          <LocaleThemeControls />
        </div>
      </div>
    </header>
  );
}

export function DrawerCloseButton({ onClick }) {
  const { t } = useAppLocale();
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label={t('app.menu.close')}
    >
      <X size={22} />
    </button>
  );
}

export default TopBar;
