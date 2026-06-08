import { BookOpen, GraduationCap, LayoutDashboard, UserCog } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAppLocale } from '../../i18n/AppLocaleProvider';

const navByVariant = {
  portal: [
    { to: '/dashboard', labelKey: 'app.nav.dashboard', icon: LayoutDashboard },
    { to: '/student', labelKey: 'app.nav.student', icon: GraduationCap },
    { to: '/teacher', labelKey: 'app.nav.teacher', icon: UserCog },
    { to: '/manual', labelKey: 'app.nav.manual', icon: BookOpen },
  ],
  teacher: [
    { to: '/dashboard', labelKey: 'app.nav.dashboard', icon: LayoutDashboard },
    { to: '/teacher', labelKey: 'teacher.dashboard.title', icon: UserCog },
    { to: '/student', labelKey: 'teacher.dashboard.viewStudent', icon: GraduationCap },
    { to: '/manual/teacher', labelKey: 'app.nav.manual', icon: BookOpen },
  ],
  student: [
    { to: '/dashboard', labelKey: 'app.nav.dashboard', icon: LayoutDashboard },
    { to: '/student', labelKey: 'app.nav.student', icon: GraduationCap },
    { to: '/manual/student', labelKey: 'app.nav.manual', icon: BookOpen },
  ],
};

function SidebarNav({ variant = 'portal', collapsed = false, onNavigate }) {
  const { t } = useAppLocale();
  const location = useLocation();
  const items = navByVariant[variant] ?? navByVariant.portal;

  return (
    <nav className="space-y-1" aria-label="Main navigation">
      {items.map(({ to, labelKey, icon: Icon }) => {
        const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            title={collapsed ? t(labelKey) : undefined}
            className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              active
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-800'
            } ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <Icon size={20} className="shrink-0" />
            {!collapsed && <span className="line-clamp-2">{t(labelKey)}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export default SidebarNav;
