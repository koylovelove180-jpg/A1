import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { isFirebaseConfigured } from '../config';
import { db } from '../firebase';

export const QUIZ_ATTEMPTS_COLLECTION = 'quizAttempts';

const STUDENT_ID_KEY = 'elearning_student_id';

export function getOrCreateStudentId() {
  try {
    let id = localStorage.getItem(STUDENT_ID_KEY);
    if (!id) {
      id = `student_${crypto.randomUUID()}`;
      localStorage.setItem(STUDENT_ID_KEY, id);
    }
    return id;
  } catch {
    return `student_anon_${Date.now()}`;
  }
}

export async function saveQuizAttempt({
  classroomId,
  courseId,
  pageId,
  quizMode,
  score,
  total,
  passed,
}) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const payload = {
    classroomId,
    courseId,
    pageId,
    quizMode,
    score,
    total,
    passed,
    percentage,
    studentId: getOrCreateStudentId(),
    completedAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured() || !db) {
    try {
      const key = `quizAttempts_${classroomId}`;
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      list.push({ ...payload, id: `local_${Date.now()}` });
      localStorage.setItem(key, JSON.stringify(list));
    } catch {
      // ignore
    }
    return payload;
  }

  await addDoc(collection(db, QUIZ_ATTEMPTS_COLLECTION), payload);
  return payload;
}

export async function fetchQuizAttempts(classroomId, courseId = null) {
  if (!isFirebaseConfigured() || !db) {
    try {
      const key = `quizAttempts_${classroomId}`;
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      return courseId ? list.filter((item) => item.courseId === courseId) : list;
    } catch {
      return [];
    }
  }

  const constraints = [where('classroomId', '==', classroomId)];
  if (courseId) {
    constraints.push(where('courseId', '==', courseId));
  }

  const snapshot = await getDocs(
    query(collection(db, QUIZ_ATTEMPTS_COLLECTION), ...constraints),
  );

  let list = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  list.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  return list;
}

export function exportAttemptsToCsv(attempts, filename = 'quiz-grades.csv') {
  const headers = ['completedAt', 'studentId', 'quizMode', 'pageId', 'score', 'total', 'percentage', 'passed'];
  const rows = attempts.map((row) =>
    headers.map((key) => {
      const value = row[key];
      if (value === true) return 'yes';
      if (value === false) return 'no';
      return String(value ?? '').replace(/"/g, '""');
    }),
  );

  const csv = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
