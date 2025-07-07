import { useEffect, useRef } from 'react';
import './MatrixBackground.scss';

type MatrixChar = string;
type MatrixColumn = number;

type Matrix = {
  chars: MatrixChar[];
  fontSize: number;
  columns: MatrixColumn[];
};

// Diccionario de grupos de símbolos disponibles
const SYMBOL_GROUPS = {
  binary: "01",
  vikingRunes: "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ",
  greek: "αβγδεζηθικλμνξοπρστυφχψω",
  japanese: "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん",
  arrows: "↑↓←→↖↗↘↙",
  stars: "★☆✦✧✩✪✫✬✭✮✯✰",
  cards: "♠♣♥♦",
  chess: "♔♕♖♗♘♙♚♛♜♝♞♟",
  music: "♪♫♬♩♭♮♯"
} as const;

type SymbolGroup = keyof typeof SYMBOL_GROUPS;

interface MatrixBackgroundProps {
  symbolGroup?: SymbolGroup;
}

export const MatrixBackground = ({ symbolGroup = "binary" }: MatrixBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();

    const symbols = SYMBOL_GROUPS[symbolGroup];
    const matrix: Matrix = {
      chars: symbols.split(""),
      fontSize: 16,
      columns: Array(Math.floor(canvas.width / 16)).fill(0)
    };

    function drawMatrix() {
      if (!ctx || !canvas) return;
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#0F0";
      ctx.font = `${matrix.fontSize}px monospace`;
      
      matrix.columns.forEach((y, index) => {
        const text = matrix.chars[Math.floor(Math.random() * matrix.chars.length)];
        const x = index * matrix.fontSize + (Math.random() > 0.98 ? Math.random() * 10 - 5 : 0);
        ctx.fillText(text, x, y);
        
        if (y > canvas.height && Math.random() > 0.975) {
          matrix.columns[index] = 0;
        } else {
          matrix.columns[index] = y + matrix.fontSize;
        }
      });
    }

    const intervalId = setInterval(drawMatrix, 50);

    const handleResize = () => {
      if (!canvas) return;
      updateCanvasSize();
      matrix.columns = Array(Math.floor(canvas.width / matrix.fontSize)).fill(0);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, [symbolGroup]);

  return <canvas ref={canvasRef} className="matrix-background" />;
}; 