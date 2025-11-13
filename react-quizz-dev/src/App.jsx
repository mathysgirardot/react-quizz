// src/App.jsx
import './App.css'

function Header() {
  return (
    <header className="app-header">
      <h1>React Quiz</h1>
      <p className="app-header__subtitle">
        Un petit jeu de questions / réponses développé en React
      </p>
    </header>
  )
}

function App() {
  return (
    <div className="app">
      <Header />

      <main className="app-main">
        <p>
          Bienvenue dans le projet de quiz. Dans les prochaines étapes, tu pourras
          choisir un thème, répondre à 10 questions et utiliser un joker pour améliorer ton score.
        </p>
        <p>
          Pour l&apos;instant, cette page est juste une base propre à partir de laquelle
          on va construire le reste de l&apos;application (pages, questions, API, score, etc.).
        </p>
      </main>
    </div>
  )
}

export default App