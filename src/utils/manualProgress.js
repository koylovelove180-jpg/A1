const PROGRESS_KEY = 'manual_read_progress';
const FEEDBACK_KEY = 'manual_article_feedback';

export function getReadProgress(role) {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[role] ?? [];
  } catch {
    return [];
  }
}

export function markTopicRead(role, topicId) {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    const set = new Set(all[role] ?? []);
    set.add(topicId);
    all[role] = [...set];
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function isTopicRead(role, topicId) {
  return getReadProgress(role).includes(topicId);
}

export function saveArticleFeedback(role, topicId, helpful) {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[`${role}:${topicId}`] = helpful;
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function getArticleFeedback(role, topicId) {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[`${role}:${topicId}`] ?? null;
  } catch {
    return null;
  }
}
