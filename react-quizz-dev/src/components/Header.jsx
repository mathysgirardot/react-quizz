// src/components/Header.jsx
// Composant d'en-tête affiché en haut de l'application.
// Il affiche le titre du projet et un bouton permettant
// de changer le thème (mode clair / mode sombre).

function Header({ theme = 'light', onToggleTheme }) {
  // Texte affiché sur le bouton en fonction du thème actuel.
  const isDark = theme === 'dark'
  const buttonLabel = isDark ? 'Passer en mode clair' : 'Passer en mode sombre'

  return (
    <header className="header">
      <div className="header__left">
        <h1>React Quiz</h1>
        <p>Petit quiz interactif avec thèmes, difficulté, joker et minuteur.</p>
      </div>

      <div className="header__right">
        <button
          type="button"
          className="header__theme-toggle"
          onClick={onToggleTheme}
        >
          {/* Petit indicateur visuel du thème actuel */}
          <span className="header__theme-icon" aria-hidden="true">
            {isDark ? '🌙' : '☀️'}
          </span>
          <span className="header__theme-label">{buttonLabel}</span>
        </button>
      </div>
    </header>
  )
}

export default Header