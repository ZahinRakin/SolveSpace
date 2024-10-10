import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { 
  createBrowserRouter, 
  RouterProvider 
} from 'react-router-dom'

import './index.css'

import Root from './Root/Root.jsx'
import Home from './Home/Home.jsx'
import ErrorPage from './ErrorPage/ErrorPage.jsx'
import About from './About/About.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },{
        path: "/about",
        element: <About />,
      },
    ],
  },
], {
  basename: "/SolveSpace",
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
