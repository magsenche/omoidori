import { useEffect, useState } from "react";

export function Confetti() {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const colors = ["#ff00ff", "#00ffff", "#ffff00", "#ff0000", "#00ff00"];
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
    }));
    setConfetti(pieces);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {confetti.map((piece) => (
        <div
          key={piece.id}
          style={{
            position: "absolute",
            top: "-10px",
            left: `${piece.left}%`,
            width: "10px",
            height: "10px",
            background: piece.color,
            animation: `fall ${piece.duration}s linear infinite`,
            animationDelay: `${piece.delay}s`,
            borderRadius: "50%",
            boxShadow: `0 0 10px ${piece.color}`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { 
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) rotate(720deg);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

export function VisitorCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("visitorCount");
    const initial = stored
      ? parseInt(stored)
      : Math.floor(Math.random() * 10000);
    setCount(initial);

    const newCount = initial + 1;
    localStorage.setItem("visitorCount", newCount.toString());
    setCount(newCount);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#000",
        border: "3px solid #00ff00",
        padding: "15px",
        color: "#00ff00",
        fontFamily: "Courier New, monospace",
        fontSize: "1.2rem",
        fontWeight: "bold",
        boxShadow: "0 0 20px rgba(0, 255, 0, 0.5)",
        zIndex: 9999,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "0.8rem", marginBottom: "5px" }}>
        👁️ VISITEURS 👁️
      </div>
      <div
        style={{
          display: "flex",
          gap: "5px",
          justifyContent: "center",
        }}
      >
        {count
          .toString()
          .split("")
          .map((digit, i) => (
            <div
              key={i}
              style={{
                background: "#001100",
                padding: "5px 10px",
                border: "2px solid #00ff00",
                textShadow: "0 0 10px #00ff00",
              }}
            >
              {digit}
            </div>
          ))}
      </div>
    </div>
  );
}

export function UnderConstruction({ show = false }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#ffff00",
        border: "5px solid #000",
        padding: "30px",
        textAlign: "center",
        zIndex: 10000,
        boxShadow: "0 0 50px rgba(255, 255, 0, 0.8)",
        animation: "shake 0.5s infinite",
      }}
    >
      <div
        style={{
          fontSize: "3rem",
          marginBottom: "20px",
          animation: "spin 2s linear infinite",
        }}
      >
        🚧
      </div>
      <div
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#000",
          fontFamily: "Impact, Arial Black, sans-serif",
          textShadow: "2px 2px 0 #fff",
        }}
      >
        UNDER CONSTRUCTION
      </div>
      <div
        style={{
          fontSize: "1.2rem",
          marginTop: "10px",
          animation: "blink 1s infinite",
        }}
      >
        🔨 SITE EN TRAVAUX 🔨
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(-50%, -50%); }
          25% { transform: translate(-52%, -50%); }
          75% { transform: translate(-48%, -50%); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function LoadingBar({ progress = 0 }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        maxWidth: "500px",
        background: "#c0c0c0",
        border: "3px solid #000",
        padding: "3px",
        zIndex: 10001,
      }}
    >
      <div
        style={{
          height: "30px",
          background: `linear-gradient(90deg, 
          #0080ff 0%, 
          #0080ff ${progress}%, 
          #fff ${progress}%, 
          #fff 100%)`,
          border: "2px solid #808080",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: progress > 50 ? "#fff" : "#000",
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            fontSize: "0.9rem",
            textShadow: "1px 1px 0 rgba(0,0,0,0.3)",
            mixBlendMode: "difference",
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}

export function HitCounter() {
  return (
    <div
      style={{
        display: "inline-block",
        background: "#000",
        border: "2px solid #ff00ff",
        padding: "8px 15px",
        marginTop: "20px",
        boxShadow: "0 0 15px rgba(255, 0, 255, 0.6)",
      }}
    >
      <span
        style={{
          color: "#ff00ff",
          fontFamily: "Courier New, monospace",
          fontSize: "0.9rem",
          textShadow: "0 0 5px #ff00ff",
          letterSpacing: "3px",
        }}
      >
        ⭐ SITE VIEWS:{" "}
        {Math.floor(Math.random() * 99999)
          .toString()
          .padStart(5, "0")}{" "}
        ⭐
      </span>
    </div>
  );
}

export function BestViewedWith() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        background: "#fff",
        border: "2px solid #000",
        padding: "10px",
        fontSize: "0.8rem",
        fontFamily: "Arial, sans-serif",
        boxShadow: "3px 3px 0 rgba(0, 0, 0, 0.3)",
        zIndex: 9999,
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
        BEST VIEWED WITH:
      </div>
      <div>🌐 Netscape Navigator 4.0</div>
      <div>💻 800x600 resolution</div>
      <div>🔊 Sound enabled</div>
    </div>
  );
}

export function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#000",
        border: "3px solid #00ffff",
        padding: "15px 20px",
        fontFamily: "Courier New, monospace",
        fontSize: "2rem",
        color: "#00ffff",
        textShadow: "0 0 20px #00ffff",
        boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)",
        zIndex: 9999,
        letterSpacing: "5px",
      }}
    >
      {hours}:{minutes}:{seconds}
    </div>
  );
}

export function BlinkText({ children, color = "#ff00ff" }) {
  return (
    <span
      style={{
        color,
        fontWeight: "bold",
        animation: "blink 1s infinite",
        textShadow: `0 0 10px ${color}`,
      }}
    >
      {children}
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}

export function StarField() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 5,
    }));
    setStars(newStars);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: "#fff",
            borderRadius: "50%",
            boxShadow: `0 0 ${star.size * 2}px #fff`,
            animation: `twinkle ${star.duration}s infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function WebRing() {
  return (
    <div
      style={{
        textAlign: "center",
        margin: "40px 0",
        padding: "20px",
        background: "linear-gradient(135deg, #000 0%, #1a0033 100%)",
        border: "3px solid #ff00ff",
        boxShadow: "0 0 20px rgba(255, 0, 255, 0.5)",
      }}
    >
      <div
        style={{
          color: "#00ffff",
          fontSize: "1.2rem",
          fontWeight: "bold",
          marginBottom: "15px",
          textShadow: "0 0 10px #00ffff",
        }}
      >
        💍 ZOUZOU & ZAZA WEBRING 💍
      </div>
      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          style={{
            background: "#ff00ff",
            color: "#fff",
            border: "2px solid #fff",
            padding: "10px 20px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 0 10px #ff00ff",
          }}
        >
          ⬅️ PREVIOUS
        </button>
        <button
          style={{
            background: "#00ffff",
            color: "#000",
            border: "2px solid #fff",
            padding: "10px 20px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 0 10px #00ffff",
          }}
        >
          🏠 HOME
        </button>
        <button
          style={{
            background: "#ffff00",
            color: "#000",
            border: "2px solid #fff",
            padding: "10px 20px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 0 10px #ffff00",
          }}
        >
          NEXT ➡️
        </button>
      </div>
    </div>
  );
}

export default {
  Confetti,
  VisitorCounter,
  UnderConstruction,
  LoadingBar,
  HitCounter,
  BestViewedWith,
  DigitalClock,
  BlinkText,
  StarField,
  WebRing,
};
