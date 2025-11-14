# React Quiz 🎯

Projet de quiz réalisé en **React** dans le cadre du cours de développement (H3).

L’objectif est de créer une application de quiz interactive, avec :

- chargement dynamique des questions depuis une **API**,
- gestion du **score** et des **résultats**,
- choix de la **catégorie** (thème),
- choix du **niveau de difficulté**,
- fonctionnalités avancées comme un **joker**, une **barre de progression** et un **minuteur**,
- un **mode clair / mode sombre** et un style visuel type *glassmorphism*.

---

## 🧩 Structure du projet

Le dépôt contient actuellement le dossier principal suivant :

- `react-quizz-dev/` : application React (créée avec **Vite**)

À l’intérieur de `react-quizz-dev/` :

- `src/`
  - `main.jsx` : point d’entrée de l’application, avec `BrowserRouter`
  - `App.jsx` : composant racine  
    - contient la configuration des **routes** (Home, Quiz, Results)  
    - gère le **thème global** (clair / sombre)  
    - affiche l’en-tête global (`Header`)
  - `api.js` : fonctions utilitaires pour récupérer les questions depuis l’API **OpenTDB**
  - `index.css` : styles globaux
  - `App.css` : styles principaux des pages (mise en page, mode sombre/clair, glassmorphism)
  - `components/`
    - `Header.jsx` : en-tête commun (titre, description, bouton de bascule **mode clair / sombre**)
    - `Question.jsx` : affiche une question et ses réponses (boutons + feedback visuel)
    - `Score.jsx` : affiche le score final
  - `pages/`
    - `Home.jsx` : page d’accueil (présentation du quiz + choix de **catégorie** + choix de **difficulté** + bouton *Commencer*)
    - `Quiz.jsx` : page principale du quiz (questions, progression, **minuteur**, **joker**, score, feedback visuel)
    - `Results.jsx` : page de résultats (score final + rappel du thème/difficulté + actions pour rejouer)

---

## 🚀 Installation et lancement

