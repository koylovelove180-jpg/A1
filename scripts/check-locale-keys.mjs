import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'locales');

function loadJson(locale, file) {
  return JSON.parse(readFileSync(join(root, locale, file), 'utf8'));
}

const thFiles = [
  'common.json',
  'dashboard.json',
  'student.json',
  'teacher.json',
  'manual-student.json',
  'manual-teacher.json',
  'meta.json',
];

const enFiles = [...thFiles];

function collectKeys(locale, files) {
  const keys = new Set();
  files.forEach((file) => {
    Object.keys(loadJson(locale, file)).forEach((key) => keys.add(key));
  });
  return keys;
}

const thKeys = collectKeys('th', thFiles);
const enKeys = collectKeys('en', enFiles);

const missingInEn = [...thKeys].filter((key) => !enKeys.has(key)).sort();
const missingInTh = [...enKeys].filter((key) => !thKeys.has(key)).sort();

if (missingInEn.length === 0 && missingInTh.length === 0) {
  console.log(`Locale key parity OK (${thKeys.size} keys)`);
  process.exit(0);
}

if (missingInEn.length > 0) {
  console.error(`Missing in en (${missingInEn.length}):`);
  missingInEn.forEach((key) => console.error(`  - ${key}`));
}

if (missingInTh.length > 0) {
  console.error(`Missing in th (${missingInTh.length}):`);
  missingInTh.forEach((key) => console.error(`  - ${key}`));
}

process.exit(1);
