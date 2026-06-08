import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Home,
  Menu,
  Moon,
  Search,
  Sun,
  UserCog,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useManualLocale } from '../../i18n/useManualLocale';
import { getTopicsForRole, searchManualTopics } from '../../utils/manualSearch';

function ManualLayout() {
  const { t, locale, setLocale } = useManualLocale();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const role = location.pathname.includes('/manual/teacher')
    ? 'teacher'
    : location.pathname.includes('/manual/student')
      ? 'student'
      : null;

  const topics = role ? getTopicsForRole(role) : [];
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !role) return [];
    return searchManualTopics(searchQuery, role, locale);
  }, [searchQuery, role, locale]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === '/' && !event.target.matches('input, textarea')) {
        event.preventDefault();
        document.getElementById('manual-search')?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navLinks = (
    <nav className="space-y-1">
      <Link
        to="/manual"
        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Home size={18} />
        {t('manual.nav.home')}
      </Link>
      <Link
        to="/manual/student"
        className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${
          role === 'student'
            ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
            : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800'
        }`}
      >
        <GraduationCap size={18} />
        {t('manual.nav.student')}
      </Link>
      <Link
        to="/manual/teacher"
        className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${
          role === 'teacher'
            ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
            : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800'
        }`}
      >
        <UserCog size={18} />
        {t('manual.nav.teacher')}
      </Link>
      {role &&
        topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/manual/${role}/${topic.id}`}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 pl-8 text-sm font-medium ${
              location.pathname.endsWith(`/${topic.id}`)
                ? 'bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60'
            }`}
          >
            <ChevronRight size={14} />
            {t(topic.titleKey)}
          </Link>
        ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <a href="#manual-main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link to="/manual" className="flex items-center gap-2 font-extrabold text-slate-950 dark:text-white">
            <BookOpen size={22} className="text-orange-500" />
            <span className="hidden sm:inline">{t('manual.hub.title')}</span>
          </Link>

          <div className="relative ml-auto flex-1 max-w-md">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="manual-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('manual.search.placeholder')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none ring-orange-200 focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              disabled={!role}
            />
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {searchQuery && role && searchResults.length > 0 && `${searchResults.length} ${t('manual.search.results')}`}
              {searchQuery && role && searchResults.length === 0 && t('manual.search.noResults')}
            </div>
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <p className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-500">{t('manual.search.results')}</p>
                {searchResults.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold hover:bg-orange-50 dark:hover:bg-slate-800"
                    onClick={() => {
                      navigate(`/manual/${role}/${topic.id}`);
                      setSearchQuery('');
                    }}
                  >
                    {t(topic.titleKey)}
                  </button>
                ))}
              </div>
            )}
            {searchQuery && role && searchResults.length === 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                {t('manual.search.noResults')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLocale(locale === 'th' ? 'en' : 'th')}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700"
            >
              {locale === 'th' ? 'EN' : 'TH'}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border border-slate-200 p-2 dark:border-slate-700"
              aria-label={theme === 'dark' ? t('manual.theme.light') : t('manual.theme.dark')}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              to={role === 'teacher' ? '/teacher' : '/student'}
              className="hidden rounded-xl bg-orange-500 px-3 py-2 text-xs font-bold text-white sm:inline-flex"
            >
              {t('manual.nav.backToApp')}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 p-6 lg:block dark:border-slate-800">
          {navLinks}
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" className="absolute inset-0 bg-slate-950/50" onClick={() => setSidebarOpen(false)} aria-label="Close overlay" />
            <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-white p-6 shadow-2xl dark:bg-slate-900">
              <div className="mb-4 flex justify-end">
                <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X size={22} />
                </button>
              </div>
              {navLinks}
            </div>
          </div>
        )}

        <main id="manual-main" className="manual-print-area min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
          <Outlet context={{ role }} />
        </main>
      </div>
    </div>
  );
}

export default ManualLayout;
