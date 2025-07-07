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
  math: "∑∏∫∂√∞≠≈≤≥±×÷",
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
  const matrixRef = useRef<Matrix | null>(null);
  const intervalIdRef = useRef<number | null>(null);

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

    // Solo inicializar las columnas si no existen
    if (!matrixRef.current) {
      const symbols = SYMBOL_GROUPS[symbolGroup];
      matrixRef.current = {
        chars: symbols.split(""),
        fontSize: 16,
        columns: Array(Math.floor(canvas.width / 16)).fill(0)
      };
    } else {
      // Solo actualizar los caracteres, mantener las posiciones de las columnas
      const symbols = SYMBOL_GROUPS[symbolGroup];
      matrixRef.current.chars = symbols.split("");
    }

    function drawMatrix() {
      if (!ctx || !canvas || !matrixRef.current) return;
      
      const matrix = matrixRef.current;
      
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

    // Solo crear el intervalo si no existe
    if (!intervalIdRef.current) {
      intervalIdRef.current = setInterval(drawMatrix, 50);
    }

    const handleResize = () => {
      if (!canvas || !matrixRef.current) return;
      updateCanvasSize();
      // Reinicializar columnas solo en resize
      matrixRef.current.columns = Array(Math.floor(canvas.width / matrixRef.current.fontSize)).fill(0);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [symbolGroup]);

  // Cleanup del intervalo solo cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-background" />;
}; 