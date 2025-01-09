import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SignUpPage from "./pages/SignUpPage";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />, // Root Landing Page
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login", // Login Page
        element: <LoginPage />,
      },
      {
        path: "forgot-password", // Forgot Password Page
        element: <ForgotPasswordPage />,
      },
      {
        path: "signup",
        element: <SignUpPage/>
      }
    ],
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
