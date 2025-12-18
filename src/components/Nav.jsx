import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Nav = () => {
  const loc = useLocation()
  const linkClass = (p) => (
    `px-3 py-2 rounded ${loc.pathname === p ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`
  )

  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Alelo-IA-Anatra</h1>
        <nav className="flex gap-2">
          <Link to="/" className={linkClass('/')}>Accueil</Link>
          <Link to="/quiz" className={linkClass('/quiz')}>Quiz</Link>
          <Link to="/analyze" className={linkClass('/analyze')}>Analyse</Link>
          <Link to="/adaptive" className={linkClass('/adaptive')}>Parcours</Link>
        </nav>
      </div>
    </header>
  )
}

export default Nav
