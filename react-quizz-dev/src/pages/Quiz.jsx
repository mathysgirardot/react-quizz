// src/pages/Quiz.jsx
// Page principale du quiz.
// Dans cette version, les questions sont récupérées dynamiquement
// depuis l'API OpenTDB via la fonction fetchQuizQuestions.
//
// Fonctionnalités actuelles :
// - Chargement des questions au montage du composant
// - Affichage d'une question à la fois
// - Mise à jour du score lorsque l'utilisateur clique sur une réponse
// - Redirection vers la page des résultats à la fin du quiz
// - Gestion d'un état de chargement et d'une erreur simple

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Question from '../components/Question.jsx'
import { fetchQuizQuestions } from '../api.js'

function Quiz() {
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

  // Hook de navigation fourni par React Router
  const navigate = useNavigate()

  // Effet exécuté au montage du composant pour charger les questions
  useEffect(() => {
    async function loadQuestions() {
      try {
        setIsLoading(true)
        setError(null)

        // On demande 10 questions à choix multiple à l'API
        const loadedQuestions = await fetchQuizQuestions({
          amount: 10,
        })

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
  }, [])

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
        <h2>Quiz React (version API)</h2>

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
              Les questions affichées sont maintenant récupérées dynamiquement
              depuis l&apos;API OpenTDB. Dans les prochains commits, nous
              ajouterons le joker, le minuteur par question et un meilleur
              feedback visuel pour les bonnes/mauvaises réponses.
            </p>
          </>
        )}

        {/* Cas où l'API renvoie 0 question (peu probable mais géré proprement) */}
        {!isLoading && !error && questions.length === 0 && (
          <p className="quiz__status">
            Aucune question n&apos;a été trouvée. Merci de réessayer plus tard.
          </p>
        )}
      </main>
    </div>
  )
}

export default Quiz