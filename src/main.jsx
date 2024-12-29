import { createRoot } from 'react-dom/client';
import './index.css';
import { LocationProvider } from './context/LocationContext';
import App from './App';

createRoot(document.getElementById('root')).render(
  <LocationProvider>
    <App />
  </LocationProvider>
);
