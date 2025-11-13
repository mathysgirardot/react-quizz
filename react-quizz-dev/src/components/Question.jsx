// src/components/Question.jsx
// Composant responsable de l'affichage d'une question et de ses réponses.
// Il reçoit :
// - questionText : le texte de la question
// - answers : un tableau de réponses possibles (chaînes de caractères)
// - onAnswerClick : une fonction appelée quand l'utilisateur clique sur une réponse

function Question({ questionText, answers, onAnswerClick }) {
  // Fonction appelée lorsqu'on clique sur un bouton de réponse
  const handleClick = (answer) => {
    // On remonte l'information au parent (Quiz)
    if (onAnswerClick) {
      onAnswerClick(answer)
    }
  }

  return (
    <section className="question">
      <h3 className="question__title">{questionText}</h3>

      <ul className="question__answers">
        {answers && answers.map((answer) => (
          <li key={answer}>
            <button
              className="question__answer-button"
              onClick={() => handleClick(answer)}
            >
              {answer}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Question