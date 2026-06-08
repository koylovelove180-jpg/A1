import {
  BookOpen,
  ClipboardCheck,
  ExternalLink,
  Lock,
  LogOut,
  Music,
  PlayCircle,
  RotateCcw,
  Save,
  Unlock,
  UserCog,
} from 'lucide-react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import LocaleThemeControls from '../components/dashboard/LocaleThemeControls';
import DashboardLayout from '../layouts/DashboardLayout';
import TeacherGradeExport from '../components/TeacherGradeExport';
import { useAppLocale } from '../i18n/AppLocaleProvider';
import { TEACHER_EMAIL, TEACHER_USERNAME, isFirebaseConfigured } from '../config';
import AnnouncementContent from '../components/AnnouncementContent';
import AnnouncementQrTool from '../components/AnnouncementQrTool';
import TeacherHelpVideo from '../components/TeacherHelpVideo';
import { DEFAULT_COURSE_ID, getCourseList, isValidCourseId } from '../data/coursesRegistry';
import { PRETEST_MUSIC_OPTIONS, resolvePretestMusicUrl } from '../data/pretestMusicOptions';
import { auth } from '../firebase';
import { useLessonControls } from '../hooks/useLessonControls';

const TEACHER_GUIDE_STEP_KEYS = [
  'teacher.guide.step1',
  'teacher.guide.step2',
  'teacher.guide.step3',
  'teacher.guide.step4',
  'teacher.guide.step5',
  'teacher.guide.step6',
];

function ToggleRow({ label, description, enabled, onToggle }) {
  const { t } = useAppLocale();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-bold text-slate-950 dark:text-white">{label}</p>
        <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-lg transition ${
          enabled ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-600 hover:bg-slate-700'
        }`}
      >
        {enabled ? <Unlock size={18} /> : <Lock size={18} />}
        {enabled ? t('app.toggle.open') : t('app.toggle.closed')}
      </button>
    </div>
  );
}

function TeacherLogin({ onLoginSuccess, error, loading }) {
  const { t } = useAppLocale();
  const [username, setUsername] = useState(TEACHER_USERNAME);
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onLoginSuccess(username, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex justify-end">
          <LocaleThemeControls />
        </div>
        <div className="rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-200/80 dark:bg-slate-900 dark:shadow-none">
          <div className="mb-6 inline-flex rounded-2xl bg-orange-100 p-4 text-orange-600">
            <UserCog size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">{t('teacher.login.title')}</h1>
          <p className="mt-3 leading-8 text-slate-600 dark:text-slate-400">
            {t('teacher.login.desc', { username: TEACHER_USERNAME })}
          </p>

          {!isFirebaseConfigured() && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              {t('teacher.login.firebaseWarning')}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('teacher.login.username')}</span>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-orange-200 focus:ring-2"
                autoComplete="username"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('teacher.login.password')}</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-orange-200 focus:ring-2"
                autoComplete="current-password"
              />
            </label>

            {error ? (
              <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white shadow-lg transition hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? t('teacher.login.submitting') : t('teacher.login.submit')}
            </button>
          </form>

          <Link
            to={`/student/${DEFAULT_COURSE_ID}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            <ExternalLink size={16} />
            {t('teacher.login.goStudent')}
          </Link>
        </div>

        <TeacherHelpVideo compact />
        <Link
          to="/manual/teacher"
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
        >
          <BookOpen size={16} />
          {t('teacher.login.fullManual')}
        </Link>
      </div>
    </div>
  );
}

function MusicPreviewButton({ filePath, volume }) {
  const { t } = useAppLocale();
  const audioRef = useRef(null);

  const handlePreview = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.min(1, Math.max(0, Number(volume ?? 0.7)));
    audio.currentTime = 0;
    try {
      await audio.play();
    } catch {
      // autoplay blocked — ignore
    }
  };

  return (
    <>
      <audio ref={audioRef} src={resolvePretestMusicUrl(filePath)} preload="none" className="hidden" />
      <button
        type="button"
        onClick={handlePreview}
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:text-orange-600"
      >
        <PlayCircle size={18} />
        {t('teacher.music.preview')}
      </button>
    </>
  );
}

