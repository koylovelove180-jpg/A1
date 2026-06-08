import thCommon from '../locales/th/common.json';
import thDashboard from '../locales/th/dashboard.json';
import thStudent from '../locales/th/student.json';
import thTeacher from '../locales/th/teacher.json';
import thManualStudent from '../locales/th/manual-student.json';
import thManualTeacher from '../locales/th/manual-teacher.json';
import thMeta from '../locales/th/meta.json';
import enCommon from '../locales/en/common.json';
import enDashboard from '../locales/en/dashboard.json';
import enStudent from '../locales/en/student.json';
import enTeacher from '../locales/en/teacher.json';
import enManualStudent from '../locales/en/manual-student.json';
import enManualTeacher from '../locales/en/manual-teacher.json';
import enMeta from '../locales/en/meta.json';

export const LOCALE_STORAGE_KEY = 'app_locale';
const LEGACY_LOCALE_KEY = 'manual_locale';

export const bundles = {
  th: {
    ...thCommon,
    ...thDashboard,
    ...thStudent,
    ...thTeacher,
    ...thManualStudent,
    ...thManualTeacher,
    ...thMeta,
  },
  en: {
    ...enCommon,
    ...enDashboard,
    ...enStudent,
    ...enTeacher,
    ...enManualStudent,
    ...enManualTeacher,
    ...enMeta,
  },
};

export function getStoredLocale() {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === 'th' || stored === 'en') return stored;
    const legacy = localStorage.getItem(LEGACY_LOCALE_KEY);
    if (legacy === 'th' || legacy === 'en') {
      localStorage.setItem(LOCALE_STORAGE_KEY, legacy);
      return legacy;
    }
  } catch {
    // ignore
  }
  return 'th';
}

export function setStoredLocale(locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}

export function translate(locale, key, params = {}) {
  const primary = bundles[locale]?.[key];
  const fallback = locale !== 'th' ? bundles.th?.[key] : undefined;
  const enFallback = bundles.en?.[key];
  let text = primary ?? fallback ?? enFallback ?? key;

  Object.entries(params).forEach(([name, value]) => {
    text = text.replace(new RegExp(`\\{${name}\\}`, 'g'), String(value));
  });

  return text;
}

export function getAllStrings(locale) {
  return bundles[locale] ?? bundles.th;
}
