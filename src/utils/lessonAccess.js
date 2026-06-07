export function isAlwaysOpenPage(page) {
  return page.type === 'home' || page.quizMode === 'pre';
}

export function isPageLocked(page, settings) {
  if (!settings) return true;

  if (page.type === 'home') return false;

  if (page.quizMode === 'pre') {
    return false;
  }

  if (page.quizMode === 'post') {
    return !settings.contentUnlocked || !settings.postTestUnlocked;
  }

  return !settings.contentUnlocked;
}

export function isPreTestStartBlocked(settings) {
  return settings?.preTestRequired === false;
}
