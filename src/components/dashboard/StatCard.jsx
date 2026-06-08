import { Lock, Unlock } from 'lucide-react';

function StatCard({ label, value, unlocked }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-3 flex items-center gap-2">
        {unlocked !== undefined && (
          unlocked ? (
            <Unlock size={18} className="text-emerald-500" />
          ) : (
            <Lock size={18} className="text-slate-400" />
          )
        )}
        <p className="text-lg font-extrabold text-slate-950 dark:text-white">{value}</p>
      </div>
    </article>
  );
}

export default StatCard;
