import { useState, useEffect } from 'react';
import { 
  getOzkarClock, 
  getOzkarCalendar, 
  getDayProgress, 
  getLunatoProgress,
  OzkarClockTime, 
  OzkarCalendarDate,
  LUNAR_PHASES
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
      setLunatoProgress(getLunatoProgress(calendar));
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
          <p className="ozkar-subtitle">Mi sistema personal de medición del tiempo (Base-12 / Dozenal)</p>

          <div className="ozkar-time-grid">
            {/* Reloj Dozenal */}
            <div className="ozkar-clock">
              <h3>🕐 Reloj Dozenal</h3>
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
              <div className="clock-info">
                <p>z20 horo · z10 temo · z10 mino · z10 tiko</p>
                <p className="clock-detail">1 horo = 1 hora civil | 1 temo ≈ 5 min | 1 mino ≈ 25 seg</p>
              </div>
            </div>

            {/* Calendario Solar */}
            <div className="ozkar-calendar">
              <h3>📅 Calendario Solar</h3>
              <div className="calendar-display">
                <span className="calendar-date">{ozkarCalendar.formatted}</span>
                <span className="calendar-day">{ozkarCalendar.lunarPhase}</span>
              </div>
              <div className="calendar-details">
                <div className="detail-item">
                  <span className="detail-label">Sol</span>
                  <span className="detail-value">z{ozkarCalendar.solDozenal}</span>
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
                <div 
                  className="progress-fill year-progress" 
                  style={{ width: `${lunatoProgress}%` }}
                />
              </div>
              <span className="progress-label">Progreso del lunato: {lunatoProgress.toFixed(1)}%</span>
            </div>
          </div>

          <div className="ozkar-explanation">
            <h4>¿Cómo funciona?</h4>
            <div className="explanation-grid">
              <div className="explanation-item">
                <strong>Sistema Dozenal:</strong> Base-12 con dígitos 0-9, X (10), W (11). 
                Tiempo dividido: 1 jorno = z20 horo, cada unidad subdividida por 12.
              </div>
              <div className="explanation-item">
                <strong>Calendario Solar:</strong> Sol = año solar desde el nacimiento (solsticio de junio).
                Lunato = mes lunar (~29.5 días). Jorno = día dentro del lunato.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 