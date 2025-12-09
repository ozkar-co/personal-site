import { useState, useEffect } from 'react';
import { 
  getOzkarClock, 
  getOzkarCalendar, 
  getDayProgress, 
  getLunatoProgress,
  getLunatoForSol,
  countLunatosInSol,
  formatDozenal,
  OzkarClockTime, 
  OzkarCalendarDate,
  LunatoCalendarInfo,
  LUNAR_PHASES,
  ZODIAC_CONSTELLATIONS
} from '../../utils/ozkarTime';
import { dozenalToWords, readFractionalPart } from '../../utils/dozenalNaming';
import './OzkarTime.scss';

export const OzkarTime = () => {
  // Función helper para convertir porcentaje decimal a dozenal
  // 100% decimal = 100 dozenal (que es 144 decimal)
  const percentageToDozenal = (decimalPercentage: number): string => {
    // Convertir de escala 0-100 decimal a 0-144 decimal
    const dozenalValue = (decimalPercentage / 100) * 144;
    // Formatear en dozenal
    return formatDozenal(Math.round(dozenalValue));
  };

  // Función helper para obtener la descripción en palabras de la hora
  const getClockDescription = (clock: OzkarClockTime): string => {
    // Convertir horo a palabras
    const horoWords = dozenalToWords(formatDozenal(clock.horo));
    // Leer temo y mino como parte fraccionaria (agrupada en pareja)
    const temoMinoFractional = `${formatDozenal(clock.temo)}${formatDozenal(clock.mino)}`;
    const fractionalWords = readFractionalPart(temoMinoFractional);
    
    return `Es ${horoWords} koma ${fractionalWords} horo`;
  };

  // Función helper para obtener la descripción del jorno
  const getJornoDescription = (calendar: OzkarCalendarDate, clock: OzkarClockTime): string => {
    const period = clock.period;
    const jornoWords = dozenalToWords(formatDozenal(calendar.jorno));
    
    return `${period} di la jorno ${calendar.jorno} (${jornoWords})`;
  };

  // Estado para OzkarTime
  const [ozkarClock, setOzkarClock] = useState<OzkarClockTime>({
    horo: 0,
    temo: 0,
    mino: 0,
    tiko: 0,
    formatted: '0.00',
    formattedFull: '0.00.0',
    period: 'matino',
    periodHoro: 0
  });

  const [ozkarCalendar, setOzkarCalendar] = useState<OzkarCalendarDate>({
    sol: 0,
    solDozenal: '0',
    lunato: 1,
    jorno: 1,
    lunatoStartDate: new Date(),
    lunarPhase: LUNAR_PHASES[0],
    constellation: ZODIAC_CONSTELLATIONS[0], // Capricornio por defecto
    formatted: 'Sol z0 · Lunato 1 · Jorno 1'
  });

  const [dayProgress, setDayProgress] = useState(0);
  const [lunatoProgress, setLunatoProgress] = useState(0);
  const [currentLunato, setCurrentLunato] = useState<LunatoCalendarInfo | null>(null);
  
  // Navegación independiente de Sol y Lunato
  const [solOffset, setSolOffset] = useState(0);      // Offset del Sol desde el actual
  const [lunatoNumber, setLunatoNumber] = useState(0); // Número del lunato (0-12 o 0-13)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Actualizar OzkarTime
      const clock = getOzkarClock(now);
      const calendar = getOzkarCalendar(now);
      setOzkarClock(clock);
      setOzkarCalendar(calendar);
      setDayProgress(getDayProgress(now));
      setLunatoProgress(getLunatoProgress(calendar));
      
      // Calcular el Sol absoluto (Sol actual + offset)
      const targetSol = calendar.sol + solOffset;
      
      // Obtener calendario del lunato usando el nuevo sistema
      try {
        const lunatoInfo = getLunatoForSol(targetSol, lunatoNumber);
        setCurrentLunato(lunatoInfo);
      } catch (error) {
        console.error('Error al obtener lunato:', error);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [solOffset, lunatoNumber]);

  // Funciones de navegación de lunatos
  const goToPreviousLunato = () => {
    if (lunatoNumber === 0) {
      // Estamos en Lunato 0, ir al último lunato del Sol anterior
      setSolOffset(prev => prev - 1);
      // Necesitamos calcular cuántos lunatos tiene el Sol anterior
      const prevSol = ozkarCalendar.sol + solOffset - 1;
      const lunatosInPrevSol = countLunatosInSol(prevSol);
      setLunatoNumber(lunatosInPrevSol - 1); // Último lunato (índice base 0)
    } else {
      setLunatoNumber(prev => prev - 1);
    }
  };

  const goToNextLunato = () => {
    const currentSol = ozkarCalendar.sol + solOffset;
    const totalLunatos = countLunatosInSol(currentSol);
    
    if (lunatoNumber >= totalLunatos - 1) {
      // Estamos en el último lunato, ir al Lunato 0 del siguiente Sol
      setSolOffset(prev => prev + 1);
      setLunatoNumber(0);
    } else {
      setLunatoNumber(prev => prev + 1);
    }
  };

  // Funciones de navegación de Soles (salto de ±1 Sol, mismo lunato)
  const goToPreviousSol = () => {
    setSolOffset(prev => prev - 1);
    // Verificar si el Sol anterior tiene este número de lunato
    const prevSol = ozkarCalendar.sol + solOffset - 1;
    const lunatosInPrevSol = countLunatosInSol(prevSol);
    // Si el lunato actual no existe en el Sol anterior (ej: lunato 13 → Sol con 12 lunatos)
    if (lunatoNumber >= lunatosInPrevSol) {
      setLunatoNumber(lunatosInPrevSol - 1); // Ir al último lunato disponible
    }
  };

  const goToNextSol = () => {
    setSolOffset(prev => prev + 1);
    // Verificar si el Sol siguiente tiene este número de lunato
    const nextSol = ozkarCalendar.sol + solOffset + 1;
    const lunatosInNextSol = countLunatosInSol(nextSol);
    if (lunatoNumber >= lunatosInNextSol) {
      setLunatoNumber(lunatosInNextSol - 1);
    }
  };

  const goToCurrentLunato = () => {
    setSolOffset(0);
    setLunatoNumber(ozkarCalendar.lunato);
  };

  // Función auxiliar para renderizar las celdas del calendario
  const renderCalendarPhases = (lunato: LunatoCalendarInfo) => {
    return Object.entries(lunato.phases).map(([phaseName, phaseDays]) => (
      phaseDays.length > 0 && (
        <div key={phaseName} className="phase-row">
          <div className="phase-label">{phaseDays[0].lunarPhase}</div>
          <div className="phase-days">
            {phaseDays.map((day) => {
              const classes = [
                'day-cell',
                day.isToday ? 'today' : '',
                day.isSolstice ? 'solstice' : '',
                !day.belongsToCurrentSol ? 'other-sol' : ''
              ].filter(Boolean).join(' ');
              
              return (
                <div 
                  key={day.jorno} 
                  className={classes}
                >
                  <span className="jorno-number">{day.jornoDozenal}</span>
                  {day.isSolstice && <span className="solstice-marker">❄</span>}
                  <span className="civil-date">
                    <span className="weekday">
                      {day.civilDate.toLocaleDateString('es-ES', { weekday: 'short' })}
                    </span>
                    <span className="date">
                      {day.civilDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="year">
                      {day.civilDate.getFullYear()}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )
    ));
  };

  return (
    <section className="ozkar-time">
      <div className="ozkar-time-container">
        <h1>Clock</h1>
        <p className="ozkar-subtitle"></p>

        <div className="ozkar-time-grid">
          {/* Reloj Dozenal */}
          <div className="ozkar-clock">
            <h2>Reloj Base 12</h2>
            <div className="clock-display">
              <span className="clock-time">{ozkarClock.formatted}</span>
              <span className="clock-description">{getClockDescription(ozkarClock)}</span>
            </div>
            <div className="clock-breakdown">
              <div className="time-part">
                <span className="value">{formatDozenal(ozkarClock.horo)}</span>
                <span className="unit">horo</span>
              </div>
              <div className="time-part">
                <span className="value">{formatDozenal(ozkarClock.temo)}</span>
                <span className="unit">temo</span>
              </div>
              <div className="time-part">
                <span className="value">{formatDozenal(ozkarClock.mino)}</span>
                <span className="unit">mino</span>
              </div>
              <div className="time-part">
                <span className="value">{formatDozenal(ozkarClock.tiko)}</span>
                <span className="unit">tiko</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-markers">
                <div className="marker" style={{ left: '50%' }}></div>
              </div>
              <div 
                className="progress-fill" 
                style={{ width: `${dayProgress}%` }}
              />
            </div>
            <span className="progress-label">Progreso del jorno: {percentageToDozenal(dayProgress)}%</span>
          </div>

          {/* Calendario Solar */}
          <div className="ozkar-calendar">
            <h2>Calendario Luni-Solar</h2>
            <div className="calendar-display">
              <span className="calendar-sol">Sol {ozkarCalendar.solDozenal}</span>
              <span className="calendar-lunato">
                Lunato {ozkarCalendar.lunato} {ozkarCalendar.constellation.name}
                <img 
                  src={`/assets/constellations/${ozkarCalendar.constellation.image}`}
                  alt={ozkarCalendar.constellation.name}
                  className="constellation-icon"
                />
              </span>
              <span className="calendar-jorno">{getJornoDescription(ozkarCalendar, ozkarClock)}</span>
            </div>
            <div className="calendar-details">
              <div className="detail-item">
                <span className="detail-label">Fase</span>
                <span className="detail-value">{ozkarCalendar.lunarPhase}</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-markers">
                <div className="marker" style={{ left: '25%' }}></div>
                <div className="marker" style={{ left: '50%' }}></div>
                <div className="marker" style={{ left: '75%' }}></div>
              </div>
              <div 
                className="progress-fill" 
                style={{ width: `${lunatoProgress}%` }}
              />
            </div>
            <span className="progress-label">Progreso del lunato: {percentageToDozenal(lunatoProgress)}%</span>
          </div>
        </div>

        <div className="ozkar-explanation">
          <h3>¿Cómo funciona?</h3>
          <div className="explanation-grid">
            <div className="explanation-item">
              <strong>Sistema Numérico Dozenal (Base-12):</strong> Usa los dígitos 0-9, X (10), W (11). 
              Ejemplo: 1X = 1×12 + 10 = 22 en decimal.
            </div>
            <div className="explanation-item">
              <strong>Reloj Dozenal:</strong> 1 jorno = 20 horo (24), cada unidad subdividida por 12.
              1 horo = 1 hora civil, 1 temo ≈ 5 min, 1 mino ≈ 25 seg, 1 tiko ≈ 2 seg.
            </div>
            <div className="explanation-item">
              <strong>Calendario Solar:</strong> Sol = año solar personal desde el solsticio de invierno 
              de diciembre 1992 (Sol 0). Cada Sol va de un solsticio de invierno al siguiente.
            </div>
            <div className="explanation-item">
              <strong>Lunatos:</strong> Meses lunares (~29.5 días) que comienzan en luna nueva.
              Lunato 1 es la primera luna nueva después del solsticio.
              Un Sol tiene 12 o 13 lunatos de forma natural.
            </div>
            <div className="explanation-item">
              <strong>Lunato 0 (Transición):</strong> El Lunato 0 es especial porque pertenece 
              simultáneamente a dos Soles: es el último lunato del Sol anterior y el primero del 
              Sol actual. Comienza con la luna nueva anterior al solsticio y contiene el día del 
              solsticio de invierno, marcando visualmente la transición entre años solares.
            </div>
            <div className="explanation-item">
              <strong>Visualización del solsticio:</strong> En el calendario lunar, el día del 
              solsticio aparece marcado con un símbolo especial (❄). Los días anteriores al 
              solsticio (que pertenecen al Sol anterior) aparecen atenuados, mientras que los días 
              posteriores pertenecen al nuevo Sol, haciendo evidente la transición astronómica.
            </div>
            <div className="explanation-item">
              <strong>Nombres de los lunatos:</strong> Cada lunato recibe el nombre de la constelación 
              zodiacal sobre la que se encuentra el Sol durante ese período. Los 12 lunatos estándar 
              siguen las constelaciones zodiacales tradicionales.
            </div>
            <div className="explanation-item">
              <strong>Ofiuco:</strong> Los Soles con 13 lunatos incluyen a Ofiuco (⛎, el Serpentario) 
              como la decimotercera constelación, situada entre Escorpio y Sagitario. Su símbolo de 
              "flecha interrumpida" representa estos años con un lunato adicional.
            </div>
            <div className="explanation-item">
              <strong>Solsticio de invierno:</strong> Marca el inicio de cada Sol. Es el día más corto 
              del año, fácilmente observable sin instrumentos modernos.
            </div>
            <div className="explanation-item">
              <strong>Lunas nuevas:</strong> Marcan el inicio de cada lunato. Las fases lunares son 
              completamente observables a simple vista.
            </div>
            <div className="explanation-item">
              <strong>Constelaciones:</strong> La constelación del lunato se calcula según la posición 
              del Sol en la eclíptica, determinada astronómicamente para precisión.
            </div>
            <div className="explanation-item">
              <strong>Inicio del día:</strong> El día comienza a medianoche (0:00 horas), permitiendo 
              sincronización con el tiempo civil.
            </div>
          </div>
        </div>

        {/* Calendario Lunar */}
        <div className="lunato-calendars">
          <div className="calendar-header">
            <button 
              className="nav-button double" 
              onClick={goToPreviousSol}
              aria-label="Sol anterior"
              title="Sol anterior (mismo lunato)"
            >
              ≪
            </button>
            <button 
              className="nav-button" 
              onClick={goToPreviousLunato}
              aria-label="Lunato anterior"
            >
              ←
            </button>
            <div className="calendar-title-container">
              <h3>
                {currentLunato && (
                  <>
                    Sol {currentLunato.solDozenal} · Lunato {currentLunato.lunatoDozenal}
                    {currentLunato.constellation && (
                      <img 
                        src={`/assets/constellations/${currentLunato.constellation.image}`}
                        alt={currentLunato.constellation.name}
                        className="constellation-icon-header"
                      />
                    )}
                  </>
                )}
              </h3>
              <button 
                className="today-button" 
                onClick={goToCurrentLunato}
                disabled={solOffset === 0 && lunatoNumber === ozkarCalendar.lunato}
              >
                Ir al lunato actual
              </button>
            </div>
            <button 
              className="nav-button" 
              onClick={goToNextLunato}
              aria-label="Lunato siguiente"
            >
              →
            </button>
            <button 
              className="nav-button double" 
              onClick={goToNextSol}
              aria-label="Sol siguiente"
              title="Sol siguiente (mismo lunato)"
            >
              ≫
            </button>
          </div>
          
          {currentLunato && (
            <div className="lunato-calendar">
              <div className="calendar-grid">
                {renderCalendarPhases(currentLunato)}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
