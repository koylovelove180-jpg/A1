import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function RoleCard({ to, icon: Icon, title, description, accent = 'orange' }) {
  const accents = {
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300',
  };

  return (
    <Link
      to={to}
      className="group flex flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl transition hover:border-orange-200 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-900 sm:p-8"
    >
      <div className={`mb-5 inline-flex w-fit rounded-2xl p-4 ${accents[accent]}`}>
        <Icon size={32} />
      </div>
      <h2 className="text-xl font-extrabold text-slate-950 dark:text-white sm:text-2xl">{title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 leading-7 text-slate-600 dark:text-slate-400">{description}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-orange-600">
        <ChevronRight size={18} className="transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export default RoleCard;
