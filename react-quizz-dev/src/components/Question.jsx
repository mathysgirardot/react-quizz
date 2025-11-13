// src/components/Question.jsx

function Question({ questionText, answers }) {
    return (
      <section className="question">
        <h3 className="question__title">{questionText}</h3>
  
        <ul className="question__answers">
          {answers && answers.map((answer) => (
            <li key={answer}>
              {/* TODO: gérer le clic sur une réponse plus tard */}
              <button className="question__answer-button">
                {answer}
              </button>
            </li>
          ))}
        </ul>
      </section>
    )
  }
  
  export default Question