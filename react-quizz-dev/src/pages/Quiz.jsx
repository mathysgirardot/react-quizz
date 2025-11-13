// src/pages/Quiz.jsx
// Page principale du quiz.
// Dans cette version, les questions sont récupérées dynamiquement
// depuis l'API OpenTDB en fonction de la catégorie choisie sur la page d'accueil.
//
// Fonctionnalités actuelles :
// - Récupération de la catégorie (thème) via React Router (location.state)
// - Chargement des questions au montage du composant (et quand la catégorie change)
// - Affichage du thème sélectionné
// - Affichage d'une question à la fois
// - Barre de progression visuelle + texte "Question X / N"
// - Mise à jour du score lorsque l'utilisateur clique sur une réponse
// - Redirection vers la page des résultats à la fin du quiz
// - Gestion d'un état de chargement et d'une erreur simple
// - Ajout d'un "joker" utilisable une seule fois par partie
//   -> le joker réduit le nombre de réponses possibles pour la question en cours

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Question from '../components/Question.jsx'
import { fetchQuizQuestions } from '../api.js'

// Correspondance entre les identifiants de catégorie et un label lisible.
// Ces identifiants doivent être cohérents avec ceux utilisés dans Home.jsx.
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

function Quiz() {
  // Récupération de l'état transmis depuis la page Home via navigate('/quiz', { state: { ... } })
  const location = useLocation()
  const navigate = useNavigate()

  // categoryId peut être undefined si l'utilisateur arrive directement sur /quiz
  const categoryIdFromState = location.state?.categoryId

  // Conversion en nombre (ou null si absence de catégorie)
  const categoryId = typeof categoryIdFromState === 'number'
    ? categoryIdFromState
    : null

  // Détermination d'un label lisible pour la catégorie actuelle
  const categoryLabel = categoryId
    ? CATEGORY_LABELS[categoryId] || 'Catégorie personnalisée'
    : 'Catégorie aléatoire'

  // Liste des questions récupérées depuis l'API
  const [questions, setQuestions] = useState([])

  // Index de la question actuellement affichée (0 = première question)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Score actuel de l'utilisateur (nombre de bonnes réponses)
  const [score, setScore] = useState(0)

  // Indique si les questions sont en cours de chargement
  const [isLoading, setIsLoading] = useState(true)

  // Message d'erreur éventuel (par exemple si l'API ne répond pas)
  const [error, setError] = useState(null)

  // Indique si le joker a déjà été utilisé pendant cette partie
  const [hasUsedJoker, setHasUsedJoker] = useState(false)

  // Réponses actuellement affichées pour la question en cours.
  // Ce tableau peut être réduit si l'utilisateur utilise le joker.
  const [currentAnswers, setCurrentAnswers] = useState([])

  // Effet exécuté au montage du composant et lorsque la catégorie change
  useEffect(() => {
    async function loadQuestions() {
      try {
        setIsLoading(true)
        setError(null)

        // Construction de l'objet d'options pour l'appel API.
        // Si aucune catégorie n'est fournie, on laisse "category" undefined
        // pour laisser l'API choisir un ensemble de questions variées.
        const options = {
          amount: 10,
        }

        if (categoryId) {
          options.category = categoryId
        }

        const loadedQuestions = await fetchQuizQuestions(options)

        setQuestions(loadedQuestions)
        setCurrentQuestionIndex(0)
        setScore(0)
        setHasUsedJoker(false)
      } catch (err) {
        console.error('Erreur lors du chargement des questions :', err)
        setError("Impossible de charger les questions. Merci de réessayer plus tard.")
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [categoryId])

  // Question actuelle (peut être undefined si le tableau est vide)
  const currentQuestion = questions[currentQuestionIndex]

  // À chaque fois que la question actuelle change, on réinitialise
  // la liste des réponses affichées à la liste complète fournie par l'API.
  useEffect(() => {
    if (currentQuestion) {
      setCurrentAnswers(currentQuestion.answers)
    } else {
      setCurrentAnswers([])
    }
  }, [currentQuestion])

  // Calcul du pourcentage de progression pour la barre.
  // Exemple : question 3 sur 10 -> 30 %
  const totalQuestions = questions.length
  const progressPercentage = totalQuestions > 0
    ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)
    : 0

  // Fonction appelée lorsque l'utilisateur clique sur une réponse
  const handleAnswerClick = (selectedAnswer) => {
    // Si pour une raison quelconque il n'y a pas de question courante, on ne fait rien
    if (!currentQuestion) {
      return
    }

    console.log('Réponse choisie :', selectedAnswer)

    // On vérifie si la réponse choisie est correcte
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    // Variable temporaire pour calculer le prochain score
    let nextScore = score

    if (isCorrect) {
      nextScore = score + 1
      setScore(nextScore)
    }

    const isLastQuestion = currentQuestionIndex === totalQuestions - 1

    if (!isLastQuestion) {
      // Si ce n'est pas la dernière question, on passe simplement à la suivante
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1)
    } else {
      // Si c'est la dernière question, on redirige vers la page des résultats
      // en transmettant le score, le nombre total de questions
      // et la catégorie utilisée (si elle existe).
      navigate('/results', {
        state: {
          score: nextScore,
          total: totalQuestions,
          categoryId: categoryId,
        },
      })
    }
  }

  // Fonction appelée lorsque l'utilisateur clique sur le bouton "Utiliser mon joker"
  // Le joker est utilisable une seule fois dans la partie.
  // Ici, il réduit le nombre de réponses possibles pour la question en cours
  // (on garde la bonne réponse + une mauvaise réponse au hasard).
  const handleUseJoker = () => {
    if (!currentQuestion) {
      return
    }

    if (hasUsedJoker) {
      // Si le joker a déjà été utilisé, on ne fait rien.
      return
    }

    // On sépare la bonne réponse des mauvaises réponses
    const correctAnswer = currentQuestion.correctAnswer
    const incorrectAnswers = currentQuestion.answers.filter(
      (answer) => answer !== correctAnswer,
    )

    if (incorrectAnswers.length === 0) {
      // Cas très rare (si l'API renvoie une seule réponse),
      // on ne modifie pas la liste actuelle.
      return
    }

    // On choisit une mauvaise réponse au hasard
    const randomIndex = Math.floor(Math.random() * incorrectAnswers.length)
    const randomIncorrectAnswer = incorrectAnswers[randomIndex]

    // On construit une nouvelle liste de réponses
    // en conservant uniquement la bonne réponse + la mauvaise tirée au sort.
    // On respecte l'ordre d'apparition actuel des réponses.
    const reducedAnswers = currentAnswers.filter(
      (answer) =>
        answer === correctAnswer || answer === randomIncorrectAnswer,
    )

    setCurrentAnswers(reducedAnswers)
    setHasUsedJoker(true)
  }

  return (
    <div className="quiz-page">
      {/* Header commun à plusieurs pages */}
      <Header />

      <main className="quiz">
        <h2>Quiz React (version API avec catégories, barre de progression et joker)</h2>

        {/* Affichage du thème actuel pour donner un contexte à l'utilisateur */}
        <p className="quiz__category">
          Thème sélectionné : <strong>{categoryLabel}</strong>
        </p>

        {/* Gestion de l'état de chargement */}
        {isLoading && (
          <p className="quiz__status">
            Chargement des questions en cours...
          </p>
        )}

        {/* Affichage d'un message d'erreur en cas de problème avec l'API */}
        {error && !isLoading && (
          <p className="quiz__status quiz__status--error">
            {error}
          </p>
        )}

        {/* Affichage du contenu du quiz uniquement si les questions sont chargées,
            qu'il n'y a pas d'erreur et que le tableau n'est pas vide. */}
        {!isLoading
          && !error
          && questions.length > 0
          && currentQuestion
          && currentAnswers.length > 0 && (
            <>
              {/* Barre de progression visuelle */}
              <div className="quiz__progress-container">
                <div className="quiz__progress-text">
                  Question {currentQuestionIndex + 1} / {totalQuestions}
                </div>
                <div className="quiz__progress-bar">
                  <div
                    className="quiz__progress-bar-fill"
                    // Style inline pour ajuster la largeur en fonction de la progression
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Affichage de la question actuelle avec la liste de réponses courante
                  (qui peut être réduite si le joker a été utilisé). */}
              <Question
                questionText={currentQuestion.questionText}
                answers={currentAnswers}
                onAnswerClick={handleAnswerClick}
              />

              {/* Section dédiée au joker */}
              <section className="quiz__joker">
                <h3>Joker</h3>
                <p className="quiz__joker-text">
                  Tu peux utiliser ton joker une seule fois dans la partie.
                  Il réduit le nombre de réponses possibles pour la question actuelle.
                </p>

                <button
                  className="quiz__joker-button"
                  onClick={handleUseJoker}
                  disabled={hasUsedJoker}
                >
                  {hasUsedJoker ? 'Joker déjà utilisé' : 'Utiliser mon joker'}
                </button>
              </section>

              {/* Texte d'information temporaire pour expliquer l'état du développement */}
              <p className="quiz__info">
                Les questions affichées sont filtrées en fonction de la
                catégorie choisie sur la page d&apos;accueil. Tu disposes
                d&apos;un joker par partie pour t&apos;aider. Dans les prochains
                commits, nous ajouterons le minuteur par question et un
                meilleur feedback visuel pour les bonnes/mauvaises réponses.
              </p>
            </>
        )}

        {/* Cas où l'API renvoie 0 question (peu probable mais géré proprement) */}
        {!isLoading && !error && questions.length === 0 && (
          <p className="quiz__status">
            Aucune question n&apos;a été trouvée pour ce thème. Merci de réessayer
            avec une autre catégorie.
          </p>
        )}
      </main>
    </div>
  )
}

export default Quiz