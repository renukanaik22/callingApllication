import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { setSocketUrl } from './constants/webrtc'

// Configure socket URL for production
if (import.meta.env.VITE_SOCKET_URL) {
  setSocketUrl(import.meta.env.VITE_SOCKET_URL);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
