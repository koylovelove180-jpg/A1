import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarNav from '../components/dashboard/SidebarNav';
import TopBar, { DrawerCloseButton } from '../components/dashboard/TopBar';
import { useAppLocale } from '../i18n/AppLocaleProvider';

function DashboardLayout({ variant = 'portal', title, subtitle, children, topBarActions }) {
  const { t } = useAppLocale();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const update = () => setSidebarCollapsed(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const resolvedTitle = title ?? (variant === 'teacher' ? t('teacher.dashboard.title') : t('dashboard.hero.title'));
  const resolvedSubtitle = subtitle ?? (variant === 'portal' ? t('dashboard.hero.subtitle') : undefined);

  return (
    <div className="min-h-screen bg-page text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-white"
      >
        {t('app.skipToContent')}
      </a>

      <div className="flex min-h-screen">
        <aside
          className={`hidden shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block ${
            sidebarCollapsed ? 'w-[72px] p-3' : 'w-[var(--sidebar-width)] p-6'
          }`}
        >
          <SidebarNav variant={variant} collapsed={sidebarCollapsed} />
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/50"
              onClick={() => setSidebarOpen(false)}
              aria-label={t('app.menu.close')}
            />
            <div
              className="absolute left-0 top-0 h-full w-[min(320px,85vw)] overflow-y-auto bg-white p-6 shadow-2xl dark:bg-slate-900"
              style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}
            >
              <div className="mb-4 flex justify-end">
                <DrawerCloseButton onClick={() => setSidebarOpen(false)} />
              </div>
              <SidebarNav variant={variant} onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            title={resolvedTitle}
            subtitle={resolvedSubtitle}
            showMenuButton
            onMenuClick={() => setSidebarOpen(true)}
            actions={topBarActions}
          />
          <main
            id="main-content"
            className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            {children ?? <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
