import { BookOpen, GraduationCap, UserCog } from 'lucide-react';
import { Link } from 'react-router-dom';
import RoleCard from '../components/dashboard/RoleCard';
import StatCard from '../components/dashboard/StatCard';
import { useAppLocale } from '../i18n/AppLocaleProvider';
import { DEFAULT_COURSE_ID, getCourseList } from '../data/coursesRegistry';
import { useLessonControls } from '../hooks/useLessonControls';

function DashboardHome() {
  const { t } = useAppLocale();
  const { settings } = useLessonControls(DEFAULT_COURSE_ID);
  const courses = getCourseList();

  const lessonStatus = settings.contentUnlocked ? t('dashboard.stats.unlocked') : t('dashboard.stats.locked');
  const postStatus = settings.postTestUnlocked ? t('dashboard.stats.unlocked') : t('dashboard.stats.locked');
  const preStatus = settings.preTestRequired ? t('dashboard.stats.required') : t('dashboard.stats.optional');

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-6 text-white shadow-2xl sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">{t('dashboard.hero.eyebrow')}</p>
        <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{t('dashboard.hero.title')}</h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-orange-50">{t('dashboard.hero.subtitle')}</p>
        <p className="mt-3 text-orange-200">{settings.courseTitle} · {settings.classroomName}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:gap-4">
        <StatCard label={t('dashboard.stats.lessons')} value={lessonStatus} unlocked={settings.contentUnlocked} />
        <StatCard label={t('dashboard.stats.pretest')} value={preStatus} />
        <StatCard label={t('dashboard.stats.posttest')} value={postStatus} unlocked={settings.postTestUnlocked} />
        <StatCard label={t('dashboard.stats.classroom')} value={settings.classroomName} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <RoleCard
          to={`/student/${DEFAULT_COURSE_ID}`}
          icon={GraduationCap}
          title={t('dashboard.roles.student')}
          description={t('dashboard.roles.studentDesc')}
        />
        <RoleCard
          to={`/teacher/${DEFAULT_COURSE_ID}`}
          icon={UserCog}
          title={t('dashboard.roles.teacher')}
          description={t('dashboard.roles.teacherDesc')}
          accent="emerald"
        />
        <RoleCard
          to="/manual"
          icon={BookOpen}
          title={t('dashboard.roles.manual')}
          description={t('dashboard.roles.manualDesc')}
          accent="slate"
        />
      </div>

      {courses.length > 1 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="font-bold text-slate-950 dark:text-white">{t('dashboard.courses.title')}</p>
          <ul className="mt-3 space-y-2">
            {courses.map((course) => (
              <li key={course.id}>
                <Link
                  to={`/student/${course.id}`}
                  className="text-sm font-bold text-orange-600 hover:underline"
                >
                  {course.id}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <p className="font-bold text-slate-950 dark:text-white">{t('dashboard.footer.help')}</p>
        <Link to="/manual" className="mt-2 inline-flex text-sm font-bold text-orange-600 hover:underline">
          {t('dashboard.footer.manualLink')}
        </Link>
      </footer>
    </section>
  );
}

export default DashboardHome;
