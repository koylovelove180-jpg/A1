import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useManualLocale } from '../../i18n/useManualLocale';
import { getTopicsForRole } from '../../utils/manualSearch';
import { getReadProgress } from '../../utils/manualProgress';
import TeacherSetupChecklist from '../../components/manual/TeacherSetupChecklist';

function ManualRoleHome() {
  const { role } = useParams();
  const { t } = useManualLocale();
  const validRole = role === 'student' || role === 'teacher';
  const topics = validRole ? getTopicsForRole(role) : [];
  const [readCount, setReadCount] = useState(0);

  useEffect(() => {
    if (!validRole) return;
    setReadCount(getReadProgress(role).length);
  }, [role, validRole]);

  if (!validRole) {
    return <Navigate to="/manual" replace />;
  }

  const startTopic = topics[0];

  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
          {role === 'teacher' ? t('manual.nav.teacher') : t('manual.nav.student')}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-slate-950 dark:text-white">
          {role === 'teacher' ? t('manual.hub.teacherCard') : t('manual.hub.studentCard')}
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          {t('manual.roleHome.readingProgress', { count: readCount, total: topics.length })}
        </p>
      </div>

      {startTopic && (
        <Link
          to={`/manual/${role}/${startTopic.id}`}
          className="flex items-center justify-between rounded-[2rem] bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white shadow-lg"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-orange-100">{t('manual.roleHome.startHere')}</p>
            <h2 className="mt-1 text-2xl font-extrabold">{t(startTopic.titleKey)}</h2>
            <p className="mt-2 text-orange-50">{t(startTopic.summaryKey)}</p>
          </div>
          <ChevronRight size={28} />
        </Link>
      )}

      {role === 'teacher' && <TeacherSetupChecklist />}

      <div>
        <h2 className="mb-4 text-xl font-extrabold text-slate-950 dark:text-white">{t('manual.roleHome.allTopics')}</h2>
        <div className="grid gap-3">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/manual/${role}/${topic.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-orange-200 dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="font-bold text-slate-950 dark:text-white">{t(topic.titleKey)}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{t(topic.summaryKey)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ManualRoleHome;
