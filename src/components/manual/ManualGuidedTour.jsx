import { useEffect, useState } from 'react';
import { useManualLocale } from '../../i18n/useManualLocale';

const TOUR_KEY = 'manual_tour_completed';

const steps = [
  { titleKey: 'manual.tour.step1.title', bodyKey: 'manual.tour.step1.body' },
  { titleKey: 'manual.tour.step2.title', bodyKey: 'manual.tour.step2.body' },
  { titleKey: 'manual.tour.step3.title', bodyKey: 'manual.tour.step3.body' },
];

function ManualGuidedTour() {
  const { t } = useManualLocale();
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(TOUR_KEY)) setActive(true);
    } catch {
      // ignore
    }
  }, []);

  if (!active) return null;

  const finish = () => {
    try {
      localStorage.setItem(TOUR_KEY, '1');
    } catch {
      // ignore
    }
    setActive(false);
  };

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/60 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl dark:bg-slate-900">
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          {t('manual.tour.label')} {step + 1}/{steps.length}
        </p>
        <h2 className="mt-2 text-xl font-extrabold text-slate-950 dark:text-white">{t(current.titleKey)}</h2>
        <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{t(current.bodyKey)}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={finish}
            className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500"
          >
            {t('manual.tour.skip')}
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((value) => value + 1)}
              className="ml-auto rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white"
            >
              {t('manual.tour.next')}
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="ml-auto rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white"
            >
              {t('manual.tour.done')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManualGuidedTour;
