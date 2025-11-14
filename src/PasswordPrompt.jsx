import { useState } from 'react'
import './PasswordPrompt.css'

export default function PasswordPrompt({ onPasswordSubmit }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (!password.trim()) {
      setError('Veuillez entrer un mot de passe')
      return
    }

    const result = onPasswordSubmit(password)
    if (!result) {
      setError('Mot de passe incorrect')
      setPassword('')
    }
  }

  return (
    <div className="password-screen">
      <div className="password-card">
        <h1 className="password-title">🌋 Zouzou et Zaza</h1>
        <p className="password-subtitle">Calendrier de l'avent des potes</p>
        
        <div className="decorative-line">❦</div>
        
        <form onSubmit={handleSubmit} className="password-form">
          <label htmlFor="password" className="password-label">
            Entrez votre mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
            placeholder="••••••••"
            autoFocus
          />
          
          {error && (
            <div className="password-error">
              {error}
            </div>
          )}
          
          <button type="submit" className="password-button">
            Entrer
          </button>
        </form>
        
        <div className="password-hint">
          <p>👥 Pour Zouzou & Zaza : utilisez votre mot de passe</p>
          <p>🎨 Pour les potes : utilisez le mot de passe partagé</p>
        </div>
      </div>
    </div>
  )
}
