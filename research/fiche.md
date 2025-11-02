# Recherche sur trois notions de React : événements, état local et routage

## 1. Gestion des événements
Dans React, les événements sont des actions que l’utilisateur peut faire sur la page, comme cliquer sur un bouton ou écrire dans un champ. Pour réagir à ces actions, on utilise des attributs comme `onClick`, `onChange` ou `onSubmit`. Ces événements ressemblent à ceux du JavaScript classique, mais en React, on les écrit avec une majuscule (ex : `onClick` au lieu de `onclick`) et on leur passe une fonction. Cela permet de rendre les composants interactifs.

## 2. L’état local des composants (useState)
Le state (ou état) sert à garder des informations qui peuvent changer dans un composant. Par exemple, un compteur qui augmente à chaque clic stocke sa valeur dans le state. En React, on utilise le hook `useState` pour créer et modifier cet état. Quand le state change, le composant se met automatiquement à jour à l’écran.

## 3. Le routage avec React Router
Le routage permet de naviguer entre plusieurs pages sans recharger tout le site. Pour cela, on peut utiliser **React Router**. Il permet de définir des chemins (comme `/accueil` ou `/profil`) et d’afficher les bons composants selon le chemin. Cela donne l’impression d’une vraie application fluide à page unique.



###  Questions à discuter
1. Quand plusieurs composants ont besoin d’utiliser la même information, est-ce qu’on doit dupliquer le state dans chacun d’eux, ou existe-t-il une meilleure manière de le partager ?  
2. Dans une application React, est-ce qu’on peut faire du routage sans utiliser React Router, et si oui, dans quels cas cela aurait du sens ?



### Source consultée
- Documentation officielle React : [https://react.dev/learn](https://react.dev/learn)
