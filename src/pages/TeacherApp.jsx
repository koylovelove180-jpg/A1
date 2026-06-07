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
import { Link } from 'react-router-dom';
import { TEACHER_EMAIL, TEACHER_USERNAME, isFirebaseConfigured } from '../config';
import { PRETEST_MUSIC_OPTIONS, resolvePretestMusicUrl } from '../data/pretestMusicOptions';
import { auth } from '../firebase';
import { useLessonControls } from '../hooks/useLessonControls';

const teacherSteps = [
  'ส่งลิงก์ /student หรือ / ให้นักศึกษาเข้าเรียน',
  'ให้นักศึกษากดปุ่มเริ่มทำ Pre-Test และตอบให้ครบ 10 ข้อ',
  'รอให้นักศึกษาทำแบบทดสอบก่อนเรียนเสร็จ',
  'ตรวจสถานะห้องเรียนในแผงควบคุมด้านล่าง',
  'กดเปิดบทเรียน เมื่อต้องการให้นักศึกษาเห็นเนื้อหา',
  'เปิด Post-Test เมื่อพร้อมให้ทำแบบทดสอบหลังเรียน',
];

function ToggleRow({ label, description, enabled, onToggle }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-bold text-slate-950">{label}</p>
        <p className="mt-1 text-sm leading-7 text-slate-600">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-lg transition ${
          enabled ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-600 hover:bg-slate-700'
        }`}
      >
        {enabled ? <Unlock size={18} /> : <Lock size={18} />}
        {enabled ? 'เปิดอยู่' : 'ปิดอยู่'}
      </button>
    </div>
  );
}

function TeacherLogin({ onLoginSuccess, error, loading }) {
  const [username, setUsername] = useState(TEACHER_USERNAME);
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onLoginSuccess(username, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-200/80">
        <div className="mb-6 inline-flex rounded-2xl bg-orange-100 p-4 text-orange-600">
          <UserCog size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-950">เข้าสู่ระบบอาจารย์</h1>
        <p className="mt-3 leading-8 text-slate-600">
          ใช้ username <span className="font-bold">{TEACHER_USERNAME}</span> และรหัสผ่านที่ตั้งใน Firebase Auth
        </p>

        {!isFirebaseConfigured() && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
            ยังไม่ได้ตั้งค่า Firebase — ระบบใช้โหมดทดสอบในเครื่อง (localStorage) สำหรับบันทึกการตั้งค่า
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-orange-200 focus:ring-2"
              autoComplete="username"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
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
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <Link
          to="/student"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          <ExternalLink size={16} />
          ไปหน้านักศึกษา
        </Link>
      </div>
    </div>
  );
}

function MusicPreviewButton({ filePath, volume }) {
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
        ฟังตัวอย่าง
      </button>
    </>
  );
}

function TeacherDashboard({ user, onLogout }) {
  const { settings, loading, error, isRemote, saveSettings, resetSettings } = useLessonControls();
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
      setSaveMessage('บันทึกการตั้งค่าเรียบร้อยแล้ว');
    } catch (saveErr) {
      setSaveError(saveErr.message || 'บันทึกไม่สำเร็จ');
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
      setSaveMessage('รีเซ็ตห้องเรียนเป็นค่าเริ่มต้นแล้ว');
    } catch (resetErr) {
      setSaveError(resetErr.message || 'รีเซ็ตไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  const toggleField = (field) => {
    setDraft((current) => ({ ...current, [field]: !current[field] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">Teacher Dashboard</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950">แผงควบคุมห้องเรียน</h1>
            <p className="mt-2 text-slate-600">
              {user?.email || 'โหมดทดสอบในเครื่อง'} · {isRemote ? 'เชื่อมต่อ Firestore แล้ว' : 'ใช้ localStorage'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/student"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:text-orange-600"
            >
              <ExternalLink size={18} />
              ดูมุมนักศึกษา
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-900"
            >
              <LogOut size={18} />
              ออกจากระบบ
            </button>
          </div>
        </header>

        {(error || saveError) && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {saveError || error}
          </div>
        )}

        {saveMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            {saveMessage}
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-6 shadow-xl">
            <h2 className="text-xl font-extrabold text-slate-950">สถานะห้องเรียน</h2>
            <p className="mt-2 text-sm text-slate-600">กดสลับสถานะแล้วกดบันทึก — นักศึกษาจะเห็นการเปลี่ยนแปลงทันที</p>
            <div className="mt-5 space-y-3">
              <ToggleRow
                label="เปิดบทเรียน"
                description="นักศึกษาเห็นเนื้อหาหลัก (หน้า 3–11)"
                enabled={draft.contentUnlocked}
                onToggle={() => toggleField('contentUnlocked')}
              />
              <ToggleRow
                label="เปิด Post-Test"
                description="อนุญาตให้ทำแบบทดสอบหลังเรียน"
                enabled={draft.postTestUnlocked}
                onToggle={() => toggleField('postTestUnlocked')}
              />
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
                <Music size={22} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-950">แบบทดสอบก่อนเรียน</h2>
                <p className="mt-1 text-sm text-slate-600">ตั้งค่า Pre-Test และเพลงก่อนเริ่มทำข้อสอบเท่านั้น</p>
              </div>
            </div>
            <div className="space-y-3">
              <ToggleRow
                label="บังคับทำ Pre-Test"
                description="แนะนำให้เปิดไว้เพื่อวัดความรู้ก่อนเรียน"
                enabled={draft.preTestRequired}
                onToggle={() => toggleField('preTestRequired')}
              />
              <ToggleRow
                label="เปิดเพลงก่อนเริ่ม Pre-test"
                description="นักเรียนจะเห็นหน้าฟังเพลงก่อนเข้าข้อสอบ Pre-Test"
                enabled={draft.pretestMusicEnabled}
                onToggle={() => toggleField('pretestMusicEnabled')}
              />
              {draft.pretestMusicEnabled && (
                <div className="space-y-4 rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">เลือกเพลงสำหรับแบบทดสอบก่อนเรียน</span>
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
                    <span className="text-sm font-semibold text-slate-700">ชื่อเพลงแสดงบนหน้ intro (ไม่บังคับ)</span>
                    <input
                      type="text"
                      value={draft.pretestMusicTitle}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, pretestMusicTitle: event.target.value }))
                      }
                      placeholder="เช่น เพลงก่อนเริ่มแบบทดสอบก่อนเรียน"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-orange-200 focus:ring-2"
                    />
                  </label>
                  <ToggleRow
                    label="ต้องฟังจบก่อนเริ่ม"
                    description="ปุ่มเริ่มทำแบบทดสอบก่อนเรียนจะเปิดเมื่อเพลงเล่นจบ"
                    enabled={draft.pretestMusicRequireFinish}
                    onToggle={() => toggleField('pretestMusicRequireFinish')}
                  />
                  <ToggleRow
                    label="อนุญาตข้ามเพลง"
                    description="แสดงปุ่มข้ามเพลงแม้ยังฟังไม่จบ"
                    enabled={draft.pretestMusicSkippable}
                    onToggle={() => toggleField('pretestMusicSkippable')}
                  />
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">
                      ระดับเสียง ({Math.round((draft.pretestMusicVolume ?? 0.7) * 100)}%)
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
          <div className="rounded-[2rem] bg-white p-6 shadow-xl lg:col-span-1">
            <h2 className="text-xl font-extrabold text-slate-950">ข้อมูลห้องเรียน</h2>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">ชื่อรายวิชา</span>
                <input
                  type="text"
                  value={draft.courseTitle}
                  onChange={(event) => setDraft((current) => ({ ...current, courseTitle: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-orange-200 focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">ชื่อห้อง / กลุ่มเรียน</span>
                <input
                  type="text"
                  value={draft.classroomName}
                  onChange={(event) => setDraft((current) => ({ ...current, classroomName: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-orange-200 focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">ประกาศถึงนักศึกษา</span>
                <textarea
                  rows={4}
                  value={draft.announcement}
                  onChange={(event) => setDraft((current) => ({ ...current, announcement: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-orange-200 focus:ring-2"
                  placeholder="เช่น วันนี้ให้ทำ Pre-Test ก่อน 09:30 น."
                />
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
            {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-200 px-5 py-3 font-bold text-slate-800 transition hover:bg-slate-300 disabled:opacity-60"
          >
            <RotateCcw size={18} />
            รีเซ็ตห้องเรียน
          </button>
        </div>

        <section className="rounded-[2rem] bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">Teacher Guide</p>
              <h2 className="text-2xl font-extrabold text-slate-950">คู่มืออาจารย์ทีละขั้นตอน</h2>
            </div>
          </div>
          <ol className="space-y-3">
            {teacherSteps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-sm font-extrabold text-orange-600">
                  {index + 1}
                </span>
                <span className="leading-7 text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm leading-7 text-orange-900">
            <p className="font-bold">เคล็ดลับ</p>
            <p className="mt-1 flex items-start gap-2">
              <ClipboardCheck size={18} className="mt-0.5 shrink-0" />
              เปิดแท็บ /student คู่กับ /teacher เพื่อดูผลลัพธ์แบบ realtime ขณะสอน
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function TeacherApp() {
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

  return <TeacherDashboard user={user} onLogout={handleLogout} />;
}

export default TeacherApp;
