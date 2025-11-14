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
// - Joker utilisable une seule fois par partie
//   -> réduit le nombre de réponses possibles pour la question en cours
// - Minuteur par question (20 secondes)
//   -> quand le temps est écoulé, on passe à la question suivante
// - (NOUVEAU) Feedback visuel sur la réponse choisie
//   -> vert si bonne réponse, rouge si mauvaise, avec un court délai avant la question suivante

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

// Durée (en secondes) allouée pour répondre à chaque question.
const QUESTION_TIME_SECONDS = 20

// Durée (en millisecondes) pendant laquelle on affiche le feedback visuel
// avant de passer à la question suivante.
const FEEDBACK_DELAY_MS = 800

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

  // Temps restant pour répondre à la question actuelle (en secondes)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS)

  // Réponse actuellement sélectionnée par l'utilisateur.
  // Sert pour le feedback visuel (vert/rouge) et pour bloquer les doubles clics.
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  // Effet exécuté au montage du composant et lorsque la catégorie change
  useEffect(() => {
    async function loadQuestions() {
      try {
        setIsLoading(true)
        setError(null)

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
  }, [categoryId])

  const totalQuestions = questions.length

  // Question actuelle (peut être undefined si le tableau est vide)
  const currentQuestion = questions[currentQuestionIndex]

  // À chaque fois que la question actuelle change, on réinitialise
  // la liste des réponses affichées et le minuteur, et on efface
  // la réponse sélectionnée.
  useEffect(() => {
    if (currentQuestion) {
      setCurrentAnswers(currentQuestion.answers)
      setTimeLeft(QUESTION_TIME_SECONDS)
      setSelectedAnswer(null)
    } else {
      setCurrentAnswers([])
    }
  }, [currentQuestion])

  // Fonction appelée lorsque le temps est écoulé pour la question courante.
  // Ici, on considère que la réponse est simplement "ratée" et on passe
  // à la question suivante (sans modifier le score).
  function handleTimeUp() {
    if (!currentQuestion) {
      return
    }

    const isLastQuestion = currentQuestionIndex === totalQuestions - 1

    if (!isLastQuestion) {
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1)
    } else {
      navigate('/results', {
        state: {
          score,
          total: totalQuestions,
          categoryId,
        },
      })
    }
  }

  // Effet responsable du compte à rebours du minuteur.
  // Le minuteur s'arrête dès qu'une réponse est sélectionnée
  // (on met en pause le temps pendant l'affichage du feedback).
  useEffect(() => {
    if (isLoading || error || !currentQuestion) {
      return undefined
    }

    // Si une réponse est sélectionnée, on ne décrémente plus le temps.
    if (selectedAnswer !== null) {
      return undefined
    }

    if (timeLeft <= 0) {
      handleTimeUp()
      return undefined
    }

    const timeoutId = setTimeout(() => {
      setTimeLeft((previousTime) => previousTime - 1)
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [timeLeft, isLoading, error, currentQuestion, selectedAnswer])

  // Calcul du pourcentage de progression pour la barre.
  const progressPercentage = totalQuestions > 0
    ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)
    : 0

  // Fonction appelée lorsque l'utilisateur clique sur une réponse
  const handleAnswerClick = (answer) => {
    if (!currentQuestion) {
      return
    }

    // Si une réponse est déjà sélectionnée, on ignore les clics supplémentaires.
    if (selectedAnswer !== null) {
      return
    }

    // On mémorise la réponse choisie pour afficher le feedback (vert/rouge)
    setSelectedAnswer(answer)

    const isCorrect = answer === currentQuestion.correctAnswer

    let nextScore = score

    if (isCorrect) {
      nextScore = score + 1
      setScore(nextScore)
    }

    const isLastQuestion = currentQuestionIndex === totalQuestions - 1

    // On laisse un petit délai pour montrer le feedback visuel
    // avant de passer à la question suivante ou aux résultats.
    setTimeout(() => {
      if (!isLastQuestion) {
        setCurrentQuestionIndex((previousIndex) => previousIndex + 1)
      } else {
        navigate('/results', {
          state: {
            score: nextScore,
            total: totalQuestions,
            categoryId,
          },
        })
      }
    }, FEEDBACK_DELAY_MS)
  }

  // Fonction appelée lorsque l'utilisateur clique sur le bouton "Utiliser mon joker"
  const handleUseJoker = () => {
    if (!currentQuestion) {
      return
    }

    if (hasUsedJoker) {
      return
    }

    const correctAnswer = currentQuestion.correctAnswer
    const incorrectAnswers = currentQuestion.answers.filter(
      (ans) => ans !== correctAnswer,
    )

    if (incorrectAnswers.length === 0) {
      return
    }

    const randomIndex = Math.floor(Math.random() * incorrectAnswers.length)
    const randomIncorrectAnswer = incorrectAnswers[randomIndex]

    const reducedAnswers = currentAnswers.filter(
      (ans) =>
        ans === correctAnswer || ans === randomIncorrectAnswer,
    )

    setCurrentAnswers(reducedAnswers)
    setHasUsedJoker(true)
  }

  return (
    <div className="quiz-page">
      <Header />

      <main className="quiz">
        <h2>Quiz React (catégories, barre de progression, joker, minuteur et feedback)</h2>

        <p className="quiz__category">
          Thème sélectionné : <strong>{categoryLabel}</strong>
        </p>

        {isLoading && (
          <p className="quiz__status">
            Chargement des questions en cours...
          </p>
        )}

        {error && !isLoading && (
          <p className="quiz__status quiz__status--error">
            {error}
          </p>
        )}

        {!isLoading
          && !error
          && questions.length > 0
          && currentQuestion
          && currentAnswers.length > 0 && (
            <>
              {/* Bloc progression + minuteur */}
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


              {/*
              <div className="quiz__timer">
                <p>
                  Temps restant :{' '}
                  <strong>{timeLeft}</strong>
                  {' '}
                  seconde(s)
                </p>
              </div>
               */}

              <div className={`quiz__timer ${ timeLeft <= 5 ? 'quiz__timer--danger' : ''}`}>
                <p>
                  Temps restant :{' '}
                  <strong>{timeLeft}</strong>
                  {' '}
                  seconde(s)
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
                catégorie choisie sur la page d&apos;accueil. Tu disposes
                d&apos;un joker par partie pour t&apos;aider, ainsi que d&apos;un
                temps limité pour répondre à chaque question. Un feedback
                visuel t&apos;indique si ta réponse est correcte ou non.
              </p>
            </>
        )}

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