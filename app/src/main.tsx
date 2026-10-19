import React from 'react';
import ReactDOM from 'react-dom/client';
import { IonApp, setupIonicReact } from '@ionic/react';
import '@ionic/react/css/core.css';
import App from './App';
import './style.css';
setupIonicReact({ mode: 'md' });
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><IonApp><App /></IonApp></React.StrictMode>);
