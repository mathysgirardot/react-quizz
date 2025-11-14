// src/pages/Quiz.jsx
// Page principale du quiz.
// Questions récupérées dynamiquement selon la catégorie ET la difficulté
// choisies sur la page d'accueil.

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Question from '../components/Question.jsx'
import { fetchQuizQuestions } from '../api.js'

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

const QUESTION_TIME_SECONDS = 20
const FEEDBACK_DELAY_MS = 800

function Quiz() {
  const location = useLocation()
  const navigate = useNavigate()

  const categoryIdFromState = location.state?.categoryId
  const difficultyFromState = location.state?.difficulty

  const categoryId = typeof categoryIdFromState === 'number'
    ? categoryIdFromState
    : null

  const difficulty = typeof difficultyFromState === 'string'
    ? difficultyFromState
    : null

  const categoryLabel = categoryId
    ? CATEGORY_LABELS[categoryId] || 'Catégorie personnalisée'
    : 'Catégorie aléatoire'

  const difficultyLabel = difficulty
    ? DIFFICULTY_LABELS[difficulty] || difficulty
    : 'Non définie'

  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasUsedJoker, setHasUsedJoker] = useState(false)
  const [currentAnswers, setCurrentAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  useEffect(() => {
    async function loadQuestions() {
      try {
        setIsLoading(true)
        setError(null)

        const options = { amount: 10 }

        if (categoryId) {
          options.category = categoryId
        }

        if (difficulty) {
          options.difficulty = difficulty
        }

        const loadedQuestions = await fetchQuizQuestions(options)

        setQuestions(loadedQuestions)
        setCurrentQuestionIndex(0)
        setScore(0)
        setHasUsedJoker(false)
        setTimeLeft(QUESTION_TIME_SECONDS)
        setSelectedAnswer(null)
      } catch (err) {
        console.error('Erreur lors du chargement des questions :', err)
        setError("Impossible de charger les questions. Merci de réessayer plus tard.")
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [categoryId, difficulty])

  const totalQuestions = questions.length
  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    if (currentQuestion) {
      setCurrentAnswers(currentQuestion.answers)
      setTimeLeft(QUESTION_TIME_SECONDS)
      setSelectedAnswer(null)
    } else {
      setCurrentAnswers([])
    }
  }, [currentQuestion])

  function handleTimeUp() {
    if (!currentQuestion) return

    const isLastQuestion = currentQuestionIndex === totalQuestions - 1

    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      navigate('/results', {
        state: {
          score,
          total: totalQuestions,
          categoryId,
          difficulty,
        },
      })
    }
  }

  useEffect(() => {
    if (isLoading || error || !currentQuestion) return undefined
    if (selectedAnswer !== null) return undefined

    if (timeLeft <= 0) {
      handleTimeUp()
      return undefined
    }

    const timeoutId = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [timeLeft, isLoading, error, currentQuestion, selectedAnswer])

  const progressPercentage = totalQuestions > 0
    ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)
    : 0

  const handleAnswerClick = (answer) => {
    if (!currentQuestion) return
    if (selectedAnswer !== null) return

    setSelectedAnswer(answer)

    const isCorrect = answer === currentQuestion.correctAnswer
    let nextScore = score

    if (isCorrect) {
      nextScore = score + 1
      setScore(nextScore)
    }

    const isLastQuestion = currentQuestionIndex === totalQuestions - 1

    setTimeout(() => {
      if (!isLastQuestion) {
        setCurrentQuestionIndex((prev) => prev + 1)
      } else {
        navigate('/results', {
          state: {
            score: nextScore,
            total: totalQuestions,
            categoryId,
            difficulty,
          },
        })
      }
    }, FEEDBACK_DELAY_MS)
  }

  const handleUseJoker = () => {
    if (!currentQuestion || hasUsedJoker) return

    const correctAnswer = currentQuestion.correctAnswer
    const incorrectAnswers = currentQuestion.answers.filter(
      (ans) => ans !== correctAnswer,
    )

    if (incorrectAnswers.length === 0) return

    const randomIndex = Math.floor(Math.random() * incorrectAnswers.length)
    const randomIncorrectAnswer = incorrectAnswers[randomIndex]

    const reducedAnswers = currentAnswers.filter(
      (ans) => ans === correctAnswer || ans === randomIncorrectAnswer,
    )

    setCurrentAnswers(reducedAnswers)
    setHasUsedJoker(true)
  }

  return (
    <div className="quiz-page">
      <main className="quiz">
        <h2>Quiz React (catégories, difficulté, minuteur et joker)</h2>

        <p className="quiz__category">
          Thème sélectionné : <strong>{categoryLabel}</strong>
        </p>

        {difficulty && (
          <p className="quiz__category">
            Difficulté : <strong>{difficultyLabel}</strong>
          </p>
        )}

        {isLoading && (
          <p className="quiz__status">Chargement des questions en cours...</p>
        )}

        {error && !isLoading && (
          <p className="quiz__status quiz__status--error">{error}</p>
        )}

        {!isLoading
          && !error
          && questions.length > 0
          && currentQuestion
          && currentAnswers.length > 0 && (
            <>
              <div className="quiz__progress-container">
                <div className="quiz__progress-text">
                  Question {currentQuestionIndex + 1} / {totalQuestions}
                </div>
                <div className="quiz__progress-bar">
                  <div
                    className="quiz__progress-bar-fill"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div
                className={`quiz__timer ${
                  timeLeft <= 5 ? 'quiz__timer--danger' : ''
                }`}
              >
                <p>
                  Temps restant : <strong>{timeLeft}</strong> seconde(s)
                </p>
              </div>

              <Question
                questionText={currentQuestion.questionText}
                answers={currentAnswers}
                onAnswerClick={handleAnswerClick}
                selectedAnswer={selectedAnswer}
                correctAnswer={currentQuestion.correctAnswer}
              />

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

              <p className="quiz__info">
                Les questions affichées sont filtrées en fonction de la
                catégorie et de la difficulté choisies sur la page d&apos;accueil.
                Tu disposes d&apos;un joker par partie pour t&apos;aider, ainsi que d&apos;un
                temps limité pour répondre à chaque question.
              </p>
            </>
        )}

        {!isLoading && !error && questions.length === 0 && (
          <p className="quiz__status">
            Aucune question n&apos;a été trouvée pour ce thème. Merci de réessayer
            avec une autre catégorie ou une autre difficulté.
          </p>
        )}
      </main>
    </div>
  )
}

export default Quiz