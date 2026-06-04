import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  //Main component wrapped in StrictMode to check for potential problems in the application
  <StrictMode>
    <App />
  </StrictMode>,
)
