import { Download, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useAppLocale } from '../i18n/AppLocaleProvider';
import { exportAttemptsToCsv, fetchQuizAttempts } from '../utils/quizPersistence';

function TeacherGradeExport({ classroomId, courseId }) {
  const { t } = useAppLocale();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAttempts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await fetchQuizAttempts(classroomId, courseId);
      setAttempts(rows);
    } catch (loadErr) {
      setError(loadErr.message || t('teacher.grades.loadError'));
    } finally {
      setLoading(false);
    }
  }, [classroomId, courseId, t]);

  useEffect(() => {
    loadAttempts();
  }, [loadAttempts]);

  const handleExport = () => {
    exportAttemptsToCsv(attempts, `quiz-grades-${courseId}.csv`);
  };

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-xl dark:bg-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">{t('teacher.grades.eyebrow')}</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-white">{t('teacher.grades.title')}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{t('teacher.grades.desc')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadAttempts}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:text-orange-600 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <RefreshCw size={16} />
            {t('teacher.grades.refresh')}
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={loading || attempts.length === 0}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-600 disabled:opacity-60"
          >
            <Download size={16} />
            {t('teacher.grades.export')}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">{t('teacher.grades.colTime')}</th>
              <th className="px-4 py-3">{t('teacher.grades.colStudent')}</th>
              <th className="px-4 py-3">{t('teacher.grades.colQuiz')}</th>
              <th className="px-4 py-3">{t('teacher.grades.colScore')}</th>
              <th className="px-4 py-3">{t('teacher.grades.colPassed')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  {t('teacher.grades.loading')}
                </td>
              </tr>
            ) : attempts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  {t('teacher.grades.empty')}
                </td>
              </tr>
            ) : (
              attempts.map((row) => (
                <tr key={row.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                    {new Date(row.completedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">{row.studentId}</td>
                  <td className="px-4 py-3 capitalize text-slate-700 dark:text-slate-300">{row.quizMode}-test</td>
                  <td className="px-4 py-3 font-bold text-slate-950 dark:text-white">
                    {row.score}/{row.total} ({row.percentage}%)
                  </td>
                  <td className="px-4 py-3">
                    {row.passed ? (
                      <span className="font-bold text-emerald-600">{t('teacher.grades.yes')}</span>
                    ) : (
                      <span className="font-bold text-red-600">{t('teacher.grades.no')}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeacherGradeExport;
