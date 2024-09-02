import React from 'react';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import ProfileCreation from './components/ProfileCreation';
import HomePage from './components/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/profile_creation',
    element: <ProfileCreation />,
  },
  {
    path: '/home_page',
    element: <HomePage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
