import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Simple CSS
const style = document.createElement('style');
style.textContent = `
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: #f5f5f5;
  }
  input, select, button {
    border-radius: 5px;
    border: 1px solid #ddd;
  }
  button {
    background-color: #3b82f6;
    color: white;
    cursor: pointer;
    border: none;
  }
  button:hover {
    background-color: #2563eb;
  }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);