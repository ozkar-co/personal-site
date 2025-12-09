import { useState } from 'react';
import { toDozenalWithDecimals, fromDozenal } from '../../utils/ozkarTime';
import { dozenalWithFractionalToWords } from '../../utils/dozenalNaming';
import './Calc.scss';

// Tau constant (2π)
const TAU = 2 * Math.PI;

export const Calc = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  // Handle digit input
  const handleDigit = (digit: string) => {
    if (shouldResetDisplay) {
      setDisplay(digit);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  // Handle decimal point (koma)
  const handleDecimalPoint = () => {
    if (shouldResetDisplay) {
      setDisplay('0,');
      setShouldResetDisplay(false);
    } else if (!display.includes(',') && !display.includes('.')) {
      setDisplay(display + ',');
    }
  };

  // Clear display
  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  // Handle operations
  const handleOperation = (op: string) => {
    const currentDecimal = fromDozenal(display);
    
    if (previousValue !== null && operation !== null && !shouldResetDisplay) {
      // Execute pending operation
      const result = executeOperation(previousValue, currentDecimal, operation);
      setDisplay(toDozenalWithDecimals(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(currentDecimal);
    }
    
    setOperation(op);
    setShouldResetDisplay(true);
  };

  // Execute mathematical operation
  const executeOperation = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+': return prev + current;
      case '-': return prev - current;
      case '×': return prev * current;
      case '÷': 
        if (current === 0) {
          setDisplay('ERROR');
          setShouldResetDisplay(true);
          return 0;
        }
        return prev / current;
      case '^': return Math.pow(prev, current);
      default: return current;
    }
  };

  // Handle equals
  const handleEquals = () => {
    if (previousValue !== null && operation !== null) {
      const currentDecimal = fromDozenal(display);
      const result = executeOperation(previousValue, currentDecimal, operation);
      setDisplay(toDozenalWithDecimals(result));
      setPreviousValue(null);
      setOperation(null);
      setShouldResetDisplay(true);
    }
  };

  // Handle trigonometric operations (using tau/radians)
  const handleTrigOperation = (op: string) => {
    const currentDecimal = fromDozenal(display);
    let result: number;

    switch (op) {
      case 'sin':
        result = Math.sin(currentDecimal);
        break;
      case 'cos':
        result = Math.cos(currentDecimal);
        break;
      case 'tan':
        result = Math.tan(currentDecimal);
        break;
      case 'asin':
        if (currentDecimal < -1 || currentDecimal > 1) {
          setDisplay('ERROR');
          setShouldResetDisplay(true);
          return;
        }
        result = Math.asin(currentDecimal);
        break;
      case 'acos':
        if (currentDecimal < -1 || currentDecimal > 1) {
          setDisplay('ERROR');
          setShouldResetDisplay(true);
          return;
        }
        result = Math.acos(currentDecimal);
        break;
      case 'atan':
        result = Math.atan(currentDecimal);
        break;
      default:
        result = currentDecimal;
    }

    setDisplay(toDozenalWithDecimals(result));
    setShouldResetDisplay(true);
  };

  // Handle special functions
  const handleSpecialFunction = (func: string) => {
    const currentDecimal = fromDozenal(display);
    let result: number;

    switch (func) {
      case 'sqrt':
        result = Math.sqrt(currentDecimal);
        break;
      case 'square':
        result = currentDecimal * currentDecimal;
        break;
      case 'ln':
        result = Math.log(currentDecimal);
        break;
      case 'log':
        result = Math.log10(currentDecimal);
        break;
      case 'exp':
        result = Math.exp(currentDecimal);
        break;
      case 'tau':
        result = TAU;
        break;
      case '1/x':
        if (currentDecimal === 0) {
          setDisplay('ERROR');
          setShouldResetDisplay(true);
          return;
        }
        result = 1 / currentDecimal;
        break;
      case '+/-':
        result = -currentDecimal;
        break;
      default:
        result = currentDecimal;
    }

    setDisplay(toDozenalWithDecimals(result));
    setShouldResetDisplay(true);
  };

  // Get words representation
  const getWordsRepresentation = (): string => {
    try {
      // Use the new function that handles fractional parts
      return dozenalWithFractionalToWords(display);
    } catch {
      return '';
    }
  };

  return (
    <section className="calc">
      <div className="calc-container">
        <h1>Calculadora Dozenal</h1>

        <div className="calculator">
          <div className="calc-display-section">
            <div className="calc-display">
              <span className="display-value">{display}</span>
              {operation && <span className="operation-indicator">{operation}</span>}
            </div>
            <div className="calc-words">
              {getWordsRepresentation()}
            </div>
          </div>

          <div className="calc-buttons">
            {/* Scientific functions row 1 */}
            <div className="button-row">
              <button onClick={() => handleSpecialFunction('tau')} className="btn-function">τ</button>
              <button onClick={() => handleTrigOperation('sin')} className="btn-function">sin</button>
              <button onClick={() => handleTrigOperation('cos')} className="btn-function">cos</button>
              <button onClick={() => handleTrigOperation('tan')} className="btn-function">tan</button>
            </div>

            {/* Scientific functions row 2 */}
            <div className="button-row">
              <button onClick={() => handleSpecialFunction('sqrt')} className="btn-function">√</button>
              <button onClick={() => handleTrigOperation('asin')} className="btn-function">asin</button>
              <button onClick={() => handleTrigOperation('acos')} className="btn-function">acos</button>
              <button onClick={() => handleTrigOperation('atan')} className="btn-function">atan</button>
            </div>

            {/* Scientific functions row 3 */}
            <div className="button-row">
              <button 
                onClick={() => handleOperation('^')} 
                className={`btn-function ${operation === '^' && shouldResetDisplay ? 'active' : ''}`}
              >
                xʸ
              </button>
              <button onClick={() => handleSpecialFunction('square')} className="btn-function">x²</button>
              <button onClick={() => handleSpecialFunction('ln')} className="btn-function">ln</button>
              <button onClick={() => handleSpecialFunction('exp')} className="btn-function">eˣ</button>
            </div>

            {/* Main calculator grid */}
            <div className="button-row">
              <button onClick={handleClear} className="btn-clear">C</button>
              <button onClick={() => handleSpecialFunction('+/-')} className="btn-operation">+/-</button>
              <button onClick={() => handleSpecialFunction('1/x')} className="btn-operation">1/x</button>
              <button 
                onClick={() => handleOperation('÷')} 
                className={`btn-operation ${operation === '÷' && shouldResetDisplay ? 'active' : ''}`}
              >
                ÷
              </button>
            </div>

            <div className="button-row">
              <button onClick={() => handleDigit('7')} className="btn-digit">7</button>
              <button onClick={() => handleDigit('8')} className="btn-digit">8</button>
              <button onClick={() => handleDigit('9')} className="btn-digit">9</button>
              <button 
                onClick={() => handleOperation('×')} 
                className={`btn-operation ${operation === '×' && shouldResetDisplay ? 'active' : ''}`}
              >
                ×
              </button>
            </div>

            <div className="button-row">
              <button onClick={() => handleDigit('4')} className="btn-digit">4</button>
              <button onClick={() => handleDigit('5')} className="btn-digit">5</button>
              <button onClick={() => handleDigit('6')} className="btn-digit">6</button>
              <button 
                onClick={() => handleOperation('-')} 
                className={`btn-operation ${operation === '-' && shouldResetDisplay ? 'active' : ''}`}
              >
                -
              </button>
            </div>

            <div className="button-row">
              <button onClick={() => handleDigit('1')} className="btn-digit">1</button>
              <button onClick={() => handleDigit('2')} className="btn-digit">2</button>
              <button onClick={() => handleDigit('3')} className="btn-digit">3</button>
              <button 
                onClick={() => handleOperation('+')} 
                className={`btn-operation ${operation === '+' && shouldResetDisplay ? 'active' : ''}`}
              >
                +
              </button>
            </div>

            <div className="button-row">
              <button onClick={() => handleDigit('0')} className="btn-digit">0</button>
              <button onClick={() => handleDigit('X')} className="btn-digit">X</button>
              <button onClick={() => handleDigit('W')} className="btn-digit">W</button>
              <button onClick={handleEquals} className="btn-equals">=</button>
            </div>

            <div className="button-row">
              <button onClick={handleDecimalPoint} className="btn-digit btn-wide">,</button>
            </div>
          </div>
        </div>

        {/* Explanation section */}
        <div className="calc-explanation">
          <h3>¿Cómo funciona?</h3>
          <div className="explanation-grid">
            <div className="explanation-item">
              <strong>Sistema Numérico Dozenal (Base-12):</strong> Usa 12 dígitos: 0-9, X (diez), W (once). 
              Potencias: 12¹=zen, 12²=grod, 12³=mil. Ventajas: 12 tiene más divisores que 10 (1,2,3,4,6,12 vs 1,2,5,10), 
              facilitando calculos mentales..
            </div>
            
            <div className="explanation-item">
              <strong>Nombres de Dígitos:</strong> 0=zero, 1=un, 2=du, 3=tri, 4=quar, 5=kin, 6=ses, 7=sep, 8=ok, 
              9=non, X=dek, W=elv. Ejemplos: 10₁₂=zen, 11₁₂=zen un, 20₁₂=duzen, 100₁₂=un grod, 1000₁₂=un mil.
            </div>
            
            <div className="explanation-item">
              <strong>Sistema Fraccionario (Koma):</strong> Usamos la coma (,) como separador fraccionario. 
              La parte fraccionaria se agrupa de a dos dígitos y cada pareja se lee como un número independiente. 
              Ejemplos: 5,3 → "kin koma tri", 5,46 → "kin koma quarzen ses", W,81 → "elv koma okzen un".
            </div>
            
            <div className="explanation-item">
              <strong>Lectura Fraccionaria:</strong> Si una pareja lleva cero debe explicitarse (8,06 → "ok koma zero ses"). 
              Si el último dígito no forma pareja, se nombra solo. Variante alternativa: también existe leer dígito por dígito.
            </div>
            
            <div className="explanation-item">
              <strong>Tau (τ) en lugar de Pi (π):</strong> τ = 2π ≈ 6.283185. Razones: Circunferencia = τ × radio 
              (vs C = 2πr), un círculo = τ radianes (vs 2π), más intuitivo para ángulos. Esta calculadora usa radianes 
              basados en τ: τ/4 = cuarto de vuelta, τ/2 = media vuelta.
            </div>
            
            <div className="explanation-item">
              <strong>Conversiones útiles:</strong> 360° = τ radianes, 180° = τ/2 radianes, 90° = τ/4 radianes, 
              60° = τ/6 radianes. Ventaja pedagógica: elimina el factor "2" que aparece constantemente con π, 
              haciendo las fórmulas trigonométricas más naturales.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
