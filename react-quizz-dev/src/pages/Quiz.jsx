// src/pages/Quiz.jsx
// Page principale du quiz.
// Dans cette version, les questions sont codées "en dur" dans un tableau local.
// On affiche une question à la fois et on met à jour le score
// lorsqu'on clique sur une réponse. À la fin, on redirige vers la page des résultats.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Question from '../components/Question.jsx'

// Tableau de questions "en dur" (sans API pour le moment).
// On remplacera plus tard cette partie par un appel à une API de quiz.
const QUESTIONS = [
  {
    id: 1,
    questionText: 'Quel langage est utilisé pour créer des composants React ?',
    answers: ['Python', 'Java', 'JavaScript', 'PHP'],
    correctAnswer: 'JavaScript',
  },
  {
    id: 2,
    questionText: 'Quelle méthode permet d’afficher un composant React dans le DOM ?',
    answers: [
      'ReactDOM.createRoot().render()',
      'document.write()',
      'window.alert()',
      'console.log()',
    ],
    correctAnswer: 'ReactDOM.createRoot().render()',
  },
  {
    id: 3,
    questionText: 'Quel hook sert à gérer l’état (state) dans un composant fonctionnel ?',
    answers: ['useEffect', 'useState', 'useContext', 'useMemo'],
    correctAnswer: 'useState',
  },
]

// Note : plus tard, nous pourrons déplacer ce tableau dans un fichier séparé
// ou le remplacer entièrement par des données récupérées depuis une API.

function Quiz() {
  // Index de la question actuellement affichée (0 = première question)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Score actuel de l'utilisateur (nombre de bonnes réponses)
  const [score, setScore] = useState(0)

  // Hook de navigation fourni par React Router
  const navigate = useNavigate()

  // Récupère la question actuelle à partir du tableau QUESTIONS
  const currentQuestion = QUESTIONS[currentQuestionIndex]

  // Fonction appelée lorsque l'utilisateur clique sur une réponse
  const handleAnswerClick = (selectedAnswer) => {
    console.log('Réponse choisie :', selectedAnswer)

    // On vérifie si la réponse choisie est correcte
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    // Variable temporaire pour calculer le prochain score
    let nextScore = score

    if (isCorrect) {
      nextScore = score + 1
      setScore(nextScore)
    }

    // Est-ce que la question actuelle est la dernière du quiz ?
    const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1

    if (!isLastQuestion) {
      // Si ce n'est pas la dernière question, on passe simplement à la suivante
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1)
    } else {
      // Si c'est la dernière question, on redirige vers la page des résultats
      // en transmettant le score et le nombre total de questions
      navigate('/results', {
        state: {
          score: nextScore,
          total: QUESTIONS.length,
        },
      })
    }
  }

  return (
    <div className="quiz-page">
      {/* Header commun à plusieurs pages */}
      <Header />

      <main className="quiz">
        <h2>Quiz React (version locale)</h2>

        {/* Information de progression simple */}
        <p className="quiz__progress">
          Question {currentQuestionIndex + 1} / {QUESTIONS.length}
        </p>

        {/* Affichage de la question actuelle */}
        <Question
          questionText={currentQuestion.questionText}
          answers={currentQuestion.answers}
          onAnswerClick={handleAnswerClick}
        />

        {/* Texte d'information temporaire pour expliquer l'état du développement */}
        <p className="quiz__info">
          Dans cette version, les questions sont stockées localement dans le code.
          Dans les prochains commits, nous ajouterons le chargement dynamique
          des questions via une API, puis la gestion du joker et du minuteur.
        </p>
      </main>
    </div>
  )
}

export default Quiz