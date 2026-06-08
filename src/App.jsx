import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ManualApp from './pages/manual/ManualApp';
import DashboardHome from './pages/DashboardHome';
import StudentApp from './pages/StudentApp';
import TeacherApp from './pages/TeacherApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<DashboardLayout variant="portal" />}>
          <Route path="/dashboard" element={<DashboardHome />} />
        </Route>
        <Route path="/student" element={<StudentApp />} />
        <Route path="/teacher" element={<TeacherApp />} />
        <Route path="/manual/*" element={<ManualApp />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
