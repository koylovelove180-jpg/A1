import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import StudentApp from './pages/StudentApp';
import TeacherApp from './pages/TeacherApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentApp />} />
        <Route path="/student" element={<StudentApp />} />
        <Route path="/teacher" element={<TeacherApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
