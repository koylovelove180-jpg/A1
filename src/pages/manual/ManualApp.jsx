import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ManualArticle from './ManualArticle';
import ManualHub from './ManualHub';
import ManualLayout from './ManualLayout';
import ManualRoleHome from './ManualRoleHome';

function ManualApp() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw-manual.js').catch(() => {
      // offline support is optional
    });
  }, []);

  return (
    <Routes>
      <Route element={<ManualLayout />}>
        <Route index element={<ManualHub />} />
        <Route path=":role" element={<ManualRoleHome />} />
        <Route path=":role/:topicId" element={<ManualArticle />} />
        <Route path="*" element={<Navigate to="/manual" replace />} />
      </Route>
    </Routes>
  );
}

export default ManualApp;
