// src/pages/Results.jsx
// Page d'affichage du score final et des actions pour rejouer
// ou revenir à la page d'accueil.

import { useLocation, useNavigate } from 'react-router-dom'
import Score from '../components/Score.jsx'

const CATEGORY_LABELS = {
  9: 'Culture générale',
  10: 'Livres',
  11: 'Cinéma',
  12: 'Musique',
  14: 'Télévision',
  15: 'Jeux vidéo',
  17: 'Science & nature',
  18: 'Informatique',
  21: 'Sport',
  23: 'Histoire',
  27: 'Animaux',
}

const DIFFICULTY_LABELS = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
}

function Results() {
  const location = useLocation()
  const navigate = useNavigate()

  const scoreFromState = location.state?.score
  const totalFromState = location.state?.total
  const categoryIdFromState = location.state?.categoryId
  const difficultyFromState = location.state?.difficulty

  const score = typeof scoreFromState === 'number' ? scoreFromState : 0
  const total = typeof totalFromState === 'number' ? totalFromState : 0

  const categoryId = typeof categoryIdFromState === 'number'
    ? categoryIdFromState
    : null

  const difficulty = typeof difficultyFromState === 'string'
    ? difficultyFromState
    : null

  const categoryLabel = categoryId
    ? CATEGORY_LABELS[categoryId] || 'Catégorie personnalisée'
    : 'Catégorie inconnue'

  const difficultyLabel = difficulty
    ? DIFFICULTY_LABELS[difficulty] || difficulty
    : 'Non définie'

  const handleReplaySameSettings = () => {
    if (!categoryId && !difficulty) {
      navigate('/')
      return
    }

    navigate('/quiz', {
      state: {
        categoryId,
        difficulty,
      },
    })
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <div className="results-page">
      <main className="results">
        <h2>Résultats du quiz</h2>

        <Score score={score} total={total} />

        <p className="results__message">
          Thème joué :
          {' '}
          <strong>{categoryLabel}</strong>
          {' '}
          — Difficulté :
          {' '}
          <strong>{difficultyLabel}</strong>
        </p>

        <p>
          Tu peux rejouer immédiatement une nouvelle partie avec les mêmes
          paramètres, ou revenir à la page d&apos;accueil pour changer de
          catégorie et de niveau de difficulté.
        </p>

        <div className="results__buttons">
          <button
            type="button"
            className="results__button"
            onClick={handleReplaySameSettings}
          >
            Rejouer avec les mêmes paramètres
          </button>

          <button
            type="button"
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