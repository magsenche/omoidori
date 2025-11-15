import { useEffect, useState } from "react";
import "./FloatingStickers.css";

export default function FloatingStickers() {
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  const [stickers, setStickers] = useState([]);

  const stickerNames = [
    "amine",
    "arnaud",
    "arthur",
    "chiara",
    "emile",
    "faustine",
    "ghali",
    "greg",
    "ines",
    "loic",
    "lorenzo",
    "magsen",
    "martin",
    "martin2",
    "micka",
    "pat",
    "rudy",
    "theod",
    "vincent",
  ];

  const photoArray = stickerNames.map((name) => ({
    url: `/stickers/${name}.png`,
    name: name.charAt(0).toUpperCase() + name.slice(1),
  }));

  useEffect(() => {
    const generateStickers = () => {
      const shuffledPhotos = shuffleArray(photoArray);
      return shuffledPhotos.map((friend, index) => {
        const totalStickers = photoArray.length;
        const cols = Math.ceil(Math.sqrt(totalStickers));
        const row = Math.floor(index / cols);
        const col = index % cols;
        const zoneWidth = 100 / cols;
        const zoneHeight = 100 / Math.ceil(totalStickers / cols);

        return {
          id: index,
          url: friend.url,
          name: friend.name,
          style: {
            top: `${row * zoneHeight + Math.random() * zoneHeight * 0.8}%`,
            left: `${col * zoneWidth + Math.random() * zoneWidth * 0.8}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 8}s`,
          },
        };
      });
    };
    setStickers(generateStickers());

    const interval = setInterval(() => {
      setStickers(generateStickers());
    }, 5000);

    return () => clearInterval(interval);
  }, [photoArray.length]);

  return (
    <div className="floating-stickers">
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          className="sticker sticker-photo"
          style={sticker.style}
          title={sticker.name}
        >
          <img src={sticker.url} alt={sticker.name} className="sticker-img" />
        </div>
      ))}
    </div>
  );
}
