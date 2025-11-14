// src/components/Question.jsx
// Composant responsable de l'affichage d'une question et de ses réponses.
//
// Il reste volontairement "simple" :
// - il reçoit la liste des réponses et la réponse correcte
// - il reçoit la réponse actuellement sélectionnée
// - il appelle onAnswerClick quand l'utilisateur clique sur une réponse
//
// Le feedback visuel (couleur verte/rouge) est géré ici en fonction
// de selectedAnswer et correctAnswer.

function Question({
  questionText,
  answers,
  onAnswerClick,
  selectedAnswer = null,
  correctAnswer = null,
}) {
  // Fonction appelée lorsqu'on clique sur une réponse.
  // Si une réponse est déjà sélectionnée, on ne déclenche plus de clic.
  const handleClick = (answer) => {
    if (selectedAnswer !== null) {
      return
    }
    onAnswerClick(answer)
  }

  return (
    <section className="question">
      {/* Certaines questions de l'API contiennent des entités HTML (&quot;, &amp;, etc.)
          On utilise dangerouslySetInnerHTML pour les afficher correctement. */}
      <h3
        className="question__text"
        dangerouslySetInnerHTML={{ __html: questionText }}
      />

      <div className="question__answers">
        {answers.map((answer) => {
          // Style visuel par défaut (bouton neutre)
          let buttonStyle = {}

          // Si une réponse a été sélectionnée, on affiche un feedback vert/rouge
          if (selectedAnswer !== null && correctAnswer) {
            if (answer === selectedAnswer && answer === correctAnswer) {
              // Réponse choisie ET correcte -> vert
              buttonStyle = {
                backgroundColor: '#2e7d32',
                color: 'white',
              }
            } else if (answer === selectedAnswer && answer !== correctAnswer) {
              // Réponse choisie MAIS incorrecte -> rouge
              buttonStyle = {
                backgroundColor: '#c62828',
                color: 'white',
              }
            } else if (answer === correctAnswer) {
              // Optionnel : on peut aussi surligner la bonne réponse
              // même si l'utilisateur s'est trompé (couleur plus douce).
              buttonStyle = {
                backgroundColor: '#388e3c',
                color: 'white',
                opacity: 0.85,
              }
            }
          }

          return (
            <button
              key={answer}
              type="button"
              className="question__answer-button"
              style={buttonStyle}
              onClick={() => handleClick(answer)}
            >
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default Question