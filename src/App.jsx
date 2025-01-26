import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./component/Layout";
import LandingPage from "./component/LandingPage";
import LoginPage from "./pages/LoginPage";
import Logout from "./component/Logout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SignUpPage from "./pages/SignUpPage";
import ErrorPage from "./pages/ErrorPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AboutUs from "./component/AboutUs";
import NotificationPage from "./pages/NotificationPage";
import TuitionPostPage from "./pages/teacher/TuitionPostPage";
import TuitionSearchPage from "./pages/teacher/TuitionSearchPage";
import TuitionRequestPage from "./pages/student/TuitionRequestPage";
import TutorSearchPage from "./pages/student/TutorSearchPage";
import ViewProfilePage from "./pages/ViewProfilePage";
import EditProfilePage from "./pages/EditProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [{
      index: true,
      element: <LandingPage />,
      },{
        path: "about",
        element: <AboutUs/>
      }
    ],
  },{
    path: "/login",
    element: <LoginPage />
  },{
    path: "/logout",
    element: <Logout />
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
    path: "/notification",
    element: <NotificationPage/>
  },{
    path: "/teacher/tuitionpost",
    element: <TuitionPostPage/>
  },{
    path: "/teacher/tuitionsearch",
    element: <TuitionSearchPage/>
  },{
    path: "/student/tuitionrequest",
    element: <TuitionRequestPage/>
  },{
    path: "/student/tutorsearch",
    element: <TutorSearchPage/>
  },{
    path: "/viewprofile",
    element: <ViewProfilePage/>
  },{
    path: "/editprofile",
    element: <EditProfilePage/>
  }
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

