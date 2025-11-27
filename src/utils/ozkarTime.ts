/**
 * OzkarTime - Sistema de tiempo personalizado
 * 
 * Este módulo implementa un sistema de medición de tiempo alternativo basado en:
 * 
 * 1. SISTEMA NUMÉRICO DOZENAL (Base-12)
 *    - Dígitos: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, X (10), W (11)
 *    - Se usa 'z' al inicio para indicar números dozenales
 * 
 * 2. SISTEMA DE TIEMPO (Base-12)
 *    - 1 jorno (día) = z20 horo (24 horo decimal)
 *    - 1 horo = z10 temo (12 temo)
 *    - 1 temo = z10 mino (12 mino)  
 *    - 1 mino = z10 tiko (12 tiko)
 *    - Dos mitades: matino (mañana) y vespero (tarde/noche)
 * 
 * 3. CALENDARIO SOLAR PERSONAL ("Sol Calendar")
 *    - Sol = año solar personal (desde solsticio de junio)
 *    - Lunato = mes lunar (luna nueva a luna nueva)
 *    - Jorno = día dentro del lunato actual
 */

// Fecha de nacimiento para cálculo de Sol
const BIRTHDATE = new Date('1993-01-08T22:30:00-05:00');

// Dígitos dozenales
const DOZENAL_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', 'W'];

// Fases lunares (orientativo)
export const LUNAR_PHASES = [
  'Nov-luno',   // Luna nueva
  'Pre-plena',  // Creciente
  'Plena',      // Luna llena
  'Pre-nova'    // Menguante
];

// Interfaces
export interface OzkarClockTime {
  horo: number;           // 0-23 (z0-z1W en dozenal)
  temo: number;           // 0-11 (z0-zW)
  mino: number;           // 0-11 (z0-zW)
  tiko: number;           // 0-11 (z0-zW)
  formatted: string;      // "horo.temo.mino" en dozenal
  formattedFull: string;  // Incluye tiko
  period: string;         // matino o vespero
  periodHoro: number;     // Hora dentro del período (0-11)
}

export interface OzkarCalendarDate {
  sol: number;            // Año solar personal (0 = primer año)
  solDozenal: string;     // Sol en dozenal
  lunato: number;         // Número del lunato (1-13)
  jorno: number;          // Día dentro del lunato (1-30)
  lunatoStartDate: Date;  // Fecha de inicio del lunato actual
  lunarPhase: string;     // Fase lunar aproximada
  formatted: string;      // "Sol z## · Lunato # · Jorno #"
}

/**
 * Convierte un número decimal a notación dozenal
 */
export const toDozenal = (decimal: number): string => {
  if (decimal === 0) return '0';
  
  let result = '';
  let num = Math.abs(Math.floor(decimal));
  
  while (num > 0) {
    result = DOZENAL_DIGITS[num % 12] + result;
    num = Math.floor(num / 12);
  }
  
  return decimal < 0 ? '-' + result : result;
};

/**
 * Convierte dozenal a decimal
 */
export const fromDozenal = (dozenal: string): number => {
  let result = 0;
  const str = dozenal.toUpperCase().replace(/^Z/, '');
  
  for (let i = 0; i < str.length; i++) {
    const digit = str[i];
    let value: number;
    if (digit === 'X') value = 10;
    else if (digit === 'W') value = 11;
    else value = parseInt(digit, 10);
    
    result = result * 12 + value;
  }
  
  return result;
};

/**
 * Obtiene la fecha del solsticio de junio para un año dado
 * Aproximación: alrededor del 21 de junio
 */
const getJuneSolstice = (year: number): Date => {
  // El solsticio de junio ocurre típicamente entre el 20-22 de junio
  // Usamos el 21 como aproximación
  return new Date(year, 5, 21, 0, 0, 0); // Mes 5 = Junio (0-indexed)
};

/**
 * Calcula las fases lunares aproximadas
 * Usando el algoritmo simplificado basado en el ciclo sinódico
 */
