// src/components/Score.jsx

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