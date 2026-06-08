import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_LESSON_CONTROLS,
  LESSON_CONTROLS_COLLECTION,
  isFirebaseConfigured,
} from '../config';
import { resolveClassroomId } from '../data/coursesRegistry';
import { db } from '../firebase';

function localStorageKey(classroomId) {
  return `lessonControlsFallback_${classroomId}`;
}

function readLocalControls(classroomId) {
  try {
    const key = localStorageKey(classroomId);
    let raw = localStorage.getItem(key);
    if (!raw && classroomId === 'cooking-basics') {
      const legacy = localStorage.getItem('lessonControlsFallback');
      if (legacy) {
        localStorage.setItem(key, legacy);
        raw = legacy;
      }
    }
    if (!raw) return { ...DEFAULT_LESSON_CONTROLS, courseId: classroomId };
    return { ...DEFAULT_LESSON_CONTROLS, courseId: classroomId, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_LESSON_CONTROLS, courseId: classroomId };
  }
}

function writeLocalControls(classroomId, nextSettings) {
  localStorage.setItem(localStorageKey(classroomId), JSON.stringify(nextSettings));
}

export function useLessonControls(courseId) {
  const classroomId = useMemo(
    () => (courseId ? resolveClassroomId(courseId) : resolveClassroomId()),
    [courseId],
  );

  const [settings, setSettings] = useState(() => readLocalControls(classroomId));
  const [loading, setLoading] = useState(isFirebaseConfigured());
  const [error, setError] = useState('');
  const [isRemote, setIsRemote] = useState(isFirebaseConfigured());

  useEffect(() => {
    setSettings(readLocalControls(classroomId));
  }, [classroomId]);

  useEffect(() => {
    if (!isFirebaseConfigured() || !db) {
      setLoading(false);
      setIsRemote(false);
      return undefined;
    }

    const ref = doc(db, LESSON_CONTROLS_COLLECTION, classroomId);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings({ ...DEFAULT_LESSON_CONTROLS, courseId: classroomId, ...snapshot.data() });
        } else {
          setSettings({ ...DEFAULT_LESSON_CONTROLS, courseId: classroomId });
        }
        setLoading(false);
        setError('');
        setIsRemote(true);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setSettings(readLocalControls(classroomId));
        setLoading(false);
        setIsRemote(false);
      },
    );

    return unsubscribe;
  }, [classroomId]);

  useEffect(() => {
    if (isFirebaseConfigured()) return undefined;

    const key = localStorageKey(classroomId);
    const onStorage = (event) => {
      if (event.key === key) {
        setSettings(readLocalControls(classroomId));
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [classroomId]);

  const saveSettings = useCallback(async (partialSettings, updatedBy = 'teacher') => {
    const nextSettings = {
      ...settings,
      ...partialSettings,
      courseId: classroomId,
      updatedAt: new Date().toISOString(),
      updatedBy,
    };

    if (!isFirebaseConfigured() || !db) {
      writeLocalControls(classroomId, nextSettings);
      setSettings(nextSettings);
      return nextSettings;
    }

    const ref = doc(db, LESSON_CONTROLS_COLLECTION, classroomId);
    await setDoc(
      ref,
      {
        ...nextSettings,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return nextSettings;
  }, [classroomId, settings]);

  const resetSettings = useCallback(async (updatedBy = 'teacher') => {
    return saveSettings({ ...DEFAULT_LESSON_CONTROLS, courseId: classroomId }, updatedBy);
  }, [classroomId, saveSettings]);

  return {
    settings,
    loading,
    error,
    isRemote,
    classroomId,
    courseId: classroomId,
    saveSettings,
    resetSettings,
  };
}
