# React Quiz 🎯

Projet de quiz réalisé en React dans le cadre du cours de développement (H3).

L’objectif est de créer une application de quiz interactive, avec :
- chargement dynamique des questions depuis une API,
- gestion du score et des résultats,
- choix de catégorie (thème),
- fonctionnalités avancées comme un **joker** et une **barre de progression**.

-

## 🧩 Structure du projet

Le dépôt contient actuellement le dossier principal suivant :

- `react-quizz-dev/` : application React (créée avec Vite)

À l’intérieur de `react-quizz-dev/` :

- `src/`
  - `App.jsx` : composant racine, contient la configuration des routes (Home, Quiz, Results)
  - `main.jsx` : point d’entrée de l’application, avec `BrowserRouter`
  - `api.js` : fonctions utilitaires pour récupérer les questions depuis l’API OpenTDB
  - `components/`
    - `Header.jsx` : en-tête commun (titre + sous-titre)
    - `Question.jsx` : affiche une question et ses réponses (boutons)
    - `Score.jsx` : affiche le score final
  - `pages/`
    - `Home.jsx` : page d’accueil (présentation du quiz + choix de catégorie + bouton Commencer)
    - `Quiz.jsx` : page principale du quiz (questions, progression, joker, score)
    - `Results.jsx` : page de résultats (score final + actions pour rejouer)



## 🚀 Installation et lancement

1. Cloner le dépôt puis entrer dans le dossier (si ce n’est pas déjà fait) :

   ```bash
   cd react-quizz/react-quizz-dev

	2.	Installer les dépendances :

npm install


	3.	Lancer l’application en mode développement :

npm run dev


	4.	Ouvrir l’URL indiquée dans le terminal (en général : http://localhost:5173).



 Fonctionnalités actuellement implémentées

État du projet au moment de ce README :

1. Navigation entre les pages
	•	Utilisation de React Router :
	•	/ → page Home
	•	/quiz → page Quiz
	•	/results → page Results
	•	Le bouton “Commencer le quiz” sur la page d’accueil redirige vers la page /quiz et transmet la catégorie choisie.
	•	La page Résultats permet :
	•	de rejouer avec le même thème,
	•	ou de revenir à l’accueil pour choisir un nouveau thème.

2. Choix de la catégorie (thème du quiz)

Sur la page d’accueil (Home.jsx) :
	•	Une liste déroulante permet de choisir parmi plusieurs catégories, par exemple :
	•	Culture générale
	•	Livres
	•	Cinéma
	•	Musique
	•	Télévision
	•	Jeux vidéo
	•	Science & nature
	•	Informatique
	•	Sport
	•	Histoire
	•	Animaux
	•	Le categoryId correspondant est transmis à la page Quiz via navigate('/quiz', { state: { categoryId } }).
	•	Sur la page Quiz, le thème est affiché sous la forme :
Thème sélectionné : nom de la catégorie
ou Catégorie aléatoire si aucune catégorie n’a été fournie (accès direct à /quiz).

3. Quiz avec questions dynamiques (API OpenTDB)

Le fichier src/api.js contient une fonction :

fetchQuizQuestions({ amount = 10, category, difficulty })

Elle :
	•	appelle l’API OpenTDB (https://opentdb.com/api.php),
	•	récupère des questions à choix multiples,
	•	mélange les réponses,
	•	renvoie un tableau de questions dans un format normalisé :

{
  id: string,
  questionText: string,
  answers: string[],
  correctAnswer: string,
}

Sur la page Quiz.jsx :
	•	useEffect est utilisé pour charger 10 questions au montage du composant (et quand la catégorie change).
	•	Gestion d’un état de chargement (isLoading) :
	•	message “Chargement des questions en cours…” pendant la requête.
	•	Gestion d’un état d’erreur (error) :
	•	message en cas de problème avec l’API.
	•	Gestion du cas où aucune question n’est renvoyée par l’API :
	•	message spécifique invitant à réessayer.

4. Logique du quiz (score, progression, résultats)

Sur la page Quiz :
	•	Affichage d’une question à la fois.
	•	Affichage d’une barre de progression visuelle avec :
	•	le texte Question X / N,
	•	une barre qui se remplit en fonction de l’avancement.
	•	Quand l’utilisateur clique sur une réponse :
	•	on compare la réponse choisie à correctAnswer,
	•	si la réponse est correcte, le score est incrémenté,
	•	on passe à la question suivante,
	•	à la dernière question, on redirige vers /results avec :
	•	le score,
	•	le nombre total de questions,
	•	la catégorie utilisée (si elle existe).

Sur la page Results :
	•	Récupération des données via useLocation().state :
	•	score,
	•	total,
	•	categoryId (facultatif).
	•	Utilisation du composant Score pour afficher :
Tu as obtenu X bonne(s) réponse(s) sur Y.
	•	Propose deux actions :
	•	Rejouer avec le même thème → renvoie vers /quiz en réutilisant la même catégorie.
	•	Choisir un nouveau thème → renvoie vers /.

Si l’utilisateur arrive directement sur /results (sans passer par le quiz), le code utilise des valeurs par défaut (score = 0, total = 0) pour éviter tout crash.

5. Joker (personnalisation)

Une fonctionnalité personnalisée “Joker” a été ajoutée :
	•	Un joker utilisable une seule fois par partie.
	•	Sur la page Quiz :
	•	une section dédiée explique le principe du joker,
	•	un bouton “Utiliser mon joker” est affiché (et désactivé après utilisation).
	•	Effet du joker :
	•	il réduit le nombre de réponses possibles pour la question en cours :
	•	on garde la bonne réponse,
	•	et une seule mauvaise réponse choisie au hasard.
	•	les boutons de réponses sont mis à jour en conséquence.
	•	Le calcul du score reste le même (comparaison avec correctAnswer).



🧠 Technologies utilisées
	•	React (composants fonctionnels, hooks : useState, useEffect)
	•	Vite (outillage et dev server)
	•	React Router (react-router-dom) pour la navigation
	•	Fetch API pour appeler l’API OpenTDB



📌 Prochaines étapes prévues

Les fonctionnalités suivantes sont prévues mais pas encore implémentées au moment de ce README :

Fonctionnalités avancées / bonus
	•	Minuteur par question :
	•	temps limité pour répondre,
	•	passage automatique à la question suivante ou pénalité en cas de temps écoulé.
	•	Feedback visuel pour les réponses :
	•	couleurs ou styles différents pour indiquer une bonne/mauvaise réponse,
	•	éventuellement petites animations.
	•	Amélioration du design général :
	•	styles CSS plus avancés,
	•	meilleure mise en page et responsivité,
	•	éventuellement quelques animations légères.

Autres idées possibles
	•	Meilleur score sauvegardé (localStorage),
	•	Choix de la difficulté (easy / medium / hard),
	•	Affichage de statistiques supplémentaires sur la page des résultats.



👥 Auteurs

Projet réalisé par :
	•	Barr
	•	Mathys

