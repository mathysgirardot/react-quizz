// src/pages/Results.jsx
// Page des résultats du quiz.
// On récupère le score (et éventuellement la catégorie utilisée)
// transmis par la page Quiz via React Router, puis on propose
// à l'utilisateur de rejouer ou de retourner à l'accueil.

import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Score from '../components/Score.jsx'

function Results() {
  const location = useLocation()
  const navigate = useNavigate()

  // Récupération des données transmises par navigate(..., { state: { ... } })
  // Si aucune donnée n'est fournie (accès direct à /results), on utilise des valeurs par défaut.
  const state = location.state || { score: 0, total: 0, categoryId: null }
  const { score, total, categoryId } = state

  // Fonction appelée quand l'utilisateur clique sur "Rejouer avec le même thème"
  const handleReplaySameCategory = () => {
    if (categoryId) {
      // Si une catégorie a été utilisée, on la renvoie à la page Quiz
      navigate('/quiz', {
        state: {
          categoryId: categoryId,
        },
      })
    } else {
      // Si aucune catégorie n'est disponible, on relance un quiz "aléatoire"
      navigate('/quiz')
    }
  }

  // Fonction appelée quand l'utilisateur souhaite retourner à l'accueil
  // pour éventuellement choisir un autre thème.
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
          Merci d&apos;avoir participé à ce petit quiz. Tu peux rejouer avec le
          même thème pour essayer d&apos;améliorer ton score, ou revenir à
          l&apos;accueil pour choisir une nouvelle catégorie.
        </p>

        <div className="results__buttons">
          {/* Bouton pour rejouer immédiatement avec le même thème */}
          <button
            className="results__button"
            onClick={handleReplaySameCategory}
          >
            Rejouer avec le même thème
          </button>

          {/* Bouton pour revenir à l'accueil et choisir un autre thème */}
          <button
            className="results__button results__button--secondary"
            onClick={handleBackToHome}
          >
            Choisir un nouveau thème
          </button>
        </div>
      </main>
    </div>
  )
}

export default Results