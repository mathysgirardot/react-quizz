// src/pages/Quiz.jsx
// Page principale du quiz.
// Pour l'instant, les questions sont codées "en dur" dans un tableau local.
// Objectif : afficher une question à la fois et passer à la suivante
// lorsqu'on clique sur une réponse.

import { useState } from 'react'
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

// Note : pour l’instant, on n’utilise pas encore la propriété correctAnswer.
// On s’en servira plus tard pour calculer le score.

function Quiz() {
  // Index de la question actuellement affichée (0 = première question)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Récupère la question actuelle à partir du tableau QUESTIONS
  const currentQuestion = QUESTIONS[currentQuestionIndex]

  // Fonction appelée lorsque l'utilisateur clique sur une réponse
  const handleAnswerClick = (selectedAnswer) => {
    console.log('Réponse choisie :', selectedAnswer)

    // Ici, dans un prochain commit, on comparera selectedAnswer
    // à currentQuestion.correctAnswer pour mettre à jour le score.

    // Si ce n'est pas la dernière question, on passe à la suivante.
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1)
    } else {
      // Si c'est la dernière question, on affichera plus tard la page de résultats.
      console.log('Quiz terminé (log provisoire, redirection à venir).')
    }
  }

  return (
    <div className="quiz-page">
      {/* On réutilise le même Header que sur la page d'accueil */}
      <Header />

      <main className="quiz">
        <h2>Quiz React (version locale)</h2>

        {/* Petite information de progression simple */}
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
          Dans cette version, les questions sont codées en dur. Dans un prochain
          commit, nous ajouterons le calcul du score et l&apos;affichage de la
          page de résultats, puis le chargement dynamique des questions via une
          API.
        </p>
      </main>
    </div>
  )
}

export default Quiz