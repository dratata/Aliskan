import React from 'react';
import {createRoot} from 'react-dom/client';
import {StoreProvider} from './app/Store';
import App from './app/App';
import './styles.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><StoreProvider><App/></StoreProvider></React.StrictMode>);
