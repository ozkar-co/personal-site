import { useEffect, useRef } from 'react';
import './MatrixBackground.scss';

type MatrixChar = string;
type MatrixColumn = number;

type Matrix = {
  chars: MatrixChar[];
  fontSize: number;
  columns: MatrixColumn[];
};

export const MatrixBackground = () => {
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

    const matrix: Matrix = {
      chars: "01".split(""),
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

      if (Math.random() > 0.95) {
        ctx.fillStyle = `rgba(0, 255, 0, ${Math.random() * 0.3})`;
        ctx.fillRect(0, Math.random() * canvas.height, canvas.width, Math.random() * 5);
      }
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
  }, []);

  return <canvas ref={canvasRef} className="matrix-background" />;
}; 