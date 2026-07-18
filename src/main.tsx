import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SchoolDataProvider } from './context/SchoolDataContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SchoolDataProvider>
      <App />
    </SchoolDataProvider>
  </StrictMode>,
);
