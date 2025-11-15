import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import FloatingStickers from "./FloatingStickers";
import "./App.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");

  const [newDate, setNewDate] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("date", { ascending: sortOrder === "asc" });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [sortOrder]);

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!newDate || !newMessage || !newPhoto) {
      alert("⚠️ Yo ! Remplis tous les champs ! ⚠️");
      return;
    }

    setUploading(true);

    try {
      const fileExt = newPhoto.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("omoidori-photos")
        .upload(filePath, newPhoto);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("omoidori-photos").getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("entries").insert([
        {
          date: newDate,
          message: newMessage,
          photo_url: publicUrl,
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;

      alert("✨🎉 PHOTO AJOUTÉE ! TROP BIEN ! 🎉✨");
      setNewDate("");
      setNewMessage("");
      setNewPhoto(null);
      document.getElementById("photoInput").value = "";
      loadEntries();
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      alert("💥 OUPS ! Erreur: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const isDateUnlocked = (entryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const entry = new Date(entryDate);
    entry.setHours(0, 0, 0, 0);
    return entry <= today;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <FloatingStickers />
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>⏳ CHARGEMENT EN COURS... ⏳</p>
            <p style={{ fontSize: "1rem", marginTop: "10px" }}>
              🌟 Patientez, c'est bientôt fini ! 🌟
            </p>
          </div>
        </div>
      </>
    );
  }

  if (showUploadForm) {
    return (
      <>
        <FloatingStickers />
        <div className="top-bar">
          <div className="top-bar-title">🌋 ZOUZOU & ZAZA - UPLOAD MODE 🎨</div>
          <div className="top-bar-buttons">
            <div className="top-bar-button">_</div>
            <div className="top-bar-button">□</div>
            <div
              className="top-bar-button"
              onClick={() => setShowUploadForm(false)}
            >
              ×
            </div>
          </div>
        </div>

        <div className="container">
          <div className="welcome-screen">
            <h1>📸 UPLOAD ZONE 📸</h1>
            <p className="subtitle">✨ AJOUTE TES SOUVENIRS ICI ✨</p>
          </div>

          <div className="marquee-container">
            <div className="marquee">
              <span>🌋 ZOUZOU ET ZAZA 🌋</span>
              <span>🎨 CALENDRIER DES POTES 🎨</span>
              <span>📸 PARTAGEZ VOS PHOTOS 📸</span>
              <span>✨ C'EST PARTI ! ✨</span>
              <span>🌋 ZOUZOU ET ZAZA 🌋</span>
              <span>🎨 CALENDRIER DES POTES 🎨</span>
            </div>
          </div>

          <button
            className="y2k-button"
            onClick={() => setShowUploadForm(false)}
          >
            ⬅️ RETOUR AUX SOUVENIRS
          </button>

          <form className="upload-form" onSubmit={handlePhotoUpload}>
            <h2>📝 NOUVEAU SOUVENIR 📝</h2>

            <div className="form-group">
              <label htmlFor="dateInput">📅 DATE :</label>
              <input
                id="dateInput"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
                disabled={uploading}
                placeholder="Clique pour choisir une date"
                style={{ cursor: "pointer" }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="messageInput">💬 MESSAGE :</label>
              <textarea
                id="messageInput"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écris un message pour Zouzou et Zaza... 💝"
                rows="5"
                required
                disabled={uploading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="photoInput">📷 PHOTO :</label>
              <input
                id="photoInput"
                type="file"
                accept="image/*"
                onChange={(e) => setNewPhoto(e.target.files[0])}
                required
                disabled={uploading}
              />
              {newPhoto && (
                <div
                  style={{
                    color: "#00ff00",
                    marginTop: "10px",
                    fontWeight: "bold",
                  }}
                >
                  ✅ {newPhoto.name} ({(newPhoto.size / 1024 / 1024).toFixed(2)}{" "}
                  MB)
                </div>
              )}
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={uploading}
            >
              {uploading ? "⏳ UPLOAD EN COURS..." : "🚀 ENVOYER LA PHOTO ! 🚀"}
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <FloatingStickers />

      <div className="top-bar">
        <div className="top-bar-title">
          🌋 ZOUZOU & ZAZA - CALENDRIER DES POTES 🎨
        </div>
        <div className="top-bar-buttons">
          <div className="top-bar-button">_</div>
          <div className="top-bar-button">□</div>
          <div className="top-bar-button">×</div>
        </div>
      </div>

      <div className="container">
        <div className="welcome-screen">
          <h1>🌋 ZOUZOU & ZAZA 🌋</h1>
          <p className="subtitle">✨ CALENDRIER DE L'AVENT DES POTES ✨</p>

          <div className="marquee-container">
            <div className="marquee">
              <span>🔥 NOUVELLE PHOTO CHAQUE JOUR 🔥</span>
              <span>💝 LOIN MAIS PAS OUBLIÉS 💝</span>
              <span>📸 DES SOUVENIRS À DÉBLOQUER 📸</span>
              <span>✨ C'EST PARTI ! ✨</span>
              <span>🔥 NOUVELLE PHOTO CHAQUE JOUR 🔥</span>
              <span>💝 LOIN MAIS PAS OUBLIÉS 💝</span>
            </div>
          </div>

          <p className="description">
            🌴 Parce que vous êtes loin mais pas oubliés ! 🌴
            <br />
            Une petite dose quotidienne de chez nous pour réchauffer vos cœurs !
            💖
          </p>

          <button
            className="y2k-button"
            onClick={() => setShowUploadForm(true)}
          >
            ➕ AJOUTER UN SOUVENIR
          </button>
        </div>

        <div className="entries-grid">
          {entries.length === 0 ? (
            <div
              className="no-entries"
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "60px 20px",
                background: "rgba(0, 0, 0, 0.7)",
                border: "5px dashed #ff00ff",
                color: "#00ff00",
                fontSize: "1.5rem",
                fontWeight: "bold",
                textShadow: "0 0 10px #00ff00",
              }}
            >
              ✨ LES PREMIERS SOUVENIRS ARRIVENT BIENTÔT... ✨
            </div>
          ) : (
            <>
              <div className="navigation-bar">
                <div className="nav-count">
                  📊 {entries.length} SOUVENIR{entries.length > 1 ? "S" : ""}
                </div>
                <div
                  className="nav-controls"
                  style={{ display: "flex", gap: "10px" }}
                >
                  <button
                    className={`nav-button ${
                      sortOrder === "desc" ? "active" : ""
                    }`}
                    onClick={() => setSortOrder("desc")}
                  >
                    ⏬ RÉCENTS
                  </button>
                  <button
                    className={`nav-button ${
                      sortOrder === "asc" ? "active" : ""
                    }`}
                    onClick={() => setSortOrder("asc")}
                  >
                    ⏫ ANCIENS
                  </button>
                </div>
              </div>

              {entries.map((entry) => {
                const unlocked = isDateUnlocked(entry.date);
                return (
                  <div
                    key={entry.id}
                    className={`polaroid ${!unlocked ? "locked" : ""}`}
                    onClick={() => unlocked && setExpandedEntry(entry)}
                  >
                    <div className="polaroid-inner">
                      {unlocked ? (
                        <>
                          <div className="polaroid-photo">
                            <img
                              src={entry.photo_url}
                              alt="Photo du jour"
                              loading="lazy"
                            />
                          </div>
                          <div className="polaroid-caption">
                            <div className="polaroid-date">
                              📅 {formatDate(entry.date).toUpperCase()}
                            </div>
                            <div className="polaroid-message">
                              {entry.message.length > 60
                                ? `${entry.message.substring(0, 60)}...`
                                : entry.message}
                            </div>
                            {entry.message.length > 60 && (
                              <div className="click-hint">
                                👆 CLIQUE POUR LIRE ! 👆
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="polaroid-photo locked-photo">
                            <div className="locked-content">
                              <span className="lock-icon">🔒</span>
                              <p
                                style={{ color: "#ffff00", fontWeight: "bold" }}
                              >
                                DISPONIBLE LE
                                <br />
                                {formatDate(entry.date).toUpperCase()}
                              </p>
                            </div>
                          </div>
                          <div className="polaroid-caption">
                            <div
                              className="polaroid-message"
                              style={{ color: "#ff00ff" }}
                            >
                              ⏳ À DÉCOUVRIR BIENTÔT... ⏳
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {expandedEntry && (
          <div className="modal-overlay" onClick={() => setExpandedEntry(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  📸 {formatDate(expandedEntry.date).toUpperCase()}
                </div>
                <button
                  className="modal-close"
                  onClick={() => setExpandedEntry(null)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-photo">
                  <img src={expandedEntry.photo_url} alt="Photo" />
                </div>
                <div className="modal-date">
                  📅 {formatDate(expandedEntry.date).toUpperCase()}
                </div>
                <div className="modal-message">{expandedEntry.message}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
