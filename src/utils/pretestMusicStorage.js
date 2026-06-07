export function pretestMusicStorageKey(quizId) {
  return `quiz_pretest_music_completed_${quizId}`;
}

export function isPretestMusicCompleted(quizId) {
  try {
    return localStorage.getItem(pretestMusicStorageKey(quizId)) === 'true';
  } catch {
    return false;
  }
}

export function markPretestMusicCompleted(quizId) {
  try {
    localStorage.setItem(pretestMusicStorageKey(quizId), 'true');
  } catch {
    // ignore quota / private mode
  }
}

export function clearPretestMusicCompleted(quizId) {
  try {
    localStorage.removeItem(pretestMusicStorageKey(quizId));
  } catch {
    // ignore
  }
}
