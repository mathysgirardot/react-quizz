// src/main.jsx
// Fichier d'entrée de l'application React
// On monte le composant <App /> dans la div #root du index.html

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Import du router
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter permet d'activer la navigation entre plusieurs "pages" */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)