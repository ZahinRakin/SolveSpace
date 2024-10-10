import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { 
  createBrowserRouter, 
  RouterProvider 
} from 'react-router-dom'

import './index.css'

import Home from './Home/Home.jsx'
import ErrorPage from './ErrorPage/ErrorPage.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
    errorElement: <ErrorPage/>,
  },
], {
  basename: "/SolveSpace",
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    {/* <Home /> */}
  </StrictMode>,
)
