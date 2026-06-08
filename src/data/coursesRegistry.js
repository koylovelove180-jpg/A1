import { lessonData as culinaryLessonData } from './lessonData';

export const DEFAULT_COURSE_ID = 'cooking-basics';

/**
 * Course registry — add new subjects here without changing routing logic.
 * classroomId maps to Firestore lessonControls/{classroomId}
 */
export const COURSES = {
  [DEFAULT_COURSE_ID]: {
    id: DEFAULT_COURSE_ID,
    classroomId: DEFAULT_COURSE_ID,
    slug: DEFAULT_COURSE_ID,
    lessonData: culinaryLessonData,
  },
};

export function getCourse(courseId) {
  return COURSES[courseId] ?? COURSES[DEFAULT_COURSE_ID];
}

export function getCourseList() {
  return Object.values(COURSES);
}

export function isValidCourseId(courseId) {
  return Boolean(courseId && COURSES[courseId]);
}

export function resolveClassroomId(courseId = DEFAULT_COURSE_ID) {
  return getCourse(courseId).classroomId;
}
