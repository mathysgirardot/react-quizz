// src/components/Score.jsx
// Composant d'affichage du score final du quiz.
// Il reçoit :
// - score : nombre de bonnes réponses
// - total : nombre total de questions

function Score({ score, total }) {
  return (
    <div className="score">
      <p>
        Tu as obtenu <strong>{score}</strong> bonne(s) réponse(s) sur {total}.
      </p>
    </div>
  )
}

export default Score