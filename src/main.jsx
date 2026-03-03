import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LEDSimulator from './pages/LEDSimulator';
import Resisters from './pages/Resisters';
import Home from './pages/Home';
import LEDSimulator2 from './pages/LEDSimulator2';
import Practice from './pages/Practice';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/led",
    element: <LEDSimulator/>,
  },
    {
    path: "/resisters",
    element: <Resisters/>,
  },    
  {
    path: "/led2",
    element: <LEDSimulator2/>,
  },
    {
    path: "/practice",
    element: <Practice/>,
  },
]);
createRoot(document.getElementById('root')).render(

  <RouterProvider router={router} />,
)
