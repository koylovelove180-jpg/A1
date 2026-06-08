export const TEACHER_USERNAME = 'admin';
export const TEACHER_EMAIL = import.meta.env.VITE_TEACHER_EMAIL || 'teacher.admin@example.com';

export const LESSON_CONTROLS_COLLECTION = 'lessonControls';

/** @deprecated Use DEFAULT_COURSE_ID from coursesRegistry */
export const LESSON_CONTROLS_DOC = 'cooking-basics';

export const DEFAULT_LESSON_CONTROLS = {
  contentUnlocked: false,
  postTestUnlocked: false,
  preTestRequired: true,
  courseTitle: 'การประกอบอาหารเบื้องต้น',
  classroomName: 'ห้องเรียนทั่วไป',
  announcement: '',
  announcementHtmlEnabled: false,
  pretestMusicEnabled: false,
  pretestMusicFile: '/audio/เรียน.mp3',
  pretestMusicTitle: '',
  pretestMusicRequireFinish: true,
  pretestMusicSkippable: false,
  pretestMusicVolume: 0.7,
};

export function isFirebaseConfigured() {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID &&
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  );
}
