import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { LocaleProvider } from './contexts/LocaleConext';
// import App from './practice/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <LocaleProvider defaultValue='ko'>
    <App />
  </LocaleProvider>
);
