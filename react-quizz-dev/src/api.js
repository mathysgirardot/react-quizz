// src/api.js
// Fonctions utilitaires pour récupérer les questions du quiz depuis une API externe.
//
// Dans cette application, nous utilisons l'API Open Trivia Database :
// https://opentdb.com/
//
// L'objectif de ce fichier est de centraliser la logique de récupération
// et de transformation des données, afin que les composants React
// (comme la page Quiz) restent plus simples à lire.

// Petite fonction utilitaire pour mélanger un tableau (algorithme de Fisher-Yates).
// Elle sera utilisée pour mélanger l'ordre des réponses possibles.
function shuffleArray(array) {
    const result = [...array]
  
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = result[i]
      result[i] = result[j]
      result[j] = temp
    }
  
    return result
  }
  
  /**
   * Récupère des questions de quiz depuis l'API OpenTDB
   * et les transforme dans un format adapté à notre application.
   *
   * @param {Object} options - Options pour la requête.
   * @param {number} options.amount - Nombre de questions à récupérer (par défaut 10).
   * @param {number} [options.category] - Identifiant de catégorie (optionnel).
   * @param {string} [options.difficulty] - Difficulté : "easy", "medium" ou "hard" (optionnel).
   * @returns {Promise<Array>} - Promesse qui résout vers un tableau de questions normalisées.
   *
   * Chaque question renvoyée a la forme suivante :
   * {
   *   id: string,
   *   questionText: string,
   *   answers: string[],
   *   correctAnswer: string,
   * }
   */
  export async function fetchQuizQuestions({ amount = 10, category, difficulty } = {}) {
    const params = new URLSearchParams({
      amount: String(amount),
      type: 'multiple', // on ne veut que des questions à choix multiples
    })
  
    if (category) {
      params.append('category', String(category))
    }
  
    if (difficulty) {
      params.append('difficulty', difficulty)
    }
  
    const url = `https://opentdb.com/api.php?${params.toString()}`
  
    const response = await fetch(url)
  
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des questions (code ${response.status})`)
    }
  
    const data = await response.json()
  
    // L'API renvoie les questions dans data.results
    // On les transforme dans un format plus simple pour notre application.
    const normalizedQuestions = data.results.map((item, index) => {
      const allAnswers = shuffleArray([
        ...item.incorrect_answers,
        item.correct_answer,
      ])
  
      return {
        id: `${Date.now()}-${index}`, // identifiant simple basé sur l'index et la date
        questionText: item.question, // attention : contient parfois des entités HTML (&quot;, &amp;, etc.)
        answers: allAnswers,
        correctAnswer: item.correct_answer,
      }
    })
  
    return normalizedQuestions
  }
  
  