# React Quiz 

Projet de quiz réalisé en React dans le cadre du cours de développement (H3).

L’objectif est de créer une application de quiz interactive, avec chargement dynamique des questions, gestion du score, et plusieurs fonctionnalités avancées (joker, minuteur, choix de catégorie, etc.).



## Structure du projet

Le dépôt contient actuellement le dossier principal suivant :

- `react-quizz-dev/` : application React (créée avec Vite)

À l’intérieur de `react-quizz-dev/` :

- `src/`
  - `App.jsx` : composant racine, contient la configuration des routes (Home, Quiz, Results)
  - `main.jsx` : point d’entrée de l’application, avec `BrowserRouter`
  - `api.js` : fonctions utilitaires pour récupérer les questions depuis l’API OpenTDB
  - `components/`
    - `Header.jsx` : en-tête commun (titre + sous-titre)
    - `Question.jsx` : affiche une question et ses réponses
    - `Score.jsx` : affiche le score final
  - `pages/`
    - `Home.jsx` : page d’accueil (présentation du quiz + bouton “Commencer”)
    - `Quiz.jsx` : page principale du quiz (questions, navigation, score)
    - `Results.jsx` : page de résultats (score final + bouton retour à l’accueil)



##  Installation et lancement

1. Cloner le dépôt (ou récupérer le projet) puis entrer dans le dossier :

   ```bash
   cd react-quizz/react-quizz-dev

	2.	Installer les dépendances :

npm install


	3.	Lancer l’application en mode développement :

npm run dev


	4.	Ouvrir l’URL indiquée dans le terminal (en général : http://localhost:5173).



## Fonctionnalités actuellement implémentées

État du projet au moment de ce README :

1. Navigation entre les pages
	•	Utilisation de React Router :
	•	/ → page Home
	•	/quiz → page Quiz
	•	/results → page Results
	•	Le bouton “Commencer le quiz” sur la page d’accueil redirige vers la page /quiz.

2. Quiz avec questions dynamiques (API OpenTDB)
	•	Les questions ne sont plus codées en dur.
	•	Le fichier src/api.js contient une fonction :

fetchQuizQuestions({ amount = 10, category, difficulty })

qui :
	•	appelle l’API OpenTDB (https://opentdb.com/api.php),
	•	récupère des questions à choix multiples,
	•	mélange les réponses,
	•	renvoie un tableau normalisé :

{
  id: string,
  questionText: string,
  answers: string[],
  correctAnswer: string
}


	•	La page Quiz.jsx :
	•	utilise useEffect pour charger 10 questions au montage,
	•	gère un état de chargement (isLoading) et un état d’erreur (error),
	•	affiche un message :
	•	“Chargement des questions en cours…” le temps de la requête,
	•	un message d’erreur si l’API ne répond pas,
	•	ou un message si aucune question n’est disponible.

3. Logique de quiz (base)

Sur la page Quiz :
	•	Affichage d’une question à la fois.
	•	Affichage d’une petite progression :
Question X / N
	•	Quand l’utilisateur clique sur une réponse :
	•	on vérifie si la réponse est correcte,
	•	si oui, on incrémente le score,
	•	on passe à la question suivante,
	•	à la dernière question, on redirige vers /results avec :
	•	le score
	•	le nombre total de questions

4. Page de résultats
	•	La page Results.jsx récupère le score et le total depuis la navigation (location.state).
	•	Le composant Score affiche :
Tu as obtenu X bonne(s) réponse(s) sur Y.
	•	Un bouton permet de revenir à l’accueil (redirection vers /).
	•	Si un utilisateur arrive sur /results sans passer par le quiz (pas de state), un score par défaut est affiché (0 / 0) afin d’éviter tout crash.



 Technologies utilisées
	•	React (composants fonctionnels, hooks)
	•	Vite (outillage et dev server)
	•	React Router (react-router-dom) pour la navigation
	•	Fetch API pour appeler l’API OpenTDB


 Prochaines étapes prévues

Les fonctionnalités suivantes sont prévues mais pas encore implémentées au moment de ce README :

Niveau 2 (recommandé)
	•	Choix du thème / catégorie du quiz (ex : cinéma, sport, etc.) sur la page d’accueil :
	•	transmettre ce choix à la page Quiz,
	•	utiliser ce paramètre dans l’appel à fetchQuizQuestions.
	•	Amélioration de la barre de progression (visuelle, plus claire).
	•	Ajout d’un bouton “Rejouer” sur la page de résultats pour relancer une nouvelle partie rapidement.

Personnalisation / fonctionnalités avancées
	•	Joker (fonctionnalité personnalisée, une seule utilisation par partie) :
	•	par exemple : retirer une mauvaise réponse, passer une question, etc.
	•	Minuteur par question :
	•	compteur de temps,
	•	éventuelle pénalité ou passage automatique à la question suivante.
	•	Feedback visuel pour les bonnes/mauvaises réponses :
	•	changement de couleur,
	•	messages de retour, etc.

Autres idées
	•	Meilleur score sauvegardé (localStorage),
	•	Choix de la difficulté (easy / medium / hard),
	•	Affichage de statistiques sur la page des résultats.


 Auteurs

Projet réalisé par :
	•	Barr
	•	Mathys

dans le cadre du cours React / Développement web (H3).

-

