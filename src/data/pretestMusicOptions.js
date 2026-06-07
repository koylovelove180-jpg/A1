export const PRETEST_MUSIC_OPTIONS = [
  { file: '/audio/เรียน.mp3', label: 'เรียน' },
  { file: '/audio/เรียนแบบชิล ๆ.mp3', label: 'เรียนแบบชิล ๆ' },
];

export function resolvePretestMusicUrl(filePath) {
  if (!filePath) return '';
  const base = import.meta.env.BASE_URL || '/';
  const path = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  return encodeURI(`${base}${path}`);
}
