import { ExternalLink, Printer, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import TeacherHelpVideo from '../../components/TeacherHelpVideo';
import { useManualLocale } from '../../i18n/useManualLocale';
import { getTopicById, getTopicsForRole } from '../../utils/manualSearch';
import {
  getArticleFeedback,
  isTopicRead,
  markTopicRead,
  saveArticleFeedback,
} from '../../utils/manualProgress';

function Callout({ type, label, children }) {
  const styles = {
    tip: 'border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-100',
    warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100',
    note: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
  };

  return (
    <div className={`mt-4 rounded-2xl border p-4 text-sm leading-7 ${styles[type]}`}>
      <p className="font-bold">{label}</p>
      <p className="mt-1">{children}</p>
    </div>
  );
}

function ManualArticle() {
  const { role, topicId } = useParams();
  const { t } = useManualLocale();
  const validRole = role === 'student' || role === 'teacher';
  const topic = validRole ? getTopicById(role, topicId) : null;
  const allTopics = validRole ? getTopicsForRole(role) : [];
  const index = allTopics.findIndex((item) => item.id === topicId);
  const prevTopic = index > 0 ? allTopics[index - 1] : null;
  const nextTopic = index >= 0 && index < allTopics.length - 1 ? allTopics[index + 1] : null;

  const [read, setRead] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackThanks, setFeedbackThanks] = useState(false);

  useEffect(() => {
    if (!validRole || !topic) return;
    setRead(isTopicRead(role, topic.id));
    setFeedback(getArticleFeedback(role, topic.id));
    setFeedbackThanks(false);
    markTopicRead(role, topic.id);
    setRead(true);
  }, [role, topic, validRole]);

  useEffect(() => {
    if (!topic || !window.location.hash) return;
    const id = window.location.hash.slice(1);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [topic, topicId]);

  if (!validRole) {
    return <Navigate to="/manual" replace />;
  }

  if (!topic) {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center dark:bg-slate-900">
        <p>Topic not found</p>
        <Link to={`/manual/${role}`} className="mt-4 inline-block text-orange-600">
          Back
        </Link>
      </section>
    );
  }

  const handleFeedback = (helpful) => {
    saveArticleFeedback(role, topic.id, helpful);
    setFeedback(helpful);
    setFeedbackThanks(true);
  };

  return (
    <article className="mx-auto max-w-3xl">
      <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400 no-print" aria-label="Breadcrumb">
        <Link to="/manual" className="hover:text-orange-600">{t('manual.nav.home')}</Link>
        {' / '}
        <Link to={`/manual/${role}`} className="hover:text-orange-600">
          {role === 'teacher' ? t('manual.nav.teacher') : t('manual.nav.student')}
        </Link>
        {' / '}
        <span className="text-slate-700 dark:text-slate-200">{t(topic.titleKey)}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white">{t(topic.titleKey)}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">{t(topic.summaryKey)}</p>
        <p className="mt-3 text-sm text-slate-500">
          {t('manual.article.updated')}: {t('manual.lastUpdated')}
          {read && <span className="ml-3 text-emerald-600">✓ {t('manual.article.progressRead')}</span>}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 no-print">
          {topic.appRoute && (
            <Link
              to={topic.appRoute}
              className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2 text-sm font-bold text-white"
            >
              <ExternalLink size={16} />
              {t('manual.article.related')}
            </Link>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-bold dark:border-slate-700"
          >
            <Printer size={16} />
            {t('manual.print')}
          </button>
        </div>
      </header>

      {role === 'teacher' && topicId === 'help-video' && (
        <div className="no-print mb-8 max-w-2xl">
          <TeacherHelpVideo />
        </div>
      )}

      {topic.sections.some((section) => section.headingKey) && (
        <aside className="no-print mb-8 hidden rounded-2xl border border-slate-200 bg-white p-4 xl:block dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('manual.nav.onThisPage')}</p>
          <ul className="mt-3 space-y-2">
            {topic.sections
              .filter((section) => section.headingKey)
              .map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-sm font-semibold text-orange-600 hover:underline">
                    {t(section.headingKey)}
                  </a>
                </li>
              ))}
          </ul>
        </aside>
      )}

      <div className="space-y-10">
        {topic.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            {section.headingKey && (
              <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">{t(section.headingKey)}</h2>
            )}
            {section.bodyKey && (
              <p className={`leading-8 text-slate-700 dark:text-slate-300 ${section.headingKey ? 'mt-4' : ''}`}>
                {t(section.bodyKey)}
              </p>
            )}
            {section.steps?.length > 0 && (
              <ol className="mt-5 space-y-3">
                {section.steps.map((stepKey, stepIndex) => (
                  <li key={stepKey} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-sm font-extrabold text-orange-600 dark:bg-orange-950 dark:text-orange-300">
                      {stepIndex + 1}
                    </span>
                    <span className="leading-7 text-slate-700 dark:text-slate-300">{t(stepKey)}</span>
                  </li>
                ))}
              </ol>
            )}
            {section.tipKey && <Callout type="tip" label={t('manual.tip')}>{t(section.tipKey)}</Callout>}
            {section.warningKey && <Callout type="warning" label={t('manual.warning')}>{t(section.warningKey)}</Callout>}
            {section.noteKey && <Callout type="note" label={t('manual.note')}>{t(section.noteKey)}</Callout>}
          </section>
        ))}
      </div>

      <footer className="mt-12 space-y-6 border-t border-slate-200 pt-8 dark:border-slate-800 no-print">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="font-bold text-slate-950 dark:text-white">{t('manual.article.feedback')}</p>
          {feedbackThanks ? (
            <p className="mt-3 text-sm text-emerald-600">{t('manual.article.feedbackThanks')}</p>
          ) : (
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={() => handleFeedback(true)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
                  feedback === true ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <ThumbsUp size={16} />
                {t('manual.article.feedbackYes')}
              </button>
              <button
                type="button"
                onClick={() => handleFeedback(false)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
                  feedback === false ? 'bg-slate-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <ThumbsDown size={16} />
                {t('manual.article.feedbackNo')}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          {prevTopic ? (
            <Link to={`/manual/${role}/${prevTopic.id}`} className="text-sm font-bold text-orange-600">
              ← {t('manual.article.prev')}: {t(prevTopic.titleKey)}
            </Link>
          ) : (
            <span />
          )}
          {nextTopic && (
            <Link to={`/manual/${role}/${nextTopic.id}`} className="text-sm font-bold text-orange-600 sm:text-right">
              {t('manual.article.next')}: {t(nextTopic.titleKey)} →
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
}

export default ManualArticle;
