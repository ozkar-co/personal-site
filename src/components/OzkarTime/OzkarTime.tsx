import { useState, useEffect } from 'react';
import { 
  getOzkarClock, 
  getOzkarCalendar, 
  getDayProgress, 
  getLunatoProgress,
  getLunatoCalendarInfo,
  OzkarClockTime, 
  OzkarCalendarDate,
  LunatoCalendarInfo,
  LUNAR_PHASES
} from '../../utils/ozkarTime';
import './OzkarTime.scss';

export const OzkarTime = () => {
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
    formatted: 'Sol z0 · Lunato 1 · Jorno 1'
  });

  const [dayProgress, setDayProgress] = useState(0);
  const [lunatoProgress, setLunatoProgress] = useState(0);
  const [currentLunato, setCurrentLunato] = useState<LunatoCalendarInfo | null>(null);
  const [lunatoOffset, setLunatoOffset] = useState(0); // Offset para navegar entre lunatos

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
      
      // Actualizar calendario lunar con el offset actual
      setCurrentLunato(getLunatoCalendarInfo(now, lunatoOffset));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [lunatoOffset]);

  // Funciones de navegación
  const goToPreviousLunato = () => {
    // Sin límites - podemos navegar infinitamente hacia atrás
    setLunatoOffset(prev => prev - 1);
  };

  const goToNextLunato = () => {
    // Sin límites - podemos navegar infinitamente hacia adelante
    setLunatoOffset(prev => prev + 1);
  };

  const goToPrevious12Lunatos = () => {
    // Saltar 12 lunatos hacia atrás (aproximadamente 1 Sol)
    setLunatoOffset(prev => prev - 12);
  };

  const goToNext12Lunatos = () => {
    // Saltar 12 lunatos hacia adelante (aproximadamente 1 Sol)
    setLunatoOffset(prev => prev + 12);
  };

  const goToCurrentLunato = () => {
    setLunatoOffset(0);
  };

  // Función auxiliar para renderizar las celdas del calendario
  const renderCalendarPhases = (lunato: LunatoCalendarInfo) => {
    return Object.entries(lunato.phases).map(([phaseName, phaseDays]) => (
      phaseDays.length > 0 && (
        <div key={phaseName} className="phase-row">
          <div className="phase-label">{phaseDays[0].lunarPhase}</div>
          <div className="phase-days">
            {phaseDays.map((day) => (
              <div 
                key={day.jorno} 
                className={`day-cell ${day.isToday ? 'today' : ''}`}
              >
                <span className="jorno-number">{day.jornoDozenal}</span>
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
            ))}
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
              <span className="clock-period">{ozkarClock.period}</span>
            </div>
            <div className="clock-breakdown">
              <div className="time-part">
                <span className="value">{ozkarClock.horo}</span>
                <span className="unit">horo</span>
              </div>
              <div className="time-part">
                <span className="value">{ozkarClock.temo}</span>
                <span className="unit">temo</span>
              </div>
              <div className="time-part">
                <span className="value">{ozkarClock.mino}</span>
                <span className="unit">mino</span>
              </div>
              <div className="time-part">
                <span className="value">{ozkarClock.tiko}</span>
                <span className="unit">tiko</span>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill day-progress" 
                style={{ width: `${dayProgress}%` }}
              />
            </div>
            <span className="progress-label">Progreso del jorno: {dayProgress.toFixed(1)}%</span>
          </div>

          {/* Calendario Solar */}
          <div className="ozkar-calendar">
            <h2>Calendario Luni-Solar</h2>
            <div className="calendar-display">
              <span className="calendar-date">{ozkarCalendar.formatted}</span>
              <span className="calendar-day">{ozkarCalendar.lunarPhase}</span>
            </div>
            <div className="calendar-details">
              <div className="detail-item">
                <span className="detail-label">Sol</span>
                <span className="detail-value">{ozkarCalendar.solDozenal}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Lunato</span>
                <span className="detail-value">{ozkarCalendar.lunato}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Jorno</span>
                <span className="detail-value">{ozkarCalendar.jorno}</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-markers">
                <div className="marker" style={{ left: '25%' }}></div>
                <div className="marker" style={{ left: '50%' }}></div>
                <div className="marker" style={{ left: '75%' }}></div>
              </div>
              <div 
                className="progress-fill year-progress" 
                style={{ width: `${lunatoProgress}%` }}
              />
            </div>
            <span className="progress-label">Progreso del lunato: {lunatoProgress.toFixed(1)}%</span>
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
              <strong>Calendario Solar:</strong> Sol = año solar personal desde el solsticio de invierno de diciembre 1992 (Sol 1).
              Cada Sol va de un solsticio de invierno al siguiente.
            </div>
            <div className="explanation-item">
              <strong>Lunatos:</strong> Meses lunares (~29.5 días) que comienzan en luna nueva.
              Lunato 0 = transición entre años solares. Lunato 1 = primera luna nueva después del solsticio.
              Un Sol tiene 12 o 13 lunatos de forma natural.
            </div>
          </div>
        </div>

        {/* Calendario Lunar */}
        <div className="lunato-calendars">
          <div className="calendar-header">
            <button 
              className="nav-button double" 
              onClick={goToPrevious12Lunatos}
              aria-label="Retroceder 12 lunatos"
              title="Retroceder 12 lunatos"
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
                {currentLunato && `Sol ${currentLunato.solDozenal} · Lunato ${currentLunato.lunatoDozenal}`}
              </h3>
              <button 
                className="today-button" 
                onClick={goToCurrentLunato}
                disabled={lunatoOffset === 0}
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
              onClick={goToNext12Lunatos}
              aria-label="Avanzar 12 lunatos"
              title="Avanzar 12 lunatos"
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
