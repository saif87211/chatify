import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { Layout, App, Login, Profile, Settings } from "./pages";
import './index.css';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element=<Layout /> >
    <Route path='/' element=<Login /> />
    <Route path='/app' element=<App /> />
    <Route path='/register' element=<Login /> />
    <Route path='/profile' element=<Profile /> />
    <Route path='/settings' element=<Settings /> />
  </Route >
))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
