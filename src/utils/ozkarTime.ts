/**
 * OzkarTime - Sistema de tiempo personalizado
 * 
 * Este módulo implementa un sistema de medición de tiempo alternativo basado en:
 * 
 * 1. SISTEMA NUMÉRICO DOZENAL (Base-12)
 *    - Dígitos: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, X (10), W (11)
 * 
 * 2. SISTEMA DE TIEMPO (Base-12)
 *    - 1 jorno (día) = 20 horo (24 horo decimal)
 *    - 1 horo = 10 temo (12 temo)
 *    - 1 temo = 10 mino (12 mino)  
 *    - 1 mino = 10 tiko (12 tiko)
 *    - Dos mitades: matino (mañana) y vespero (tarde/noche)
 * 
 * 3. CALENDARIO SOLAR PERSONAL ("Sol Calendar")
 *    - Sol = año solar personal (desde solsticio de invierno - diciembre)
 *    - Sol 1 comienza en el solsticio de invierno de diciembre 1992
 *    - Lunato = mes lunar (luna nueva a luna nueva)
 *    - Lunato 0 = lunato de transición entre años solares
 *    - Jorno = día dentro del lunato actual (1-30)
 */

// Dígitos dozenales
const DOZENAL_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', 'W'];

// Fases lunares (orientativo)
export const LUNAR_PHASES = [
  'Nova',       // Luna nueva
  'Pre-plena',  // Creciente
  'Plena',      // Luna llena
  'Pre-nova'    // Menguante
];

// Cache para datos astronómicos precalculados
let astronomicalDataCache: {
  newMoons?: string[];
  winterSolstices?: Array<{ year: number; date: string }>;
  loaded: boolean;
} = { loaded: false };

/**
 * Carga los datos astronómicos precalculados
 */
const loadAstronomicalData = async () => {
  if (astronomicalDataCache.loaded) return;
  
  try {
    const response = await fetch('/astronomical-data/astronomical-data.json');
    if (response.ok) {
      const data = await response.json();
      astronomicalDataCache.newMoons = data.newMoons;
      astronomicalDataCache.winterSolstices = data.winterSolstices;
      astronomicalDataCache.loaded = true;
      console.log('✅ Datos astronómicos precalculados cargados');
    }
  } catch (error) {
    console.warn('⚠️  No se pudieron cargar datos precalculados, usando cálculos', error);
  }
  astronomicalDataCache.loaded = true;
};

// Intentar cargar datos al importar el módulo
if (typeof window !== 'undefined') {
  loadAstronomicalData();
}

// Interfaces
export interface OzkarClockTime {
  horo: number;           // 0-23 (0-1W en dozenal)
  temo: number;           // 0-11 (0-W)
  mino: number;           // 0-11 (0-W)
  tiko: number;           // 0-11 (0-W)
  formatted: string;      // "horo.temo.mino" en dozenal
  formattedFull: string;  // Incluye tiko
  period: string;         // matino o vespero
  periodHoro: number;     // Hora dentro del período (0-11)
}

export interface OzkarCalendarDate {
  sol: number;            // Año solar personal (1 = primer año desde diciembre 1992)
  solDozenal: string;     // Sol en dozenal
  lunato: number;         // Número del lunato (0-13, donde 0 es lunato de transición)
  jorno: number;          // Día dentro del lunato (1-30)
  lunatoStartDate: Date;  // Fecha de inicio del lunato actual
  lunarPhase: string;     // Fase lunar aproximada
  formatted: string;      // "Sol ## · Lunato # · Jorno #"
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
 * Obtiene la fecha del solsticio de invierno (diciembre) para un año dado
 * Usa datos precalculados si están disponibles, sino calcula una aproximación
 */
const getWinterSolstice = (year: number): Date => {
  // Intentar usar datos precalculados
  if (astronomicalDataCache.winterSolstices) {
    const solstice = astronomicalDataCache.winterSolstices.find(s => s.year === year);
    if (solstice) {
      return new Date(solstice.date);
    }
  }
  
  // Fallback: aproximación (alrededor del 21 de diciembre)
  return new Date(year, 11, 21, 0, 0, 0); // Mes 11 = Diciembre (0-indexed)
};

/**
 * Calcula las fases lunares aproximadas
 * Usa datos precalculados si están disponibles, sino calcula usando el ciclo sinódico
 */
const getNewMoonDates = (year: number): Date[] => {
  // Intentar usar datos precalculados
  if (astronomicalDataCache.newMoons) {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59);
    
    return astronomicalDataCache.newMoons
      .map(dateStr => new Date(dateStr))
      .filter(date => date >= yearStart && date <= yearEnd);
  }
  