1. Cloner le dépôt puis entrer dans le dossier :

   ```bash
   cd react-quizz/react-quizz-dev

	2.	Installer les dépendances :

npm install


	3.	Lancer l’application en mode développement :

npm run dev


	4.	Ouvrir l’URL indiquée dans le terminal (en général : http://localhost:5173).

⸻

✅ Fonctionnalités implémentées

1. Navigation entre les pages
	•	Utilisation de React Router :
	•	/ → page Home
	•	/quiz → page Quiz
	•	/results → page Results
	•	Le bouton “Commencer le quiz” sur la page d’accueil redirige vers /quiz en transmettant :
	•	la catégorie choisie,
	•	la difficulté choisie.
	•	La page Results permet :
	•	de rejouer avec les mêmes paramètres (même catégorie + même difficulté),
	•	ou de revenir à l’accueil pour choisir un nouveau thème / niveau.

⸻

2. Choix de la catégorie et de la difficulté

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
	•	Une autre liste déroulante permet de choisir le niveau de difficulté :
	•	Facile (easy)
	•	Moyen (medium)
	•	Difficile (hard)
	•	Les informations transmises à la page Quiz sont :

navigate('/quiz', {
  state: {
    categoryId,
    difficulty,
  },
})

Sur la page Quiz.jsx :
	•	le thème est affiché sous la forme :
Thème sélectionné : <nom de la catégorie> (ou Catégorie aléatoire si non défini),
	•	la difficulté est affichée sous la forme :
Difficulté : Facile / Moyen / Difficile.

⸻

3. Quiz avec questions dynamiques (API OpenTDB)

Le fichier src/api.js contient la fonction :

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
	•	useEffect est utilisé pour charger 10 questions :
	•	au montage du composant,
	•	et lorsque la catégorie ou la difficulté change.
	•	Gestion d’un état de chargement (isLoading) :
	•	message “Chargement des questions en cours…” pendant la requête.
	•	Gestion d’un état d’erreur (error) :
	•	message en cas de problème avec l’API.
	•	Gestion du cas où aucune question n’est renvoyée :
	•	message spécifique invitant à réessayer avec un autre thème / niveau.

⸻

4. Logique du quiz (score, progression, résultats)

Sur la page Quiz :
	•	Affichage d’une question à la fois.
	•	Affichage d’une barre de progression visuelle avec :
	•	le texte Question X / N,
	•	une barre qui se remplit en fonction de l’avancement.
	•	Quand l’utilisateur clique sur une réponse :
	•	on compare la réponse choisie à correctAnswer,
	•	si la réponse est correcte, le score est incrémenté,
	•	après un court délai (pour montrer le feedback), on passe à la question suivante,
	•	à la dernière question, on redirige vers /results avec :
	•	le score final,
	•	le nombre total de questions,
	•	la catégorie et la difficulté utilisées.

Sur la page Results (Results.jsx) :
	•	Récupération des données via useLocation().state :
	•	score,
	•	total,
	•	categoryId (facultatif),
	•	difficulty (facultatif).
	•	Utilisation du composant Score pour afficher :
Tu as obtenu X bonne(s) réponse(s) sur Y.
	•	Propose deux actions :
	•	Rejouer avec les mêmes paramètres → renvoie vers /quiz avec la même catégorie + la même difficulté.
	•	Choisir un nouveau thème → renvoie vers /.

Si l’utilisateur arrive directement sur /results (sans passer par le quiz), des valeurs par défaut sont utilisées (score = 0, total = 0) pour éviter tout crash.

⸻

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

⸻

6. Minuteur par question ⏱️

Chaque question dispose d’un temps limité pour répondre :
	•	un compte à rebours (20 secondes par défaut) est affiché sur la page Quiz,
	•	tant qu’aucune réponse n’est sélectionnée :
	•	timeLeft décrémente chaque seconde,
	•	quand le temps arrive à 0 :
	•	la question est considérée comme ratée,
	•	on passe automatiquement à la question suivante (ou à la page de résultats si c’était la dernière).
	•	Lorsque l’utilisateur choisit une réponse :
	•	le minuteur est mis en pause le temps d’afficher le feedback,
	•	puis la question suivante s’affiche.

Le timer passe en rouge lorsqu’il reste très peu de temps (alerte visuelle).

⸻

7. Feedback visuel sur les réponses ✅❌

Le composant Question.jsx gère l’affichage des réponses :
	•	Quand une réponse est sélectionnée :
	•	la réponse choisie et correcte devient verte,
	•	la réponse choisie mais incorrecte devient rouge,
	•	la bonne réponse peut aussi être légèrement mise en valeur.
	•	Pendant l’affichage du feedback :
	•	les boutons ne sont plus cliquables (on évite les doubles clics),
	•	après un court délai, la question suivante est chargée.

Les animations sont gérées via CSS (fade-in léger des questions).

⸻

8. Mode clair / mode sombre + glassmorphism 🎨

L’application propose un mode clair et un mode sombre :
	•	L’état theme (light / dark) est géré dans App.jsx.
	•	Un bouton dans le Header permet de :
	•	basculer entre “Passer en mode sombre” et “Passer en mode clair”,
	•	avec un petit emoji ☀️ / 🌙.

Les styles sont définis dans App.css :
	•	Fond global en dégradé différent pour chaque thème.
	•	Cartes (Home, Quiz, Results) avec un effet glassmorphism :
	•	fond semi-transparent,
	•	blur (backdrop-filter),
	•	bordure légère et ombre douce.
	•	Boutons avec un rendu légèrement glossy, ombres et transitions.
	•	Animations :
	•	apparition des cartes (cardFadeInUp),
	•	apparition des questions (questionFadeIn),
	•	transitions sur les hover / clics.

⸻

🧠 Technologies utilisées
	•	React (composants fonctionnels, hooks : useState, useEffect)
	•	Vite (outil de build et dev server)
	•	React Router (react-router-dom) pour la navigation
	•	Fetch API pour appeler l’API OpenTDB
	•	CSS classique pour :
	•	le layout,
	•	le mode clair / sombre,
	•	l’effet glassmorphism,
	•	les animations simples.

⸻

🔮 Pistes d’amélioration possibles

Les idées suivantes ne sont pas implémentées mais pourraient être ajoutées :
	•	Sauvegarder le meilleur score en localStorage.
	•	Ajouter des statistiques dans la page de résultats :
	•	pourcentage de bonnes réponses,
	•	temps moyen par question, etc.
	•	Permettre de choisir le nombre de questions (5, 10, 20…).
	•	Ajouter un mode “entraînement” sans minuteur.
	•	Internationalisation (version EN / FR).

⸻

👥 Auteurs

Projet réalisé par :
	•	Abiola Barr Akobi
	•	Mathys Girardot

dans le cadre du cours React / Développement web (H3-S1).