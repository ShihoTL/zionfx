import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react'

import "@stream-io/video-react-sdk/dist/css/styles.css";
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import ReduxProvider from '@/store/providers'
import StreamVideoProvider from '@/providers/StreamClientProvider';
import { ToastProvider } from '@/components/toast-context'

import App from './App.tsx'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => console.log('Service worker registered.', reg))
      .catch(err => console.error('Service worker registration failed:', err));
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <ReduxProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <StreamVideoProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </StreamVideoProvider>
          </ThemeProvider>
        </ReduxProvider>
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>,
)