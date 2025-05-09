import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './fagnoon_app/App'; // Main app component from the original frontend
import { BrowserRouter } from 'react-router-dom';
import './bootstrap'; // Keep Laravel's bootstrap if needed
import '../css/app.css'; // Keep Laravel's app.css
import '../css/fagnoon_index.css'; // Original global CSS for Fagnoon app

// Get the root element
const rootElement = document.getElementById('app');

// Ensure the root element exists
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("Root element with ID 'app' not found.");
}

