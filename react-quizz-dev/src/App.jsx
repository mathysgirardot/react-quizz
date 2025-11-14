// src/App.jsx
// Composant racine de l'application.
// On y définit les différentes routes (pages) de notre quiz
// et on gère également le thème global (mode clair / mode sombre).

import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
// Import des pages
import Home from './pages/Home.jsx'
import Quiz from './pages/Quiz.jsx'
import Results from './pages/Results.jsx'
import Header from './components/Header.jsx'

function App() {
  // Thème global de l'application.
  // Deux valeurs possibles : "light" (clair) ou "dark" (sombre).
  const [theme, setTheme] = useState('light')

  // Fonction qui alterne entre le mode clair et le mode sombre.
  const handleToggleTheme = () => {
    setTheme((previousTheme) => (previousTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className={`app app--${theme}`}>
      {/* Header commun, avec un bouton pour changer de thème */}
      <Header theme={theme} onToggleTheme={handleToggleTheme} />

      {/* 
        Routes contient toutes les "routes" de notre application.
        Chaque Route associe une URL (path) à un composant (element).
      */}
      <Routes>
        {/* Page d'accueil du quiz */}
        <Route path="/" element={<Home />} />

        {/* Page principale du quiz (questions, réponses, joker, minuteur, etc.) */}
        <Route path="/quiz" element={<Quiz />} />

        {/* Page des résultats (score final, statistiques, etc.) */}
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  )
}

export default App