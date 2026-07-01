// Enterprise Mall - Application Entry Point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

const rootElement: HTMLElement | null = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Ensure there is a <div id="root"> in the HTML.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
