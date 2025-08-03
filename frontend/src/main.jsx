import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'

import './index.css'
import App from './App'

import StudentDashboard from './pages/student/StudentDashboard'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

// Configure axios defaults for production
if (import.meta.env.PROD) {
  axios.defaults.baseURL = 'https://solvespace-backend.onrender.com';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
