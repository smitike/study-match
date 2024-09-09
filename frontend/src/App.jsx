import React from 'react';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import ProfileCreation from './components/ProfileCreation';
import HomePage from './components/HomePage.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import Sidebar from './components/Sidebar.jsx';
import CreateSessionPage from './components/CreateSessionPage.jsx';
import { UserProvider } from './UserContext';

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
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/sidebar',
    element: <Sidebar />,
  },
  {
    path: '/create-session',
    element: <CreateSessionPage />,
  },
]);

function App() {
    return (
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      );
//   return <RouterProvider router={router} />;
}

export default App;
