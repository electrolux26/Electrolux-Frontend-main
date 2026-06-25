/**
 * Application Entry Point
 * Renders React app and imports global styles
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from './authConfig'

// Handle redirect responses (if using redirect flow) before rendering the app
msalInstance
  .handleRedirectPromise()
  .catch((err: unknown) => {
    // Log redirect errors but continue to render the app so the UI can show errors
    console.error('MSAL handleRedirectPromise error:', err);
  })
  .finally(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </React.StrictMode>,
    );
  });
