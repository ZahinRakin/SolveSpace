import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./pages/Layout"
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SignUpPage from "./pages/SignUpPage";
import ErrorPage from "./pages/ErrorPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [{
      index: true,
      element: <LandingPage />,
      },
    ],
  },{
    path: "/login",
    element: <LoginPage />
  },{
    path: "/signup",
    element: <SignUpPage />
  },{
    path: "/forgot-password",
    element: <ForgotPasswordPage />
  },{
    path: "/student/dashboard",
    element: <StudentDashboard/>
  },{
    path: "/teacher/dashboard",
    element: <TeacherDashboard/>
  },{
    path: "/admin/dashboard",
    element: <AdminDashboard/>
  },{
    path: "/reset-password",
    element: <ResetPasswordPage/>
  },{
    path: "/about",
    element: <AboutUs/>
  }
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

