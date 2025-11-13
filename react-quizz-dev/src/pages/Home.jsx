// src/pages/Home.jsx
// Page d'accueil de l'application React Quiz.
// L'utilisateur découvre le concept et peut cliquer sur "Commencer le quiz".

import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'

function Home() {
  // Hook fourni par React Router pour changer de page en JavaScript
  const navigate = useNavigate()

  // Fonction appelée quand on clique sur le bouton "Commencer le quiz"
  const handleStartClick = () => {
    // On redirige l'utilisateur vers la page /quiz
    navigate('/quiz')
  }

  return (
    <div className="home">
      {/* Header commun à plusieurs pages */}
      <Header />

      <main className="home__content">
        <h2>Bienvenue dans le React Quiz</h2>

        <p>
          Réponds à 10 questions sur le thème de ton choix, utilise ton joker
          intelligemment et essaie de faire le meilleur score possible.
        </p>

        <p>
          Dans les prochaines étapes, nous ajouterons la gestion du score, le
          minuteur par question, les animations de feedback et la page de
          résultats détaillée.
        </p>

        {/* Bouton qui lance réellement le quiz en changeant de page */}
        <button className="home__button" onClick={handleStartClick}>
          Commencer le quiz
        </button>
      </main>
    </div>
  )
}

export default Home