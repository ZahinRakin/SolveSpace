import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App'

import StudentDashboard from './pages/student/StudentDashboard'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App/> */}
    {/* <StudentDashboard/> */}
    {/* <TeacherDashboard/> */}
    <AdminDashboard/>
  </StrictMode>,
)
