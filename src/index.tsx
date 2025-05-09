import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import './styles/accessibility.css';
import './styles/high-contrast.css';
import App from './App';
import { UserContextProvider } from './contexts/UserContext';

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