function TeacherDashboard({ user, onLogout, courseId }) {
  const { t } = useAppLocale();
  const navigate = useNavigate();
  const courses = getCourseList();
  const { settings, loading, error, isRemote, classroomId, saveSettings, resetSettings } = useLessonControls(courseId);
  const [draft, setDraft] = useState(settings);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    setSaveError('');
    try {
      await saveSettings(draft, user?.email || TEACHER_USERNAME);
      setSaveMessage(t('teacher.save.success'));
    } catch (saveErr) {
      setSaveError(saveErr.message || t('teacher.save.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    setSaveMessage('');
    setSaveError('');
    try {
      await resetSettings(user?.email || TEACHER_USERNAME);
      setSaveMessage(t('teacher.reset.success'));
    } catch (resetErr) {
      setSaveError(resetErr.message || t('teacher.reset.error'));
    } finally {
      setSaving(false);
    }
  };

  const toggleField = (field) => {
    setDraft((current) => ({ ...current, [field]: !current[field] }));
  };

  const topBarActions = (
    <>
      <Link
        to={`/student/${courseId}`}
        className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:text-orange-600 sm:inline-flex dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        <ExternalLink size={16} />
        {t('teacher.dashboard.viewStudent')}
      </Link>
      <button
        type="button"
        onClick={onLogout}
        className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-900"
      >
        <LogOut size={16} />
        {t('teacher.dashboard.logout')}
      </button>
    </>
  );

  return (
    <DashboardLayout variant="teacher" topBarActions={topBarActions}>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[2rem] bg-white p-6 shadow-xl dark:bg-slate-900">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">{t('teacher.dashboard.eyebrow')}</p>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {user?.email || t('teacher.dashboard.modeLocal')} ·{' '}
            {isRemote ? t('teacher.dashboard.modeFirestore') : t('teacher.dashboard.modeLocalStorage')}
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-xl dark:bg-slate-900">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('teacher.course.select')}</span>
            <select
              value={courseId}
              onChange={(event) => navigate(`/teacher/${event.target.value}`)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-orange-200 focus:ring-2 dark:border-slate-700 dark:bg-slate-900"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.id}
                </option>
              ))}
            </select>
          </label>
        </div>

        {(error || saveError) && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            {saveError || error}
          </div>
        )}

        {saveMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
            {saveMessage}
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-6 shadow-xl dark:bg-slate-900">
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">{t('teacher.status.title')}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('teacher.status.desc')}</p>
            <div className="mt-5 space-y-3">
              <ToggleRow
                label={t('teacher.toggle.unlockLessons')}
                description={t('teacher.toggle.unlockLessonsDesc')}
                enabled={draft.contentUnlocked}
                onToggle={() => toggleField('contentUnlocked')}
              />
              <ToggleRow
                label={t('teacher.toggle.postTest')}
                description={t('teacher.toggle.postTestDesc')}
                enabled={draft.postTestUnlocked}
                onToggle={() => toggleField('postTestUnlocked')}
              />
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                <Music size={22} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">{t('teacher.pretest.title')}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('teacher.pretest.desc')}</p>
              </div>
            </div>
            <div className="space-y-3">
              <ToggleRow
                label={t('teacher.toggle.requirePretest')}
                description={t('teacher.toggle.requirePretestDesc')}
                enabled={draft.preTestRequired}
                onToggle={() => toggleField('preTestRequired')}
              />
              <ToggleRow
                label={t('teacher.toggle.musicIntro')}
                description={t('teacher.toggle.musicIntroDesc')}
                enabled={draft.pretestMusicEnabled}
                onToggle={() => toggleField('pretestMusicEnabled')}
              />
              {draft.pretestMusicEnabled && (
                <div className="space-y-4 rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('teacher.music.select')}</span>
                    <select
                      value={draft.pretestMusicFile}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, pretestMusicFile: event.target.value }))
                      }
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-orange-200 focus:ring-2"
                    >
                      {PRETEST_MUSIC_OPTIONS.map((option) => (
                        <option key={option.file} value={option.file}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('teacher.music.titleLabel')}</span>
                    <input
                      type="text"
                      value={draft.pretestMusicTitle}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, pretestMusicTitle: event.target.value }))
                      }
                      placeholder={t('teacher.music.titlePlaceholder')}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-orange-200 focus:ring-2"
                    />
                  </label>
                  <ToggleRow
                    label={t('teacher.toggle.requireFinish')}
                    description={t('teacher.toggle.requireFinishDesc')}
                    enabled={draft.pretestMusicRequireFinish}
                    onToggle={() => toggleField('pretestMusicRequireFinish')}
                  />
                  <ToggleRow
                    label={t('teacher.toggle.allowSkip')}
                    description={t('teacher.toggle.allowSkipDesc')}
                    enabled={draft.pretestMusicSkippable}
                    onToggle={() => toggleField('pretestMusicSkippable')}
                  />
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {t('teacher.music.volume', { percent: Math.round((draft.pretestMusicVolume ?? 0.7) * 100) })}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={draft.pretestMusicVolume ?? 0.7}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          pretestMusicVolume: Number(event.target.value),
                        }))
                      }
                      className="mt-3 w-full accent-orange-500"
                    />
                  </label>
                  <MusicPreviewButton filePath={draft.pretestMusicFile} volume={draft.pretestMusicVolume} />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-1">
          <div className="rounded-[2rem] bg-white p-6 shadow-xl dark:bg-slate-900 lg:col-span-1">
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">{t('teacher.classroom.title')}</h2>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('teacher.classroom.courseTitle')}</span>
                <input
                  type="text"
                  value={draft.courseTitle}
                  onChange={(event) => setDraft((current) => ({ ...current, courseTitle: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-orange-200 focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('teacher.classroom.classroomName')}</span>
                <input
                  type="text"
                  value={draft.classroomName}
                  onChange={(event) => setDraft((current) => ({ ...current, classroomName: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-orange-200 focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('teacher.classroom.announcement')}</span>
                <ToggleRow
                  label={t('teacher.classroom.htmlToggle')}
                  description={t('teacher.classroom.htmlToggleDesc')}
                  enabled={draft.announcementHtmlEnabled}
                  onToggle={() => toggleField('announcementHtmlEnabled')}
                />
                <textarea
                  rows={draft.announcementHtmlEnabled ? 8 : 4}
                  value={draft.announcement}
                  onChange={(event) => setDraft((current) => ({ ...current, announcement: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-mono text-sm outline-none ring-orange-200 focus:ring-2"
                  placeholder={
                    draft.announcementHtmlEnabled
                      ? 'เช่น <p>สแกน QR เพื่อเข้าร่วม</p><img src="https://..." alt="QR Code" width="200" />'
                      : 'เช่น วันนี้ให้ทำ Pre-Test ก่อน 09:30 น.'
                  }
                />
                {draft.announcementHtmlEnabled && draft.announcement ? (
                  <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">{t('teacher.classroom.preview')}</p>
                    <AnnouncementContent
                      content={draft.announcement}
                      htmlEnabled={draft.announcementHtmlEnabled}
                    />
                  </div>
                ) : null}
                {draft.announcementHtmlEnabled ? (
                  <div className="mt-4">
                    <AnnouncementQrTool
                      htmlEnabled={draft.announcementHtmlEnabled}
                      onEnableHtml={() =>
                        setDraft((current) => ({ ...current, announcementHtmlEnabled: true }))
                      }
                      onInsert={(snippet) =>
                        setDraft((current) => ({
                          ...current,
                          announcementHtmlEnabled: true,
                          announcement: current.announcement
                            ? `${current.announcement.trim()}\n\n${snippet}`
                            : snippet,
                        }))
                      }
                    />
                  </div>
                ) : null}
              </label>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white shadow-lg transition hover:bg-orange-600 disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? t('teacher.save.saving') : t('teacher.save.btn')}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-200 px-5 py-3 font-bold text-slate-800 transition hover:bg-slate-300 disabled:opacity-60 dark:bg-slate-700 dark:text-slate-100"
          >
            <RotateCcw size={18} />
            {t('teacher.reset.btn')}
          </button>
        </div>

        <TeacherGradeExport classroomId={classroomId} courseId={courseId} />

        <section className="rounded-[2rem] bg-white p-6 shadow-xl dark:bg-slate-900 sm:p-8">
          <TeacherHelpVideo />
          <Link
            to="/manual/teacher"
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            <BookOpen size={18} />
            {t('teacher.guide.fullManual')}
          </Link>

          <div className="mb-6 mt-8 flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">{t('teacher.guide.eyebrow')}</p>
              <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">{t('teacher.guide.title')}</h2>
            </div>
          </div>
          <ol className="space-y-3">
            {TEACHER_GUIDE_STEP_KEYS.map((stepKey, index) => (
              <li key={stepKey} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-sm font-extrabold text-orange-600">
                  {index + 1}
                </span>
                <span className="leading-7 text-slate-700 dark:text-slate-300">{t(stepKey)}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm leading-7 text-orange-900 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-100">
            <p className="font-bold">{t('teacher.guide.tip')}</p>
            <p className="mt-1 flex items-start gap-2">
              <ClipboardCheck size={18} className="mt-0.5 shrink-0" />
              {t('teacher.guide.tipBody')}
            </p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function TeacherApp() {
  const { courseId: routeCourseId } = useParams();
  const courseId = routeCourseId && isValidCourseId(routeCourseId) ? routeCourseId : DEFAULT_COURSE_ID;
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      const localSession = sessionStorage.getItem('teacherSession') === 'true';
      setUser(localSession ? { email: TEACHER_USERNAME } : null);
      setAuthLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogin = async (username, password) => {
    setLoginError('');
    setLoginLoading(true);

    try {
      if (username.trim() !== TEACHER_USERNAME) {
        throw new Error('Username ไม่ถูกต้อง');
      }

      if (!isFirebaseConfigured() || !auth) {
        if (!password) {
          throw new Error('กรุณากรอกรหัสผ่าน');
        }
        sessionStorage.setItem('teacherSession', 'true');
        setUser({ email: TEACHER_USERNAME });
        return;
      }

      await signInWithEmailAndPassword(auth, TEACHER_EMAIL, password);
    } catch (err) {
      setLoginError(err.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('teacherSession');
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg font-semibold text-slate-600">กำลังตรวจสอบสถานะ...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <TeacherLogin
        error={loginError}
        loading={loginLoading}
        onLoginSuccess={handleLogin}
      />
    );
  }

  if (routeCourseId && !isValidCourseId(routeCourseId)) {
    return <Navigate to={`/teacher/${DEFAULT_COURSE_ID}`} replace />;
  }

  return <TeacherDashboard user={user} onLogout={handleLogout} courseId={courseId} />;
}

export default TeacherApp;
