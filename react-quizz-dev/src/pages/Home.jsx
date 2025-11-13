// src/pages/Home.jsx
import Header from '../components/Header.jsx'

function Home() {
  const handleStartClick = () => {
    // TODO: plus tard, on naviguera vers la page du quiz (avec React Router)
    console.log('Commencer le quiz')
  }

  return (
    <div className="home">
      <Header />

      <main className="home__content">
        <h2>Bienvenue dans le React Quiz</h2>

        <p>
          Réponds à 10 questions sur le thème de ton choix, utilise ton joker
          intelligemment et essaie de faire le meilleur score possible.
        </p>

        <p>
          Pour l&apos;instant, cette page est juste une base propre à partir
          de laquelle on va construire le reste de l&apos;application
          (questions, score, chrono, etc.).
        </p>

        <button className="home__button" onClick={handleStartClick}>
          Commencer le quiz
        </button>
      </main>
    </div>
  )
}

export default Home