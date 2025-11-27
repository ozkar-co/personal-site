import { useState, useEffect } from 'react';
import { 
  getOzkarClock, 
  getOzkarCalendar, 
  getDayProgress, 
  getYearProgress,
  OzkarClockTime, 
  OzkarCalendarDate 
} from '../../utils/ozkarTime';
import './Time.scss';

export const Time = () => {
  const [timeLived, setTimeLived] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [timeRemaining, setTimeRemaining] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Estado para OzkarTime
  const [ozkarClock, setOzkarClock] = useState<OzkarClockTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    formatted: '0:00:00',
    period: 'Aurora'
  });

  const [ozkarCalendar, setOzkarCalendar] = useState<OzkarCalendarDate>({
    year: 0,
    month: 1,
    monthName: 'Genesis',
    day: 1,
    dayOfWeek: 0,
    dayName: 'Solis',
    isSpecialDay: false,
    formatted: '1 de Genesis, Año 0',
    season: 'Tempus Initium'
  });

  const [dayProgress, setDayProgress] = useState(0);
  const [yearProgress, setYearProgress] = useState(0);

  // Fecha de nacimiento: 8 de enero de 1993, 10:30 PM, Bogotá/Colombia
  const birthDate = new Date('1993-01-08T22:30:00-05:00');
  
  // Esperanza de vida: 80.3 años
  const lifeExpectancy = 80.3;
  const expectedDeathDate = new Date(birthDate.getTime() + (lifeExpectancy * 365.25 * 24 * 60 * 60 * 1000));

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Calcular tiempo vivido
      const livedDiff = now.getTime() - birthDate.getTime();
      const livedYears = Math.floor(livedDiff / (365.25 * 24 * 60 * 60 * 1000));
      const livedMonths = Math.floor((livedDiff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
      const livedDays = Math.floor((livedDiff % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
      const livedHours = Math.floor((livedDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const livedMinutes = Math.floor((livedDiff % (60 * 60 * 1000)) / (60 * 1000));
      const livedSeconds = Math.floor((livedDiff % (60 * 1000)) / 1000);

      setTimeLived({
        years: livedYears,
        months: livedMonths,
        days: livedDays,
        hours: livedHours,
        minutes: livedMinutes,
        seconds: livedSeconds
      });

      // Calcular tiempo restante
      const remainingDiff = expectedDeathDate.getTime() - now.getTime();
      const remainingYears = Math.floor(remainingDiff / (365.25 * 24 * 60 * 60 * 1000));
      const remainingMonths = Math.floor((remainingDiff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
      const remainingDays = Math.floor((remainingDiff % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
      const remainingHours = Math.floor((remainingDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const remainingMinutes = Math.floor((remainingDiff % (60 * 60 * 1000)) / (60 * 1000));
      const remainingSeconds = Math.floor((remainingDiff % (60 * 1000)) / 1000);

      setTimeRemaining({
        years: remainingYears,
        months: remainingMonths,
        days: remainingDays,
        hours: remainingHours,
        minutes: remainingMinutes,
        seconds: remainingSeconds
      });

      // Actualizar OzkarTime
      const clock = getOzkarClock(now);
      const calendar = getOzkarCalendar(now);
      setOzkarClock(clock);
      setOzkarCalendar(calendar);
      setDayProgress(getDayProgress(now));
      setYearProgress(getYearProgress(calendar));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const isOverLifeExpectancy = timeRemaining.years < 0;
  const isNegative = timeRemaining.years < 0 || timeRemaining.months < 0 || timeRemaining.days < 0;

  return (
    <section className="time">
      <div className="time-container">
        <h1>TIME</h1>
        
        <div className="time-content">
          <div className="time-lived">
            <h2>Tiempo Vivido</h2>
            <div className="time-display lived">
              <div className="time-unit">
                <span className="number">{timeLived.years}</span>
                <span className="label">Años</span>
              </div>
              <div className="time-unit">
                <span className="number">{timeLived.months}</span>
                <span className="label">Meses</span>
              </div>
              <div className="time-unit">
                <span className="number">{timeLived.days}</span>
                <span className="label">Días</span>
              </div>
              <div className="time-unit">
                <span className="number">{timeLived.hours}</span>
                <span className="label">Horas</span>
              </div>
              <div className="time-unit">
                <span className="number">{timeLived.minutes}</span>
                <span className="label">Minutos</span>
              </div>
              <div className="time-unit">
                <span className="number">{timeLived.seconds}</span>
                <span className="label">Segundos</span>
              </div>
            </div>
          </div>

          <div className="time-quote">
            <blockquote>
              "Tempus fugit, memento mori"
            </blockquote>
            <p>El tiempo vuela, recuerda que morirás</p>
          </div>

          <div className="time-remaining">
            <h2>Tiempo Restante</h2>
            <div className={`time-display remaining ${isNegative ? 'negative' : ''}`}>
              <div className="time-unit">
                <span className="number">{Math.abs(timeRemaining.years)}</span>
                <span className="label">Años</span>
              </div>
              <div className="time-unit">
                <span className="number">{Math.abs(timeRemaining.months)}</span>
                <span className="label">Meses</span>
              </div>
              <div className="time-unit">
                <span className="number">{Math.abs(timeRemaining.days)}</span>
                <span className="label">Días</span>
              </div>
              <div className="time-unit">
                <span className="number">{Math.abs(timeRemaining.hours)}</span>
                <span className="label">Horas</span>
              </div>
              <div className="time-unit">
                <span className="number">{Math.abs(timeRemaining.minutes)}</span>
                <span className="label">Minutos</span>
              </div>
              <div className="time-unit">
                <span className="number">{Math.abs(timeRemaining.seconds)}</span>
                <span className="label">Segundos</span>
              </div>
            </div>
            {isOverLifeExpectancy && (
              <div className="over-expectancy">
                <p>¡Has superado tu esperanza de vida! 🎉</p>
              </div>
            )}
          </div>
        </div>

        <div className="time-disclaimer">
          <p>
            <strong>Disclaimer:</strong> La cuenta regresiva es solo una aproximación basada en datos estadísticos, 
            teniendo en cuenta la esperanza de vida de mi pais, el historial de mi familia y mi estilo de vida.
            Si llega a valores negativos y aún estoy vivo, es porque he superado mi esperanza de vida (¡caso ideal!). 
            Si he muerto y el reloj sigue corriendo, es porque quien dejé encargado de actualizar este sitio no hizo su trabajo.
          </p>
        </div>

        {/* OzkarTime - Sistema de Tiempo Personalizado */}
        <div className="ozkar-time-section">
          <h2 className="ozkar-title">⏳ OzkarTime</h2>
          <p className="ozkar-subtitle">Mi sistema personal de medición del tiempo</p>

          <div className="ozkar-time-grid">
            {/* Reloj Decimal */}
            <div className="ozkar-clock">
              <h3>🕐 Reloj Decimal</h3>
              <div className="clock-display">
                <span className="clock-time">{ozkarClock.formatted}</span>
                <span className="clock-period">{ozkarClock.period}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill day-progress" 
                  style={{ width: `${dayProgress}%` }}
                />
              </div>
              <span className="progress-label">Progreso del día: {dayProgress.toFixed(1)}%</span>
              <div className="clock-info">
                <p>10 horas • 100 minutos • 100 segundos</p>
                <p className="clock-detail">Un día = 100,000 ozk-segundos</p>
              </div>
            </div>

            {/* Calendario Personal */}
            <div className="ozkar-calendar">
              <h3>📅 Calendario Personal</h3>
              <div className="calendar-display">
                <span className="calendar-date">{ozkarCalendar.formatted}</span>
                <span className="calendar-day">{ozkarCalendar.dayName}</span>
              </div>
              <div className="calendar-details">
                <div className="detail-item">
                  <span className="detail-label">Estación</span>
                  <span className="detail-value">{ozkarCalendar.season}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mes</span>
                  <span className="detail-value">{ozkarCalendar.month > 0 ? `${ozkarCalendar.month}/13` : 'Especial'}</span>
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill year-progress" 
                  style={{ width: `${yearProgress}%` }}
                />
              </div>
              <span className="progress-label">Progreso del año: {yearProgress.toFixed(1)}%</span>
              {ozkarCalendar.isSpecialDay && (
                <div className="special-day-badge">
                  ✨ {ozkarCalendar.specialDayName}
                </div>
              )}
            </div>
          </div>

          <div className="ozkar-explanation">
            <h4>¿Cómo funciona?</h4>
            <div className="explanation-grid">
              <div className="explanation-item">
                <strong>Reloj Decimal:</strong> El día se divide en 10 horas de 100 minutos cada una. 
                Más intuitivo y alineado con nuestro sistema numérico base-10.
              </div>
              <div className="explanation-item">
                <strong>Calendario Personal:</strong> El Año 0 comienza en mi nacimiento (8 de enero de 1993). 
                13 meses de 28 días perfectos, más 1-2 días especiales llamados "Días del Mago".
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 