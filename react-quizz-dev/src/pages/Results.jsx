// src/pages/Results.jsx
// Page des résultats du quiz.
// On récupère le score transmis par la page Quiz via React Router
// et on affiche un récapitulatif à l'utilisateur.

import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Score from '../components/Score.jsx'

function Results() {
  const location = useLocation()
  const navigate = useNavigate()

  // Récupération des données transmises par navigate(..., { state: { ... } })
  // Si aucune donnée n'est fournie (accès direct à /results), on utilise des valeurs par défaut.
  const state = location.state || { score: 0, total: 0 }
  const { score, total } = state

  // Fonction appelée quand l'utilisateur clique sur "Revenir à l'accueil"
  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <div className="results-page">
      <Header />

      <main className="results">
        <h2>Résultats du quiz</h2>

        {/* Affichage du score via un composant dédié */}
        <Score score={score} total={total} />

        <p className="results__message">
          Merci d&apos;avoir participé à ce petit quiz React.
          Dans les prochaines étapes, nous personnaliserons davantage cette page
          avec des statistiques, un meilleur score sauvegardé et des options
          pour rejouer rapidement.
        </p>

        {/* Petit bouton pour revenir proprement à l'accueil */}
        <button className="results__button" onClick={handleBackToHome}>
          Revenir à l&apos;accueil
        </button>
      </main>
    </div>
  )
}

export default Results