  // Fallback: cálculo usando ciclo sinódico
  const SYNODIC_MONTH = 29.53059;
  const REFERENCE_NEW_MOON = new Date('2000-01-06T18:14:00Z');
  
  const newMoons: Date[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);
  
  const daysSinceReference = (startDate.getTime() - REFERENCE_NEW_MOON.getTime()) / (24 * 60 * 60 * 1000);
  const cyclesSinceReference = daysSinceReference / SYNODIC_MONTH;
  const nextCycleStart = Math.ceil(cyclesSinceReference);
  
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
 * Lunato 0 es el lunato de transición (el último del año anterior que se extiende al nuevo)
 * Lunato 1 es la primera luna nueva después del solsticio de invierno
 */
const getLunatoInfo = (date: Date, solstice: Date): { lunato: number; jorno: number; lunatoStart: Date } => {
  const year = date.getFullYear();
  const newMoons = getNewMoonDates(year);
  
  // Obtener lunas nuevas del año anterior y siguiente
  const prevYearNewMoons = getNewMoonDates(year - 1);
  const nextYearNewMoons = getNewMoonDates(year + 1);
  
  // Combinar todas las lunas nuevas relevantes de forma eficiente
  const allNewMoons = prevYearNewMoons.concat(newMoons, nextYearNewMoons.slice(0, 6));
  
  // Ordenar por fecha
  allNewMoons.sort((a, b) => a.getTime() - b.getTime());
  
  // Encontrar la primera luna nueva después del solsticio
  let firstLunatoIndex = -1;
  for (let i = 0; i < allNewMoons.length; i++) {
    if (allNewMoons[i] >= solstice) {
      firstLunatoIndex = i;
      break;
    }
  }
  
  // Si no hay luna nueva después del solsticio, usar el solsticio
  if (firstLunatoIndex === -1) {
    return { lunato: 0, jorno: 1, lunatoStart: solstice };
  }
  
  // Encontrar en qué lunato estamos
  let lunato = 0;
  let lunatoStart: Date;
  
  // Verificar si estamos en el Lunato 0 (antes de la primera luna nueva del sol)
  if (date < allNewMoons[firstLunatoIndex]) {
    // Estamos en Lunato 0 (periodo entre solsticio y primera luna nueva)
    // El inicio del Lunato 0 es la luna nueva anterior al solsticio
    if (firstLunatoIndex > 0) {
      lunatoStart = allNewMoons[firstLunatoIndex - 1];
    } else {
      lunatoStart = solstice;
    }
    lunato = 0;
  } else {
    // Encontrar el lunato actual contando desde la primera luna nueva después del solsticio
    // Lunato 1 = primera luna nueva después del solsticio
    lunatoStart = allNewMoons[firstLunatoIndex];
    lunato = 1;
    
    // Buscar el lunato específico en el que estamos
    for (let i = firstLunatoIndex; i < allNewMoons.length - 1; i++) {
      // Si la fecha está entre esta luna nueva y la siguiente
      if (date >= allNewMoons[i] && date < allNewMoons[i + 1]) {
        lunato = (i - firstLunatoIndex) + 1;
        lunatoStart = allNewMoons[i];
        break;
      }
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
 * - 1 jorno = 20 horo (24 horo)
 * - 1 horo = 10 temo (12 temo) ≈ 5 minutos civiles cada uno
 * - 1 temo = 10 mino (12 mino) ≈ 25 segundos civiles cada uno
 * - 1 mino = 10 tiko (12 tiko) ≈ 2.08 segundos civiles cada uno
 */
export const getOzkarClock = (date: Date = new Date()): OzkarClockTime => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  
  // 1 horo = 1 hora civil (24 horo por día, igual que 24 horas)
  const horo = hours;
  
  // 1 temo = 1/12 de horo = 5 minutos civiles
  // Calcular temo, mino, tiko basados en los minutos y segundos
  const secondsIntoHour = minutes * 60 + seconds + milliseconds / 1000;
  const secondsPerTemo = 300; // 5 minutos = 300 segundos
  const temo = Math.min(Math.floor(secondsIntoHour / secondsPerTemo), 11);
  
  const secondsIntoTemo = secondsIntoHour % secondsPerTemo;
  const secondsPerMino = 25; // 300/12 = 25 segundos
  const mino = Math.min(Math.floor(secondsIntoTemo / secondsPerMino), 11);
  
  const secondsIntoMino = secondsIntoTemo % secondsPerMino;
  const secondsPerTiko = 25 / 12; // ≈ 2.083 segundos
  const tiko = Math.min(Math.floor(secondsIntoMino / secondsPerTiko), 11);
  
  // Determinar período del día
  const period = horo < 12 ? 'matino' : 'vespero';
  const periodHoro = horo < 12 ? horo : horo - 12;
  
  // Formatear en dozenal
  const horoDozenal = toDozenal(horo);
  const temoDozenal = toDozenal(temo);
  const minoDozenal = toDozenal(mino);
  const tikoDozenal = toDozenal(tiko);
  
  // Formato: horo.temo.mino (según especificación del usuario)
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
 * - Sol = año solar desde el solsticio de invierno de diciembre 1992 (Sol 1)
 * - Lunato = mes lunar (luna nueva a luna nueva), 0 = lunato de transición
 * - Jorno = día dentro del lunato
 */
export const getOzkarCalendar = (date: Date = new Date()): OzkarCalendarDate => {
  const currentYear = date.getFullYear();
  
  // Calcular Sol (año solar personal)
  // Sol 1 comienza en el solsticio de invierno de diciembre 1992
  const firstSolYear = 1992;
  
  // Encontrar el solsticio de invierno más reciente antes de la fecha actual
  let recentSolstice: Date;
  const currentYearSolstice = getWinterSolstice(currentYear);
  
  if (date >= currentYearSolstice) {
    recentSolstice = currentYearSolstice;
  } else {
    recentSolstice = getWinterSolstice(currentYear - 1);
  }
  
  // Calcular cuántos años solares han pasado desde diciembre 1992
  // Sol 1 = solsticio diciembre 1992, Sol 2 = solsticio diciembre 1993, etc.
  const sol = recentSolstice.getFullYear() - firstSolYear + 1;
  
  // Obtener información del lunato
  const { lunato, jorno, lunatoStart } = getLunatoInfo(date, recentSolstice);
  
  // Obtener fase lunar
  const lunarPhase = getLunarPhase(jorno);
  
  // Formatear
  const solDozenal = toDozenal(sol);
  const formatted = `Sol ${solDozenal} · Lunato ${lunato} · Jorno ${jorno}`;
  
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

/**
 * Información de un día en el calendario lunar
 */
export interface LunatoDayInfo {
  jorno: number;           // Día dentro del lunato
  jornoDozenal: string;    // Jorno en formato dozenal
  civilDate: Date;         // Fecha civil
  lunarPhase: string;      // Fase lunar
  isToday: boolean;        // Si es el día actual
}

/**
 * Información completa de un lunato para el calendario
 */
export interface LunatoCalendarInfo {
  lunato: number;
  lunatoDozenal: string;   // Lunato en formato dozenal
  sol: number;
  solDozenal: string;      // Sol en formato dozenal
  startDate: Date;
  endDate: Date;
  days: LunatoDayInfo[];
  phases: {
    novLuno: LunatoDayInfo[];    // Luna nueva (días 1-7)
    prePlena: LunatoDayInfo[];   // Creciente (días 8-15)
    plena: LunatoDayInfo[];      // Luna llena (días 16-22)
    preNova: LunatoDayInfo[];    // Menguante (días 23+)
  };
}

/**
 * Obtiene la información completa de un lunato para el calendario
 */
export const getLunatoCalendarInfo = (date: Date = new Date(), offset: number = 0): LunatoCalendarInfo => {
  const calendar = getOzkarCalendar(date);
  const year = date.getFullYear();
  
  // Generar lunas nuevas para un rango más amplio (3 años antes y después)
  const years = [];
  for (let y = year - 3; y <= year + 3; y++) {
    years.push(...getNewMoonDates(y));
  }
  
  const allNewMoons = years;
  allNewMoons.sort((a, b) => a.getTime() - b.getTime());
  
  // Encontrar el inicio del lunato actual
  const currentLunatoStart = calendar.lunatoStartDate;
  
  // Encontrar el índice del lunato actual en la lista de lunas nuevas
  let currentLunatoIndex = allNewMoons.findIndex(
    moon => Math.abs(moon.getTime() - currentLunatoStart.getTime()) < 24 * 60 * 60 * 1000
  );
  
  if (currentLunatoIndex === -1) {
    // Si no se encuentra, buscar la luna nueva más cercana antes de la fecha actual
    currentLunatoIndex = allNewMoons.findIndex(moon => moon > currentLunatoStart);
    if (currentLunatoIndex > 0) currentLunatoIndex--;
  }
  
  // Aplicar offset para lunato anterior/siguiente
  const targetLunatoIndex = currentLunatoIndex + offset;
  
  // Validar que el índice esté dentro del rango
  if (targetLunatoIndex < 0 || targetLunatoIndex >= allNewMoons.length - 1) {
    // Si está fuera del rango, retornar un calendario vacío/por defecto
    const fallbackDate = new Date(date);
    fallbackDate.setMonth(fallbackDate.getMonth() + offset);
    const fallbackCalendar = getOzkarCalendar(fallbackDate);
    
    return {
      lunato: fallbackCalendar.lunato,
      lunatoDozenal: toDozenal(fallbackCalendar.lunato),
      sol: fallbackCalendar.sol,
      solDozenal: fallbackCalendar.solDozenal,
      startDate: fallbackCalendar.lunatoStartDate,
      endDate: new Date(fallbackCalendar.lunatoStartDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      days: [],
      phases: {
        novLuno: [],
        prePlena: [],
        plena: [],
        preNova: []
      }
    };
  }
  
  const lunatoStart = allNewMoons[targetLunatoIndex];
  const lunatoEnd = allNewMoons[targetLunatoIndex + 1];
  
  // Calcular todos los días del lunato
  const days: LunatoDayInfo[] = [];
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  let currentDay = new Date(lunatoStart);
  let jorno = 1;
  
  while (currentDay < lunatoEnd) {
    const dayInfo: LunatoDayInfo = {
      jorno,
      jornoDozenal: toDozenal(jorno),
      civilDate: new Date(currentDay),
      lunarPhase: getLunarPhase(jorno),
      isToday: currentDay.toDateString() === currentDate.toDateString()
    };
    days.push(dayInfo);
    
    currentDay = new Date(currentDay.getTime() + 24 * 60 * 60 * 1000);
    jorno++;
  }
  
  // Organizar por fases
  const phases = {
    novLuno: days.filter(d => d.jorno <= 7),
    prePlena: days.filter(d => d.jorno > 7 && d.jorno <= 15),
    plena: days.filter(d => d.jorno > 15 && d.jorno <= 22),
    preNova: days.filter(d => d.jorno > 22)
  };
  
  // Calcular el Sol y Lunato para esta fecha
  const targetCalendar = getOzkarCalendar(lunatoStart);
  
  return {
    lunato: targetCalendar.lunato,
    lunatoDozenal: toDozenal(targetCalendar.lunato),
    sol: targetCalendar.sol,
    solDozenal: targetCalendar.solDozenal,
    startDate: lunatoStart,
    endDate: lunatoEnd,
    days,
    phases
  };
};

// Re-exportar para compatibilidad
export { toDozenal as formatDozenal };
