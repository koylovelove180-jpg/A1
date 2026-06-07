import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function loadEnvFile() {
  const envContent = readFileSync('.env', 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const teacherEmail = process.env.VITE_TEACHER_EMAIL || 'teacher.admin@example.com';
const teacherPassword = process.env.TEACHER_SETUP_PASSWORD || 'Admin-Cook@8Q7m-2026';

async function main() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log('Project:', firebaseConfig.projectId);

  const settingsRef = doc(db, 'lessonControls', 'cooking-basics');
  const snapshot = await getDoc(settingsRef);
  console.log('Firestore read:', snapshot.exists() ? 'OK (doc exists)' : 'OK (doc missing, will be created on save)');

  try {
    await signInWithEmailAndPassword(auth, teacherEmail, teacherPassword);
    console.log('Teacher login: OK');
  } catch (error) {
    console.error('Teacher login failed:', error.code || error.message);
    console.error('Create user in Firebase Console:', teacherEmail);
    process.exitCode = 1;
    return;
  }

  await setDoc(
    settingsRef,
    {
      contentUnlocked: false,
      postTestUnlocked: false,
      preTestRequired: true,
      courseTitle: 'การประกอบอาหารเบื้องต้น',
      classroomName: 'ห้องเรียนทั่วไป',
      announcement: 'Firebase connected successfully',
      updatedBy: teacherEmail,
    },
    { merge: true },
  );
  console.log('Firestore write: OK');
}

main().catch((error) => {
  console.error('Verification failed:', error.message);
  process.exitCode = 1;
});
