import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { Layout, App, Login, Profile, Settings, Register } from "./pages";
import { AuthLayout } from './components';
import { Provider } from 'react-redux';
import store from "./store/store.js"
import './index.css';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element=<Layout /> >
    <Route path='/' element=<Login /> />
    <Route path='/register' element=<Register /> />
    <Route path='/settings' element=<Settings /> />
    <Route path='/app' element=<AuthLayout><App /></AuthLayout> />
    <Route path='/profile' element=<AuthLayout><Profile /></AuthLayout> />
  </Route >
))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
