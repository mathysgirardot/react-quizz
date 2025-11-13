// src/App.jsx
// Composant racine de l'application
// On y définit les différentes routes (pages) de notre quiz.

import './App.css'
import { Routes, Route } from 'react-router-dom'
// Import des pages
import Home from './pages/Home.jsx'
import Quiz from './pages/Quiz.jsx'
import Results from './pages/Results.jsx'

function App() {
  return (
    <div className="app">
      {/* 
        Routes contient toutes les "routes" de notre application.
        Chaque Route associe une URL (path) à un composant (element).
      */}
      <Routes>
        {/* Page d'accueil du quiz */}
        <Route path="/" element={<Home />} />

        {/* Page principale du quiz (questions, réponses, joker, chrono, etc.) */}
        <Route path="/quiz" element={<Quiz />} />

        {/* Page des résultats (score final, statistiques, etc.) */}
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  )
}

export default App