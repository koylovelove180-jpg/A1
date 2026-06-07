import { useState } from 'react';
import PreTestMusicIntro from './PreTestMusicIntro';
import {
  isPretestMusicCompleted,
  markPretestMusicCompleted,
} from '../utils/pretestMusicStorage';

function PreTestQuizFlow({ page, settings, QuizPage }) {
  const musicEnabled = settings.pretestMusicEnabled === true;
  const alreadyCompleted = isPretestMusicCompleted(page.id);
  const [introDone, setIntroDone] = useState(alreadyCompleted);

  if (!musicEnabled || introDone) {
    return <QuizPage page={page} />;
  }

  const finishIntro = () => {
    markPretestMusicCompleted(page.id);
    setIntroDone(true);
  };

  return (
    <PreTestMusicIntro
      settings={settings}
      onStart={finishIntro}
      onSkip={finishIntro}
    />
  );
}

export default PreTestQuizFlow;
