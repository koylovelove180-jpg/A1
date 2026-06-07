import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_LESSON_CONTROLS,
  LESSON_CONTROLS_COLLECTION,
  LESSON_CONTROLS_DOC,
  isFirebaseConfigured,
} from '../config';
import { db } from '../firebase';

const LOCAL_STORAGE_KEY = 'lessonControlsFallback';

function readLocalControls() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_LESSON_CONTROLS };
    return { ...DEFAULT_LESSON_CONTROLS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_LESSON_CONTROLS };
  }
}

function writeLocalControls(nextSettings) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextSettings));
}

export function useLessonControls() {
  const [settings, setSettings] = useState(() => readLocalControls());
  const [loading, setLoading] = useState(isFirebaseConfigured());
  const [error, setError] = useState('');
  const [isRemote, setIsRemote] = useState(isFirebaseConfigured());

  useEffect(() => {
    if (!isFirebaseConfigured() || !db) {
      setLoading(false);
      setIsRemote(false);
      return undefined;
    }

    const ref = doc(db, LESSON_CONTROLS_COLLECTION, LESSON_CONTROLS_DOC);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings({ ...DEFAULT_LESSON_CONTROLS, ...snapshot.data() });
        } else {
          setSettings({ ...DEFAULT_LESSON_CONTROLS });
        }
        setLoading(false);
        setError('');
        setIsRemote(true);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setSettings(readLocalControls());
        setLoading(false);
        setIsRemote(false);
      },
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isFirebaseConfigured()) return undefined;

    const onStorage = (event) => {
      if (event.key === LOCAL_STORAGE_KEY) {
        setSettings(readLocalControls());
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const saveSettings = useCallback(async (partialSettings, updatedBy = 'teacher') => {
    const nextSettings = {
      ...settings,
      ...partialSettings,
      updatedAt: new Date().toISOString(),
      updatedBy,
    };

    if (!isFirebaseConfigured() || !db) {
      writeLocalControls(nextSettings);
      setSettings(nextSettings);
      return nextSettings;
    }

    const ref = doc(db, LESSON_CONTROLS_COLLECTION, LESSON_CONTROLS_DOC);
    await setDoc(
      ref,
      {
        ...nextSettings,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    return nextSettings;
  }, [settings]);

  const resetSettings = useCallback(async (updatedBy = 'teacher') => {
    return saveSettings({ ...DEFAULT_LESSON_CONTROLS }, updatedBy);
  }, [saveSettings]);

  return {
    settings,
    loading,
    error,
    isRemote,
    saveSettings,
    resetSettings,
  };
}
