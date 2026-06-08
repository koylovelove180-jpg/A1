import { GraduationCap, UserCog } from 'lucide-react';
import { Link } from 'react-router-dom';
import ManualGuidedTour from '../../components/manual/ManualGuidedTour';
import { useManualLocale } from '../../i18n/useManualLocale';

function ManualHub() {
  const { t } = useManualLocale();

  return (
    <>
      <ManualGuidedTour />
      <section className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white sm:text-5xl">{t('manual.hub.title')}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">{t('manual.hub.subtitle')}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Link
          to="/manual/student"
          className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl transition hover:border-orange-200 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-5 inline-flex rounded-2xl bg-orange-100 p-4 text-orange-600 dark:bg-orange-950 dark:text-orange-300">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">{t('manual.hub.studentCard')}</h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{t('manual.hub.studentDesc')}</p>
        </Link>

        <Link
          to="/manual/teacher"
          className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl transition hover:border-orange-200 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-5 inline-flex rounded-2xl bg-orange-100 p-4 text-orange-600 dark:bg-orange-950 dark:text-orange-300">
            <UserCog size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">{t('manual.hub.teacherCard')}</h2>
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{t('manual.hub.teacherDesc')}</p>
        </Link>
      </div>
    </section>
    </>
  );
}

export default ManualHub;
