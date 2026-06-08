export const TEACHER_HELP = {
  title: 'วิดีโอสอนการใช้งานระบบ (อาจารย์)',
  description: 'ดูขั้นตอนการตั้งค่าห้องเรียน Pre-Test Post-Test และประกาศ',
  videoFile: '/help/help.mp4',
  posterFile: '/help/help_First_Frame.png',
  fullPlayerPath: '/help/index.html',
  durationLabel: '~7 นาที',
};

export function resolveHelpAsset(path) {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${path.replace(/^\//, '')}`;
}
