import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from "buffer";
import process from "process";


import App from './App.jsx'
window.Buffer = Buffer;
window.process = process;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
