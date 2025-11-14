import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'

// Configuration Supabase - Variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [entries, setEntries] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [expandedEntry, setExpandedEntry] = useState(null)
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' or 'desc'
  
  // Formulaire admin
  const [newDate, setNewDate] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [newPhoto, setNewPhoto] = useState(null)
  const [uploading, setUploading] = useState(false)

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('date', { ascending: sortOrder === 'asc' })

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error("Erreur lors du chargement:", error)
    } finally {
      setLoading(false)
    }
  }

  // Reload when sort order changes
  useEffect(() => {
    if (!loading) loadEntries()
  }, [sortOrder])

  const handlePhotoUpload = async (e) => {
    e.preventDefault()
    if (!newDate || !newMessage || !newPhoto) {
      alert('Veuillez remplir tous les champs')
      return
    }

    setUploading(true)

    try {
      // Upload photo vers Supabase Storage
      const fileExt = newPhoto.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `photos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('omoidori-photos')
        .upload(filePath, newPhoto)

      if (uploadError) throw uploadError

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('omoidori-photos')
        .getPublicUrl(filePath)

      // Ajouter l'entrée à la base de données
      const { error: insertError } = await supabase
        .from('entries')
        .insert([
          {
            date: newDate,
            message: newMessage,
            photo_url: publicUrl,
            created_at: new Date().toISOString()
          }
        ])

      if (insertError) throw insertError

      alert('Photo ajoutée avec succès ! ✨')
      setNewDate('')
      setNewMessage('')
      setNewPhoto(null)
      document.getElementById('photoInput').value = ''
      loadEntries()
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error)
      alert('Erreur lors de l\'ajout de la photo: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const isDateUnlocked = (entryDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const entry = new Date(entryDate)
    entry.setHours(0, 0, 0, 0)
    return entry <= today
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement des souvenirs...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container">
        <div className="welcome-screen">
          <h1>🌋 Zouzou et Zaza</h1>
          <p className="subtitle">Calendrier de l'avent des potes</p>
          <p className="description">Des nouvelles photos tous les jours !</p>
          
          <div className="entries-grid">
            {entries.length === 0 ? (
              <div className="no-entries">
                <p>✨ Les premiers souvenirs arrivent bientôt...</p>
              </div>
            ) : (
              <>
                <div className="navigation-bar">
                  <div className="nav-info">
                    <span className="nav-count">{entries.length} souvenir{entries.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="nav-controls">
                    <button 
                      className={`nav-button ${sortOrder === 'desc' ? 'active' : ''}`}
                      onClick={() => setSortOrder('desc')}
                      title="Plus récents en premier"
                    >
                      📅 Récents
                    </button>
                    <button 
                      className={`nav-button ${sortOrder === 'asc' ? 'active' : ''}`}
                      onClick={() => setSortOrder('asc')}
                      title="Plus anciens en premier"
                    >
                      🕐 Anciens
                    </button>
                  </div>
                </div>
                {entries.map((entry, index) => {
                const unlocked = isDateUnlocked(entry.date)
                const rotation = (index % 3 - 1) * 2 // Slight rotation: -2deg, 0deg, 2deg
                return (
                  <div 
                    key={entry.id} 
                    className={`polaroid ${!unlocked ? 'locked' : ''}`}
                    style={{ transform: `rotate(${rotation}deg)` }}
                    onClick={() => unlocked && setExpandedEntry(entry)}
                  >
                    {unlocked ? (
                      <>
                        <div className="polaroid-photo">
                          <img src={entry.photo_url} alt="Photo du jour" loading="lazy" />
                        </div>
                        <div className="polaroid-caption">
                          <div className="polaroid-date">{formatDate(entry.date)}</div>
                          <div className="polaroid-message">
                            {entry.message.length > 60 ? `${entry.message.substring(0, 60)}...` : entry.message}
                          </div>
                          {entry.message.length > 60 && (
                            <div className="click-hint">👆 Cliquez pour lire la suite</div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="polaroid-photo locked-photo">
                          <div className="locked-content">
                            <span className="lock-icon">🔒</span>
                            <p>Disponible le<br/>{formatDate(entry.date)}</p>
                          </div>
                        </div>
                        <div className="polaroid-caption">
                          <div className="polaroid-message">À découvrir bientôt...</div>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
              </>
            )}
          </div>

          {expandedEntry && (
            <div className="modal-overlay" onClick={() => setExpandedEntry(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setExpandedEntry(null)}>✕</button>
                <div className="modal-photo">
                  <img src={expandedEntry.photo_url} alt="Photo" />
                </div>
                <div className="modal-text">
                  <div className="modal-date">{formatDate(expandedEntry.date)}</div>
                  <div className="modal-message">{expandedEntry.message}</div>
                </div>
              </div>
            </div>
          )}

          <button 
            className="admin-button"
            onClick={() => {
              const password = prompt('Mot de passe administrateur :')
              if (password === ADMIN_PASSWORD) {
                setIsAdmin(true)
              } else if (password) {
                alert('Mot de passe incorrect')
              }
            }}
          >
            Mode Admin
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="admin-panel">
        <h1>🔧 Panneau Administrateur - Omoidori</h1>
        <button className="logout-button" onClick={() => setIsAdmin(false)}>
          Retour au mode visiteur
        </button>

        <form className="upload-form" onSubmit={handlePhotoUpload}>
          <h2>Ajouter un nouveau souvenir</h2>
          
          <div className="form-group">
            <label htmlFor="dateInput">Date :</label>
            <input
              id="dateInput"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="messageInput">Message :</label>
            <textarea
              id="messageInput"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez votre message pour vos amis..."
              rows="4"
              required
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="photoInput">Photo :</label>
            <input
              id="photoInput"
              type="file"
              accept="image/*"
              onChange={(e) => setNewPhoto(e.target.files[0])}
              required
              disabled={uploading}
            />
            {newPhoto && (
              <p className="file-info">📷 {newPhoto.name} ({(newPhoto.size / 1024 / 1024).toFixed(2)} MB)</p>
            )}
          </div>

          <button type="submit" className="submit-button" disabled={uploading}>
            {uploading ? '⏳ Upload en cours...' : '✨ Ajouter la photo'}
          </button>
        </form>

        <div className="entries-list">
          <h2>Souvenirs ajoutés ({entries.length})</h2>
          {entries.length === 0 ? (
            <p className="no-entries-admin">Aucun souvenir pour le moment. Ajoutez-en un ci-dessus !</p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="entry-preview">
                <strong>{formatDate(entry.date)}</strong>
                <p>{entry.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
