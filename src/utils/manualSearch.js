import { translate } from '../i18n/manualLocale';
import { studentTopics } from '../data/manual/studentTopics';
import { teacherTopics } from '../data/manual/teacherTopics';

function collectTopicText(topic, locale) {
  const parts = [
    translate(locale, topic.titleKey),
    translate(locale, topic.summaryKey),
  ];

  topic.sections?.forEach((section) => {
    if (section.headingKey) parts.push(translate(locale, section.headingKey));
    if (section.bodyKey) parts.push(translate(locale, section.bodyKey));
    section.steps?.forEach((key) => parts.push(translate(locale, key)));
    if (section.tipKey) parts.push(translate(locale, section.tipKey));
    if (section.noteKey) parts.push(translate(locale, section.noteKey));
    if (section.warningKey) parts.push(translate(locale, section.warningKey));
  });

  return parts.join(' ').toLowerCase();
}

export function searchManualTopics(query, role, locale) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const topics = role === 'teacher' ? teacherTopics : role === 'student' ? studentTopics : [...studentTopics, ...teacherTopics];

  return topics
    .map((topic) => {
      const haystack = collectTopicText(topic, locale);
      const title = translate(locale, topic.titleKey).toLowerCase();
      const score = title.includes(normalized) ? 3 : haystack.includes(normalized) ? 1 : 0;
      return { topic, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.topic);
}

export function getTopicsForRole(role) {
  return role === 'teacher' ? teacherTopics : studentTopics;
}

export function getTopicById(role, topicId) {
  const topics = getTopicsForRole(role);
  return topics.find((topic) => topic.id === topicId);
}
