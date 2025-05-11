import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import './styles/accessibility.css';
import './styles/high-contrast.css';
import App from './App';
import { UserContextProvider } from './contexts/UserContext';

// Inject crucial environment variables if they're missing
if (!process.env.REACT_APP_AUTH_DOMAIN) {
  (window as any).REACT_APP_AUTH_DOMAIN = 'eva-platform.us.auth0.com';
  (process.env as any).REACT_APP_AUTH_DOMAIN = 'eva-platform.us.auth0.com';
}

if (!process.env.REACT_APP_AUTH_CLIENT_ID) {
  (window as any).REACT_APP_AUTH_CLIENT_ID = 'EVAPlatformAuth2023';
  (process.env as any).REACT_APP_AUTH_CLIENT_ID = 'EVAPlatformAuth2023';
}

if (!process.env.REACT_APP_ENVIRONMENT) {
  (window as any).REACT_APP_ENVIRONMENT = 'development';
  (process.env as any).REACT_APP_ENVIRONMENT = 'development';
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </React.StrictMode>
);
