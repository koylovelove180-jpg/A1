import { useEffect, useState } from 'react';
import { useManualLocale } from '../../i18n/useManualLocale';

const CHECKLIST_KEY = 'manual_teacher_checklist';

const defaultItems = [
  { id: 'login', labelKey: 'manual.teacher.login.s1.step3' },
  { id: 'pretest', labelKey: 'manual.teacher.pretestSettings.s1.step1' },
  { id: 'music', labelKey: 'manual.teacher.pretestSettings.s2.step1' },
  { id: 'unlock', labelKey: 'manual.teacher.classroom.s1.step1' },
  { id: 'announce', labelKey: 'manual.teacher.announcements.s1.step1' },
  { id: 'save', labelKey: 'manual.teacher.classroom.s1.step3' },
];

function TeacherSetupChecklist() {
  const { t } = useManualLocale();
  const [checked, setChecked] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHECKLIST_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const toggle = (id) => {
    setChecked((current) => {
      const next = { ...current, [id]: !current[id] };
      try {
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const doneCount = defaultItems.filter((item) => checked[item.id]).length;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">{t('manual.checklist.title')}</h2>
      <p className="mt-2 text-sm text-slate-500">
        {doneCount}/{defaultItems.length}
      </p>
      <ul className="mt-4 space-y-2">
        {defaultItems.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60">
              <input
                type="checkbox"
                checked={Boolean(checked[item.id])}
                onChange={() => toggle(item.id)}
                className="mt-1 h-5 w-5 rounded accent-orange-500"
              />
              <span className={`leading-7 ${checked[item.id] ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                {t(item.labelKey)}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeacherSetupChecklist;