const getNewMoonDates = (year: number): Date[] => {
  // Ciclo sinódico lunar ≈ 29.53059 días
  const SYNODIC_MONTH = 29.53059;
  
  // Luna nueva de referencia conocida: 6 de enero de 2000 a las 18:14 UTC
  const REFERENCE_NEW_MOON = new Date('2000-01-06T18:14:00Z');
  
  const newMoons: Date[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 11, 31);
  
  // Calcular la primera luna nueva del año
  const daysSinceReference = (startDate.getTime() - REFERENCE_NEW_MOON.getTime()) / (24 * 60 * 60 * 1000);
  const cyclesSinceReference = daysSinceReference / SYNODIC_MONTH;
  const nextCycleStart = Math.ceil(cyclesSinceReference);
  
  // Generar todas las lunas nuevas del año
  for (let i = nextCycleStart; ; i++) {
    const newMoonTime = REFERENCE_NEW_MOON.getTime() + (i * SYNODIC_MONTH * 24 * 60 * 60 * 1000);
    const newMoon = new Date(newMoonTime);
    
    if (newMoon > endDate) break;
    if (newMoon >= startDate) {
      newMoons.push(newMoon);
    }
  }
  
  return newMoons;
};

/**
 * Obtiene el lunato actual y el jorno dentro de él
 */
const getLunatoInfo = (date: Date, solstice: Date): { lunato: number; jorno: number; lunatoStart: Date } => {
  const year = date.getFullYear();
  const newMoons = getNewMoonDates(year);
  
  // Encontrar la primera luna nueva después del solsticio de junio
  let lunatoStartIndex = 0;
  for (let i = 0; i < newMoons.length; i++) {
    if (newMoons[i] >= solstice) {
      lunatoStartIndex = i;
      break;
    }
  }
  
  // Si el solsticio es del año anterior, buscar la luna nueva correspondiente
  const prevYearNewMoons = getNewMoonDates(year - 1);
  const prevYearSolstice = getJuneSolstice(year - 1);
  
  // Combinar las lunas nuevas relevantes
  let allNewMoons: Date[] = [];
  
  // Agregar lunas nuevas del año anterior después del solsticio
  for (const nm of prevYearNewMoons) {
    if (nm >= prevYearSolstice) {
      allNewMoons.push(nm);
    }
  }
  
  // Agregar lunas nuevas del año actual
  allNewMoons = allNewMoons.concat(newMoons);
  
  // También agregar del próximo año si es necesario
  const nextYearNewMoons = getNewMoonDates(year + 1);
  allNewMoons = allNewMoons.concat(nextYearNewMoons.slice(0, 3));
  
  // Encontrar el solsticio relevante para la fecha actual
  let relevantSolstice: Date;
  const currentYearSolstice = getJuneSolstice(year);
  
  if (date < currentYearSolstice) {
    relevantSolstice = prevYearSolstice;
  } else {
    relevantSolstice = currentYearSolstice;
  }
  
  // Encontrar la primera luna nueva después del solsticio relevante
  let firstLunatoStart: Date | null = null;
  for (const nm of allNewMoons) {
    if (nm >= relevantSolstice) {
      firstLunatoStart = nm;
      break;
    }
  }
  
  if (!firstLunatoStart) {
    firstLunatoStart = relevantSolstice;
  }
  
  // Contar lunatos y encontrar el actual
  let lunato = 1;
  let lunatoStart = firstLunatoStart;
  
  for (let i = 0; i < allNewMoons.length - 1; i++) {
    if (allNewMoons[i] >= firstLunatoStart && allNewMoons[i] <= date) {
      if (allNewMoons[i + 1] > date) {
        lunatoStart = allNewMoons[i];
        break;
      }
      lunato++;
      lunatoStart = allNewMoons[i];
    }
  }
  
  // Calcular jorno (día dentro del lunato)
  const daysSinceLunatoStart = Math.floor((date.getTime() - lunatoStart.getTime()) / (24 * 60 * 60 * 1000));
  const jorno = daysSinceLunatoStart + 1;
  
  return { lunato, jorno, lunatoStart };
};

/**
 * Obtiene la fase lunar aproximada basada en el jorno
 */
const getLunarPhase = (jorno: number): string => {
  // Ciclo lunar ≈ 29.5 días, dividido en 4 fases de ~7.4 días cada una
  if (jorno <= 7) return LUNAR_PHASES[0];      // Nov-luno
  if (jorno <= 15) return LUNAR_PHASES[1];     // Pre-plena
  if (jorno <= 22) return LUNAR_PHASES[2];     // Plena
  return LUNAR_PHASES[3];                       // Pre-nova
};

/**
 * Convierte el tiempo actual a OzkarClock (tiempo dozenal)
 * - 1 jorno = z20 horo (24 horo)
 * - 1 horo = z10 temo (12 temo) ≈ 5 minutos civiles cada uno
 * - 1 temo = z10 mino (12 mino) ≈ 25 segundos civiles cada uno
 * - 1 mino = z10 tiko (12 tiko) ≈ 2.08 segundos civiles cada uno
 */
