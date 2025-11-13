// src/pages/Home.jsx
// Page d'accueil de l'application React Quiz.
// L'utilisateur découvre le concept, choisit un thème (catégorie)
// puis peut cliquer sur "Commencer le quiz" pour lancer une partie.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'

// Liste des catégories proposées à l'utilisateur.
// Les valeurs "id" correspondent aux identifiants de catégories de l'API OpenTDB.
// (Nous utiliserons ces identifiants plus tard dans la page Quiz pour filtrer les questions.)
const CATEGORIES = [
  { id: 9, label: 'Culture générale' },
  { id: 11, label: 'Cinéma' },
  { id: 21, label: 'Sport' },
  { id: 18, label: 'Informatique' },
]

function Home() {
  const navigate = useNavigate()

  // Catégorie sélectionnée dans la liste déroulante.
  // Par défaut, on choisit la première catégorie de la liste.
  const [selectedCategoryId, setSelectedCategoryId] = useState(CATEGORIES[0].id)

  // Fonction appelée lorsque l'utilisateur change de catégorie
  const handleCategoryChange = (event) => {
    const newCategoryId = Number(event.target.value)
    setSelectedCategoryId(newCategoryId)
  }

  // Fonction appelée quand on clique sur le bouton "Commencer le quiz"
  const handleStartClick = () => {
    // On redirige l'utilisateur vers la page /quiz
    // en transmettant la catégorie sélectionnée dans l'état de navigation.
    navigate('/quiz', {
      state: {
        categoryId: selectedCategoryId,
      },
    })
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
          Tu peux commencer par choisir une catégorie ci-dessous, puis lancer le
          quiz. Les questions seront ensuite récupérées dynamiquement en
          fonction de ce thème.
        </p>

        {/* Bloc de sélection de la catégorie du quiz */}
        <section className="home__category">
          <label htmlFor="category-select" className="home__category-label">
            Choisis une catégorie :
          </label>

          <select
            id="category-select"
            className="home__category-select"
            value={selectedCategoryId}
            onChange={handleCategoryChange}
          >
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </section>

        {/* Bouton qui lance le quiz avec la catégorie sélectionnée */}
        <button className="home__button" onClick={handleStartClick}>
          Commencer le quiz
        </button>
      </main>
    </div>
  )
}

export default Home