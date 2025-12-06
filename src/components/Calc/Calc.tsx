import { useState } from 'react';
import { toDozenal, fromDozenal } from '../../utils/ozkarTime';
import { dozenalToWords } from '../../utils/dozenalNaming';
import './Calc.scss';

// Tau constant (2π)
const TAU = 2 * Math.PI;

export const Calc = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  // Función para convertir símbolos dozenales a formato 7-segmentos
  const toSegment7 = (dozenalString: string): string => {
    return dozenalString.replace(/X/g, 'H').replace(/W/g, 'E');
  };

  // Handle digit input
  const handleDigit = (digit: string) => {
    if (shouldResetDisplay) {
      setDisplay(digit);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  // Handle decimal point
  const handleDecimalPoint = () => {
    if (shouldResetDisplay) {
      setDisplay('0.');
      setShouldResetDisplay(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
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
      setDisplay(toDozenal(result));
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
      case '÷': return current !== 0 ? prev / current : 0;
      case '^': return Math.pow(prev, current);
      default: return current;
    }
  };

  // Handle equals
  const handleEquals = () => {
    if (previousValue !== null && operation !== null) {
      const currentDecimal = fromDozenal(display);
      const result = executeOperation(previousValue, currentDecimal, operation);
      setDisplay(toDozenal(result));
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
        result = Math.asin(currentDecimal);
        break;
      case 'acos':
        result = Math.acos(currentDecimal);
        break;
      case 'atan':
        result = Math.atan(currentDecimal);
        break;
      default:
        result = currentDecimal;
    }

    setDisplay(toDozenal(result));
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
        result = currentDecimal !== 0 ? 1 / currentDecimal : 0;
        break;
      case '+/-':
        result = -currentDecimal;
        break;
      default:
        result = currentDecimal;
    }

    setDisplay(toDozenal(result));
    setShouldResetDisplay(true);
  };

  // Get words representation
  const getWordsRepresentation = (): string => {
    try {
      // Handle decimal points - only convert integer part for now
      const dozenalStr = display.split('.')[0];
      return dozenalToWords(dozenalStr);
    } catch {
      return '';
    }
  };

  return (
    <section className="calc">
      <div className="calc-container">
        <h1>Calculadora Dozenal</h1>
        <p className="calc-subtitle">Sistema Base-12 con operaciones matemáticas y trigonométricas</p>

        <div className="calculator">
          <div className="calc-display-section">
            <div className="calc-display">
              <span className="display-value">{toSegment7(display)}</span>
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
              <button onClick={() => handleOperation('^')} className="btn-function">xʸ</button>
              <button onClick={() => handleSpecialFunction('square')} className="btn-function">x²</button>
              <button onClick={() => handleSpecialFunction('ln')} className="btn-function">ln</button>
              <button onClick={() => handleSpecialFunction('exp')} className="btn-function">eˣ</button>
            </div>

            {/* Main calculator grid */}
            <div className="button-row">
              <button onClick={handleClear} className="btn-clear">C</button>
              <button onClick={() => handleSpecialFunction('+/-')} className="btn-operation">+/-</button>
              <button onClick={() => handleSpecialFunction('1/x')} className="btn-operation">1/x</button>
              <button onClick={() => handleOperation('÷')} className="btn-operation">÷</button>
            </div>

            <div className="button-row">
              <button onClick={() => handleDigit('7')} className="btn-digit">7</button>
              <button onClick={() => handleDigit('8')} className="btn-digit">8</button>
              <button onClick={() => handleDigit('9')} className="btn-digit">9</button>
              <button onClick={() => handleOperation('×')} className="btn-operation">×</button>
            </div>

            <div className="button-row">
              <button onClick={() => handleDigit('4')} className="btn-digit">4</button>
              <button onClick={() => handleDigit('5')} className="btn-digit">5</button>
              <button onClick={() => handleDigit('6')} className="btn-digit">6</button>
              <button onClick={() => handleOperation('-')} className="btn-operation">-</button>
            </div>

            <div className="button-row">
              <button onClick={() => handleDigit('1')} className="btn-digit">1</button>
              <button onClick={() => handleDigit('2')} className="btn-digit">2</button>
              <button onClick={() => handleDigit('3')} className="btn-digit">3</button>
              <button onClick={() => handleOperation('+')} className="btn-operation">+</button>
            </div>

            <div className="button-row">
              <button onClick={() => handleDigit('0')} className="btn-digit">0</button>
              <button onClick={() => handleDigit('X')} className="btn-digit">X</button>
              <button onClick={() => handleDigit('W')} className="btn-digit">W</button>
              <button onClick={handleEquals} className="btn-equals">=</button>
            </div>

            <div className="button-row">
              <button onClick={handleDecimalPoint} className="btn-digit btn-wide">.</button>
            </div>
          </div>
        </div>

        {/* Explanation sections */}
        <div className="calc-explanations">
          <div className="explanation-section">
            <h3>Sistema de Numeración Dozenal</h3>
            <div className="explanation-content">
              <h4>Dígitos</h4>
              <p>El sistema dozenal usa 12 dígitos: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, X (diez), W (once)</p>
              
              <h4>Potencias de 12</h4>
              <ul>
                <li><strong>12⁰ = 1</strong> - unidades</li>
                <li><strong>12¹ = 12 (10 dozenal)</strong> - zen</li>
                <li><strong>12² = 144 (100 dozenal)</strong> - grod</li>
                <li><strong>12³ = 1728 (1000 dozenal)</strong> - mil</li>
                <li><strong>12⁶</strong> - milion</li>
                <li><strong>12⁹</strong> - miliardo</li>
              </ul>

              <h4>Ventajas del Sistema Dozenal</h4>
              <ul>
                <li>12 tiene más divisores que 10 (1,2,3,4,6,12 vs 1,2,5,10)</li>
                <li>Facilita división por tercios y cuartos</li>
                <li>Mejor para medidas y cálculos cotidianos</li>
                <li>Históricamente usado en docenas, pies, pulgadas, horas</li>
              </ul>
            </div>
          </div>

          <div className="explanation-section">
            <h3>Reglas de Nomenclatura</h3>
            <div className="explanation-content">
              <h4>Nombres de Dígitos</h4>
              <p>0=zero, 1=un, 2=du, 3=tri, 4=quar, 5=kin, 6=ses, 7=sep, 8=ok, 9=non, X=dek, W=elv</p>

              <h4>Composición de Números</h4>
              <ul>
                <li><strong>0-W (0-11):</strong> Usar nombre del dígito directamente</li>
                <li><strong>10 (12 decimal):</strong> zen</li>
                <li><strong>11 (13 decimal):</strong> zen un</li>
                <li><strong>20 (24 decimal):</strong> duzen</li>
                <li><strong>100 (144 decimal):</strong> un grod</li>
                <li><strong>164 (232 decimal):</strong> un grod seszen quar</li>
                <li><strong>1000 (1728 decimal):</strong> un mil</li>
              </ul>

              <h4>Reglas de Espaciado</h4>
              <ul>
                <li>No usar guiones</li>
                <li>Separación por espacios entre bloques</li>
                <li>Para zen: un dígito + "zen" se une (ej: "duzen")</li>
                <li>Para magnitudes mayores: siempre separado (ej: "du grod")</li>
              </ul>
            </div>
          </div>

          <div className="explanation-section">
            <h3>¿Por qué Tau (τ) es mejor que Pi (π)?</h3>
            <div className="explanation-content">
              <h4>Tau = 2π ≈ 6.283185...</h4>
              
              <h4>Razones matemáticas:</h4>
              <ul>
                <li><strong>Circunferencia = τ × radio</strong> (más directo que C = 2πr)</li>
                <li><strong>Radianes completos:</strong> Un círculo = τ radianes (vs 2π)</li>
                <li><strong>Medio círculo = τ/2</strong> (vs π)</li>
                <li><strong>Cuarto de círculo = τ/4</strong> (vs π/2)</li>
              </ul>

              <h4>Ventajas pedagógicas:</h4>
              <ul>
                <li>Tau relaciona directamente circunferencia con radio (relación fundamental)</li>
                <li>Elimina el factor "2" que aparece constantemente con π</li>
                <li>Más intuitivo: 1 vuelta = τ radianes</li>
                <li>Fórmulas trigonométricas más naturales</li>
              </ul>

              <h4>Conversiones útiles:</h4>
              <ul>
                <li>360° = τ radianes</li>
                <li>180° = τ/2 radianes</li>
                <li>90° = τ/4 radianes</li>
                <li>60° = τ/6 radianes</li>
              </ul>

              <p className="tau-note">
                <strong>Nota:</strong> Esta calculadora usa radianes basados en τ. Los ángulos en radianes 
                se relacionan directamente con fracciones de círculo: τ/4 = cuarto de vuelta, τ/2 = media vuelta, etc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
