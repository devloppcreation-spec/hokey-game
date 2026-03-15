import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrandProvider } from '@/brand/BrandProvider';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrandProvider>
      <App />
    </BrandProvider>
  </StrictMode>,
);
