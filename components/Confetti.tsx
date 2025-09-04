
import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  style: React.CSSProperties;
}

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }).map((_, index) => {
      const colors = ['#fde047', '#2dd4bf', '#a78bfa']; // yellow, teal, purple
      const x = Math.random() * 100;
      const y = -10 - Math.random() * 20;
      const rotation = Math.random() * 360;
      const size = 5 + Math.random() * 10;
      const fallDuration = 2 + Math.random() * 3;
      const color = colors[Math.floor(Math.random() * colors.length)];

      return {
        id: index,
        style: {
          left: `${x}vw`,
          top: `${y}vh`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          transform: `rotate(${rotation}deg)`,
          transition: `top ${fallDuration}s ease-in, opacity 1s 1s`,
          position: 'fixed',
          zIndex: '9999',
        },
      };
    });

    setPieces(newPieces);

    const timer = setTimeout(() => {
      setPieces(currentPieces =>
        currentPieces.map(p => ({
          ...p,
          style: {
            ...p.style,
            top: '120vh',
            opacity: 0,
          },
        }))
      );
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="overflow-hidden pointer-events-none">
      {pieces.map(piece => (
        <div key={piece.id} style={piece.style} />
      ))}
    </div>
  );
};

export default Confetti;
