import { Music, PlayCircle, SkipForward } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { resolvePretestMusicUrl } from '../data/pretestMusicOptions';

function PreTestMusicIntro({ settings, onStart, onSkip }) {
  const audioRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [playError, setPlayError] = useState('');

  const requireFinish = settings.pretestMusicRequireFinish !== false;
  const skippable = settings.pretestMusicSkippable === true;
  const volume = Number(settings.pretestMusicVolume ?? 0.7);
  const musicSrc = resolvePretestMusicUrl(settings.pretestMusicFile);
  const displayTitle = settings.pretestMusicTitle?.trim() || 'เพลงก่อนเริ่มแบบทดสอบก่อนเรียน';

  const canStart = !requireFinish || hasFinished;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    audio.volume = Math.min(1, Math.max(0, volume));

    const onEnded = () => setHasFinished(true);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [volume, musicSrc]);

  const handlePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setPlayError('');
    try {
      await audio.play();
      setHasStarted(true);
    } catch {
      setPlayError('กรุณากดปุ่มเล่นเพลงเพื่อเริ่มฟัง');
    }
  };

  const handleStart = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    onStart();
  };

  const handleSkip = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    onSkip();
  };

  return (
    <section className="mx-auto max-w-4xl">
      <div className="rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-200/80 sm:p-8 lg:p-10">
        <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-orange-600">
          Pre-Test
        </span>

        <div className="mt-6 flex flex-col items-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-200">
            <Music size={44} />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">
            เพลงก่อนเริ่มแบบทดสอบก่อนเรียน
          </h2>

          <p className="mt-3 text-lg font-semibold text-orange-600">{displayTitle}</p>

          {requireFinish && (
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
              ต้องฟังเพลงจบก่อนเริ่มทำแบบทดสอบก่อนเรียน
            </p>
          )}

          <audio ref={audioRef} src={musicSrc} preload="auto" className="hidden" />

          <div className="mt-8 flex w-full max-w-md flex-col gap-3">
            {!hasStarted ? (
              <button
                type="button"
                onClick={handlePlay}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
              >
                <PlayCircle size={24} />
                เล่นเพลง
              </button>
            ) : (
              <div className="rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-sm font-semibold text-orange-800">
                {hasFinished ? 'ฟังเพลงครบแล้ว — พร้อมเริ่มทำแบบทดสอบ' : 'กำลังเล่นเพลง... กรุณารอจนเพลงจบ'}
              </div>
            )}

            {playError && (
              <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{playError}</p>
            )}

            <button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              เริ่มทำแบบทดสอบก่อนเรียน
            </button>

            {skippable && (
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:text-orange-600"
              >
                <SkipForward size={18} />
                ข้ามเพลง
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PreTestMusicIntro;
