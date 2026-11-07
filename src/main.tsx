import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens.css';
import './styles/typography.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/sections.css';
import './styles/v3.css';
import './styles/v4.css';
import './styles/identity.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
