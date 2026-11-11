import React from 'react';import ReactDOM from 'react-dom/client';import { BrowserRouter } from 'react-router-dom';import App from './App';import { LMSProvider } from './context/LMSContext';import './styles/global.css';
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><LMSProvider><App/></LMSProvider></BrowserRouter></React.StrictMode>);
