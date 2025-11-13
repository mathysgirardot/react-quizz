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
// - Mise à jour du score lorsque l'utilisateur clique sur une réponse
// - Redirection vers la page des résultats à la fin du quiz
// - Gestion d'un état de chargement et d'une erreur simple

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Question from '../components/Question.jsx'
import { fetchQuizQuestions } from '../api.js'

// Correspondance entre les identifiants de catégorie et un label lisible.
// Ces identifiants doivent être cohérents avec ceux utilisés dans Home.jsx.
const CATEGORY_LABELS = {
  9: 'Culture générale',
  11: 'Cinéma',
  21: 'Sport',
  18: 'Informatique',
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

    const totalQuestions = questions.length
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1

    if (!isLastQuestion) {
      // Si ce n'est pas la dernière question, on passe simplement à la suivante
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1)
    } else {
      // Si c'est la dernière question, on redirige vers la page des résultats
      // en transmettant le score et le nombre total de questions
      navigate('/results', {
        state: {
          score: nextScore,
          total: totalQuestions,
        },
      })
    }
  }

  return (
    <div className="quiz-page">
      {/* Header commun à plusieurs pages */}
      <Header />

      <main className="quiz">
        <h2>Quiz React (version API avec catégories)</h2>

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
        {!isLoading && !error && questions.length > 0 && currentQuestion && (
          <>
            {/* Information de progression simple */}
            <p className="quiz__progress">
              Question {currentQuestionIndex + 1} / {questions.length}
            </p>

            {/* Affichage de la question actuelle */}
            <Question
              questionText={currentQuestion.questionText}
              answers={currentQuestion.answers}
              onAnswerClick={handleAnswerClick}
            />

            {/* Texte d'information temporaire pour expliquer l'état du développement */}
            <p className="quiz__info">
              Les questions affichées sont maintenant filtrées en fonction de la
              catégorie choisie sur la page d&apos;accueil. Dans les prochains
              commits, nous ajouterons le joker, le minuteur par question et un
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