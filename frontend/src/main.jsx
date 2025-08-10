import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { toast, Toaster, ToastBar } from 'react-hot-toast';
import { CircleX } from "lucide-react";
import { Provider } from 'react-redux';
import { Layout, App, Login, Profile, Settings, Register } from "./pages";
import { AuthLayout } from './components';
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
  // <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster toastOptions={{ duration: 2500, style: { zIndex: 9999 } }}>
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== 'loading' && (
                <button onClick={() => toast.dismiss(t.id)}>
                  <CircleX className='size-5 text-base-content/40' />
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  </Provider>
  // </StrictMode>,
)
