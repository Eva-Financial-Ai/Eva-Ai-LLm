import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import './styles/accessibility.css';
import './styles/high-contrast.css';
import './styles/theme.css';
import App from './App';
import './i18n'; // Import i18n configuration
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

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
    <App />
  </React.StrictMode>
);

// Register the service worker
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    serviceWorkerRegistration.showUpdateNotification(registration);
  }
});

// Report web vitals
reportWebVitals(({ name, delta, id, value }) => {
  // This function will be called whenever a web vital is measured
  // You can customize this to send data to your analytics provider
  console.log(`Web Vital: ${name}`, { delta, id, value });
});