export const getOzkarClock = (date: Date = new Date()): OzkarClockTime => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  
  // Total de segundos desde medianoche
  const totalSeconds = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  
  // 1 horo = 1 hora civil (24 horo por día, igual que 24 horas)
  const horo = hours;
  
  // 1 temo = 1/12 de horo = 5 minutos civiles
  // Calcular temo, mino, tiko basados en los minutos y segundos
  const secondsIntoHour = minutes * 60 + seconds + milliseconds / 1000;
  const secondsPerTemo = 300; // 5 minutos = 300 segundos
  const temo = Math.floor(secondsIntoHour / secondsPerTemo);
  
  const secondsIntoTemo = secondsIntoHour % secondsPerTemo;
  const secondsPerMino = 25; // 300/12 = 25 segundos
  const mino = Math.floor(secondsIntoTemo / secondsPerMino);
  
  const secondsIntoMino = secondsIntoTemo % secondsPerMino;
  const secondsPerTiko = 25 / 12; // ≈ 2.083 segundos
  const tiko = Math.floor(secondsIntoMino / secondsPerTiko);
  
  // Determinar período del día
  const period = horo < 12 ? 'matino' : 'vespero';
  const periodHoro = horo < 12 ? horo : horo - 12;
  
  // Formatear en dozenal
  const horoDozenal = toDozenal(horo);
  const temoDozenal = toDozenal(temo);
  const minoDozenal = toDozenal(mino);
  const tikoDozenal = toDozenal(tiko);
  
  const formatted = `${horoDozenal}.${temoDozenal}${minoDozenal}`;
  const formattedFull = `${horoDozenal}.${temoDozenal}${minoDozenal}.${tikoDozenal}`;
  
  return {
    horo,
    temo,
    mino,
    tiko,
    formatted,
    formattedFull,
    period,
    periodHoro
  };
};

/**
 * Convierte una fecha al Calendario Solar Personal
 * - Sol = año solar desde el nacimiento (basado en solsticios de junio)
 * - Lunato = mes lunar (luna nueva a luna nueva)
 * - Jorno = día dentro del lunato
 */
export const getOzkarCalendar = (date: Date = new Date()): OzkarCalendarDate => {
  const birthYear = BIRTHDATE.getFullYear();
  const currentYear = date.getFullYear();
  
  // Calcular Sol (año solar personal)
  // Sol 0 comienza en el primer solsticio de junio después del nacimiento
  const firstSolstice = getJuneSolstice(birthYear);
  let sol: number;
  
  // Encontrar el solsticio más reciente antes de la fecha actual
  let recentSolstice: Date;
  const currentYearSolstice = getJuneSolstice(currentYear);
  
  if (date >= currentYearSolstice) {
    recentSolstice = currentYearSolstice;
  } else {
    recentSolstice = getJuneSolstice(currentYear - 1);
  }
  
  // Calcular cuántos solsticios han pasado desde el nacimiento
  sol = recentSolstice.getFullYear() - firstSolstice.getFullYear();
  if (BIRTHDATE > firstSolstice) {
    sol--; // Ajustar si nació después del solsticio de su año de nacimiento
  }
  
  // Asegurar que sol no sea negativo
  if (sol < 0) sol = 0;
  
  // Obtener información del lunato
  const { lunato, jorno, lunatoStart } = getLunatoInfo(date, recentSolstice);
  
  // Obtener fase lunar
  const lunarPhase = getLunarPhase(jorno);
  
  // Formatear
  const solDozenal = toDozenal(sol);
  const formatted = `Sol z${solDozenal} · Lunato ${lunato} · Jorno ${jorno}`;
  
  return {
    sol,
    solDozenal,
    lunato,
    jorno,
    lunatoStartDate: lunatoStart,
    lunarPhase,
    formatted
  };
};

/**
 * Obtiene el progreso del día en porcentaje (para visualización)
 */
export const getDayProgress = (date: Date = new Date()): number => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const secondsInDay = 24 * 60 * 60;
  
  return (totalSeconds / secondsInDay) * 100;
};

/**
 * Obtiene el progreso del lunato actual (aproximado, ~29.5 días)
 */
export const getLunatoProgress = (calendar: OzkarCalendarDate): number => {
  const SYNODIC_MONTH = 29.53; // días
  return Math.min((calendar.jorno / SYNODIC_MONTH) * 100, 100);
};

// Re-exportar para compatibilidad
export { toDozenal as formatDozenal };
