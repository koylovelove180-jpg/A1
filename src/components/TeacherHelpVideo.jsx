import { ExternalLink, PlayCircle } from 'lucide-react';
import { TEACHER_HELP, resolveHelpAsset } from '../data/teacherHelp';

function TeacherHelpVideo({ compact = false }) {
  const videoSrc = resolveHelpAsset(TEACHER_HELP.videoFile);
  const posterSrc = resolveHelpAsset(TEACHER_HELP.posterFile);
  const fullPlayerUrl = resolveHelpAsset(TEACHER_HELP.fullPlayerPath);

  return (
    <section
      className={`rounded-[2rem] border border-slate-200 bg-white shadow-xl ${
        compact ? 'p-5' : 'p-6 sm:p-8'
      }`}
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
          <PlayCircle size={compact ? 22 : 26} />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">Help</p>
          <h2 className={`font-extrabold text-slate-950 ${compact ? 'text-lg' : 'text-2xl'}`}>
            {TEACHER_HELP.title}
          </h2>
          {!compact && (
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {TEACHER_HELP.description} ({TEACHER_HELP.durationLabel})
            </p>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-slate-950">
        <video
          className="aspect-video w-full"
          controls
          playsInline
          preload="metadata"
          poster={posterSrc}
          src={videoSrc}
        >
          <track kind="captions" />
        </video>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href={fullPlayerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:text-orange-600"
        >
          <ExternalLink size={18} />
          เปิดวิดีโอแบบเต็มจอ
        </a>
        {compact && (
          <span className="text-sm text-slate-500">ความยาว {TEACHER_HELP.durationLabel}</span>
        )}
      </div>
    </section>
  );
}

export default TeacherHelpVideo;
