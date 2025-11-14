// src/pages/Home.jsx
// Page d'accueil de l'application React Quiz.
// L'utilisateur découvre le concept, choisit un thème (catégorie)
// et maintenant un niveau de difficulté, puis peut cliquer sur
// "Commencer le quiz" pour lancer une partie.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'

// Liste des catégories proposées à l'utilisateur.
// Les valeurs "id" correspondent aux identifiants de catégories de l'API OpenTDB.
const CATEGORIES = [
  { id: 9, label: 'Culture générale' },
  { id: 10, label: 'Livres' },
  { id: 11, label: 'Cinéma' },
  { id: 12, label: 'Musique' },
  { id: 14, label: 'Télévision' },
  { id: 15, label: 'Jeux vidéo' },
  { id: 17, label: 'Science & nature' },
  { id: 18, label: 'Informatique' },
  { id: 21, label: 'Sport' },
  { id: 23, label: 'Histoire' },
  { id: 27, label: 'Animaux' },
]

// Niveaux de difficulté proposés.
// Ces valeurs sont directement compatibles avec l'API OpenTDB (easy / medium / hard).
const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Facile' },
  { value: 'medium', label: 'Moyen' },
  { value: 'hard', label: 'Difficile' },
]

function Home() {
  const navigate = useNavigate()

  // Catégorie sélectionnée dans la liste déroulante.
  const [selectedCategoryId, setSelectedCategoryId] = useState(CATEGORIES[0].id)

  // Niveau de difficulté sélectionné.
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY_LEVELS[0].value)

  // Fonction appelée lorsque l'utilisateur change de catégorie.
  const handleCategoryChange = (event) => {
    const newCategoryId = Number(event.target.value)
    setSelectedCategoryId(newCategoryId)
  }

  // Fonction appelée lorsque l'utilisateur change de difficulté.
  const handleDifficultyChange = (event) => {
    const newDifficulty = event.target.value
    setSelectedDifficulty(newDifficulty)
  }

  // Fonction appelée quand on clique sur le bouton "Commencer le quiz".
  const handleStartClick = () => {
    // On redirige l'utilisateur vers la page /quiz
    // en transmettant la catégorie ET la difficulté choisies.
    navigate('/quiz', {
      state: {
        categoryId: selectedCategoryId,
        difficulty: selectedDifficulty,
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
          Réponds à 10 questions sur le thème et la difficulté de ton choix,
          utilise ton joker intelligemment et essaie de faire le meilleur score possible.
        </p>

        <p>
          Tu peux commencer par choisir une catégorie ainsi qu&apos;un niveau de difficulté,
          puis lancer le quiz. Les questions seront ensuite récupérées dynamiquement en
          fonction de ces paramètres.
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

        {/* Bloc de sélection de la difficulté du quiz */}
        <section className="home__category">
          <label htmlFor="difficulty-select" className="home__category-label">
            Choisis un niveau de difficulté :
          </label>

          <select
            id="difficulty-select"
            className="home__category-select"
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
          >
            {DIFFICULTY_LEVELS.map((difficulty) => (
              <option key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </option>
            ))}
          </select>
        </section>

        {/* Bouton qui lance le quiz avec la catégorie + difficulté sélectionnées */}
        <button className="home__button" onClick={handleStartClick}>
          Commencer le quiz
        </button>
      </main>
    </div>
  )
}

export default Home