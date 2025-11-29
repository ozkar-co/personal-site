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
 *    - Sol 0 comienza en el solsticio de invierno de diciembre 1992
 *    - Sol 0 = año 1993 (desde solsticio dic 1992 hasta solsticio dic 1993)
 *    - Sol 1 = año 1994 (desde solsticio dic 1993 hasta solsticio dic 1994)
 *    - Fechas antes del solsticio de dic 1992 tienen Sol negativo
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

// Constelaciones zodiacales
export interface ZodiacConstellation {
  name: string;           // "Sagitario"
  nameShort: string;      // "Sag"
  image: string;          // Nombre del archivo de imagen
  start: number;          // Longitud eclíptica inicial (grados)
  end: number;            // Longitud eclíptica final (grados)
}

export const ZODIAC_CONSTELLATIONS: ZodiacConstellation[] = [
  { name: 'Capricornio', nameShort: 'Cap', start: 270, end: 300, image: 'Capricornus_symbol_(fixed_width).svg.png' },
  { name: 'Acuario',     nameShort: 'Acu', start: 300, end: 330, image: 'Aquarius_symbol_(fixed_width).svg.png' },
  { name: 'Piscis',      nameShort: 'Pis', start: 330, end: 360, image: 'Pisces_symbol_(fixed_width).svg.png' },
  { name: 'Aries',       nameShort: 'Ari', start: 0,   end: 30,  image: 'Aries_symbol_(fixed_width).svg.png' },
  { name: 'Cetus',       nameShort: 'Cet', start: 15,  end: 45,  image: 'Cetus_symbol_(fixed_width).svg.png' },
  { name: 'Tauro',       nameShort: 'Tau', start: 30,  end: 60,  image: 'Taurus_symbol_(fixed_width).svg.png' },
  { name: 'Géminis',     nameShort: 'Gém', start: 60,  end: 90,  image: 'Gemini_symbol_(fixed_width).svg.png' },
  { name: 'Cáncer',      nameShort: 'Cán', start: 90,  end: 120, image: 'Cancer_symbol_(fixed_width).svg.png' },
  { name: 'Leo',         nameShort: 'Leo', start: 120, end: 150, image: 'Leo_symbol_(fixed_width).svg.png' },
  { name: 'Virgo',       nameShort: 'Vir', start: 150, end: 180, image: 'Virgo_symbol_(fixed_width).svg.png' },
  { name: 'Libra',       nameShort: 'Lib', start: 180, end: 210, image: 'Libra_symbol_(fixed_width).svg.png' },
  { name: 'Escorpio',    nameShort: 'Esc', start: 210, end: 240, image: 'Scorpius_symbol_(fixed_width).svg.png' },
  { name: 'Ofiuco',      nameShort: 'Ofi', start: 240, end: 270, image: 'Ophiuchus_symbol_(fixed_width).svg.png' },
  { name: 'Sagitario',   nameShort: 'Sag', start: 265, end: 275, image: 'Sagittarius_symbol_(fixed_width).svg.png' }
];

/**
 * Obtiene la constelación para un número de lunato específico
 * La asignación es fija (sin repeticiones):
 * - Lunato 0: Sagitario (♐)
 * - Lunato 1: Capricornio (♑)
 * - Lunato 2: Acuario (♒)
 * - Lunato 3: Piscis (♓)
 * - Lunato 4: Aries (♈)
 * - Lunato 5: Cetus (🐋) - Ballena
 * - Lunato 6: Tauro (♉)
 * - Lunato 7: Géminis (♊)
 * - Lunato 8: Cáncer (♋)
 * - Lunato 9: Leo (♌)
 * - Lunato X (10): Virgo (♍)
 * - Lunato W (11): Libra (♎)
 * - Lunato 12: Escorpio (♏)
 * - Lunato 13: Ofiuco (⛎)
 */
export const getConstellationForLunato = (lunatoNumber: number): ZodiacConstellation => {
  // Array ordenado según la secuencia de lunatos (0-13)
  const lunatoSequence = [
    13, // Lunato 0: Sagitario (índice 13 en ZODIAC_CONSTELLATIONS)
    0,  // Lunato 1: Capricornio
    1,  // Lunato 2: Acuario
    2,  // Lunato 3: Piscis
    3,  // Lunato 4: Aries
    4,  // Lunato 5: Cetus
    5,  // Lunato 6: Tauro
    6,  // Lunato 7: Géminis
    7,  // Lunato 8: Cáncer
    8,  // Lunato 9: Leo
    9,  // Lunato 10 (X): Virgo
    10, // Lunato 11 (W): Libra
    11, // Lunato 12: Escorpio
    12  // Lunato 13: Ofiuco
  ];
  
  if (lunatoNumber >= 0 && lunatoNumber < lunatoSequence.length) {
    return ZODIAC_CONSTELLATIONS[lunatoSequence[lunatoNumber]];
  }
  
  // Fallback
  return ZODIAC_CONSTELLATIONS[13]; // Sagitario
};

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
  constellation: ZodiacConstellation; // Constelación zodiacal del lunato
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
 * Calcula la longitud eclíptica del Sol para una fecha dada
 * Basado en la fórmula simplificada de Jean Meeus
 * @param date Fecha para la cual calcular la posición solar
 * @returns Longitud eclíptica en grados (0-360)
 */
const getSolarLongitude = (date: Date): number => {
  // Referencia: J2000 (1 de enero de 2000, 12:00 UTC)
  const J2000 = new Date('2000-01-01T12:00:00Z');
  const daysSinceJ2000 = (date.getTime() - J2000.getTime()) / (24 * 60 * 60 * 1000);
  
  // Número de siglos julianos desde J2000
  const T = daysSinceJ2000 / 36525;
  
  // Longitud media del Sol (simplificada)
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  
  // Anomalía media
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const M_rad = (M * Math.PI) / 180;
  
  // Ecuación del centro
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M_rad)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * M_rad)
          + 0.000289 * Math.sin(3 * M_rad);
  
  // Longitud verdadera
  let longitude = (L0 + C) % 360;
  if (longitude < 0) longitude += 360;
  
  return longitude;
};

/**
 * Obtiene la constelación zodiacal para una fecha dada
 * basándose en la posición del Sol en la eclíptica
 * @param date Fecha para determinar la constelación
 * @returns Objeto ZodiacConstellation correspondiente
 */
export const getConstellation = (date: Date): ZodiacConstellation => {
  const longitude = getSolarLongitude(date);
  
  // Buscar la constelación que corresponde a esta longitud
  for (const constellation of ZODIAC_CONSTELLATIONS) {
    // Manejo especial para Piscis (cruza el 0°)
    if (constellation.name === 'Piscis') {
      if (longitude >= constellation.start || longitude < constellation.end % 360) {
        return constellation;
      }
    }
    // Manejo especial para Sagitario (se superpone ligeramente con Ofiuco)
    else if (constellation.name === 'Sagitario') {
      if (longitude >= constellation.start) {
        return constellation;
      }
    }
    // Resto de constelaciones
    else if (longitude >= constellation.start && longitude < constellation.end) {
      return constellation;
    }
  }
  
  // Fallback (no debería ocurrir, pero por seguridad)
  return ZODIAC_CONSTELLATIONS[0]; // Capricornio
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
 * 
 * Reglas:
 * - Lunato 0: Primera luna nueva antes o igual al solsticio. Siempre incluye el solsticio.
 * - Lunato 1: Primera luna nueva DESPUÉS del solsticio.
 * - Lunato 2-11: Lunas nuevas sucesivas.
 * - Lunato 12 (o 13): Último lunato del Sol. Incluye el SIGUIENTE solsticio.
 * 
 * Excepción: Si el solsticio cae exactamente en luna nueva, ese es el Lunato 0.
 */
const getLunatoInfo = (date: Date, solstice: Date): { lunato: number; jorno: number; lunatoStart: Date } => {
  const year = date.getFullYear();
  
  // Obtener lunas nuevas de 3 años (anterior, actual, siguiente)
  const prevYearNewMoons = getNewMoonDates(year - 1);
  const currentYearNewMoons = getNewMoonDates(year);
  const nextYearNewMoons = getNewMoonDates(year + 1);
  
  const allNewMoons = [...prevYearNewMoons, ...currentYearNewMoons, ...nextYearNewMoons];
  allNewMoons.sort((a, b) => a.getTime() - b.getTime());
  
  // Caso especial: si el solsticio cae en luna nueva (mismo día)
  const solsticeOnNewMoon = allNewMoons.find(
    moon => moon.toDateString() === solstice.toDateString()
  );
  
  let lunato0Start: Date;
  
  if (solsticeOnNewMoon) {
    // El solsticio ES luna nueva, ese es el Lunato 0
    lunato0Start = solsticeOnNewMoon;
  } else {
    // Buscar la luna nueva inmediatamente ANTERIOR al solsticio
    let foundStart: Date | null = null;
    for (let i = allNewMoons.length - 1; i >= 0; i--) {
      if (allNewMoons[i] < solstice) {
        foundStart = allNewMoons[i];
        break;
      }
    }
    lunato0Start = foundStart || solstice; // Fallback al solsticio si no hay luna anterior
  }
  
  // Encontrar el índice del Lunato 0 en el array
  const lunato0Index = allNewMoons.findIndex(
    moon => Math.abs(moon.getTime() - lunato0Start.getTime()) < 1000 * 60 * 60 // Tolerancia de 1 hora
  );
  
  if (lunato0Index === -1) {
    return { lunato: 0, jorno: 1, lunatoStart: lunato0Start };
  }
  
  // Determinar en qué lunato está la fecha
  for (let i = lunato0Index; i < allNewMoons.length - 1; i++) {
    const currentLunatoStart = allNewMoons[i];
    const nextLunatoStart = allNewMoons[i + 1];
    
    if (date >= currentLunatoStart && date < nextLunatoStart) {
      const lunato = i - lunato0Index;
      const daysSinceLunatoStart = Math.floor(
        (date.getTime() - currentLunatoStart.getTime()) / (24 * 60 * 60 * 1000)
      );
      const jorno = daysSinceLunatoStart + 1;
      
      return { lunato, jorno, lunatoStart: currentLunatoStart };
    }
  }
  
  // Si llegamos aquí, estamos en el último lunato del array
  const lastIndex = allNewMoons.length - 1;
  const lunatoStart = allNewMoons[lastIndex];
  const lunato = lastIndex - lunato0Index;
  const daysSinceLunatoStart = Math.floor(
    (date.getTime() - lunatoStart.getTime()) / (24 * 60 * 60 * 1000)
  );
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
 * - Sol = año solar desde el solsticio de invierno de diciembre 1992
 * - Sol 0 = solsticio dic 1992 a solsticio dic 1993 (año 1993)
 * - Sol 1 = solsticio dic 1993 a solsticio dic 1994 (año 1994)
 * - Lunato = mes lunar (luna nueva a luna nueva), 0 = lunato de transición
 * - Jorno = día dentro del lunato
 */
export const getOzkarCalendar = (date: Date = new Date()): OzkarCalendarDate => {
  const currentYear = date.getFullYear();
  
  // Calcular Sol (año solar personal)
  // Sol 0 comienza en el solsticio de invierno de diciembre 1992
  // Esto hace que todo 1993 (desde dic 1992 hasta dic 1993) sea Sol 0
  const sol0Year = 1992;
  
  // Encontrar el solsticio de invierno más reciente antes de la fecha actual
  let recentSolstice: Date;
  const currentYearSolstice = getWinterSolstice(currentYear);
  
  if (date >= currentYearSolstice) {
    recentSolstice = currentYearSolstice;
  } else {
    recentSolstice = getWinterSolstice(currentYear - 1);
  }
  
  // Calcular cuántos años solares han pasado desde diciembre 1992
  // Sol 0 = solsticio diciembre 1992
  // Sol 1 = solsticio diciembre 1993
  // Sol 2 = solsticio diciembre 1994, etc.
  // Fechas antes de dic 1992 tendrán Sol negativo
  const sol = recentSolstice.getFullYear() - sol0Year;
  
  // Obtener información del lunato
  const { lunato, jorno, lunatoStart } = getLunatoInfo(date, recentSolstice);
  
  // Obtener fase lunar
  const lunarPhase = getLunarPhase(jorno);
  
  // Obtener constelación zodiacal basada en el número de lunato
  const constellation = getConstellationForLunato(lunato);
  
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
    constellation,
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
  isSolstice: boolean;     // Si es el día del solsticio de invierno
  belongsToCurrentSol: boolean; // Si el día pertenece al Sol actual (o al anterior/siguiente)
}

/**
 * Información completa de un lunato para el calendario
 */
export interface LunatoCalendarInfo {
  lunato: number;
  lunatoDozenal: string;   // Lunato en formato dozenal
  sol: number;
  solDozenal: string;      // Sol en formato dozenal
  constellation: ZodiacConstellation; // Constelación zodiacal del lunato
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
 * Obtiene el lunato para un Sol y número de lunato específicos
 * @param sol - Número del Sol (0 = año 1993)
 * @param lunatoNumber - Número del lunato dentro del Sol (0-12 o 0-13)
 */
export const getLunatoForSol = (sol: number, lunatoNumber: number): LunatoCalendarInfo => {
  // Calcular el solsticio que define este Sol
  const sol0Year = 1992;
  const solsticeYear = sol0Year + sol;
  const solstice = getWinterSolstice(solsticeYear);
  
  // Obtener lunas nuevas alrededor del solsticio
  const newMoons: Date[] = [];
  for (let y = solsticeYear - 1; y <= solsticeYear + 2; y++) {
    newMoons.push(...getNewMoonDates(y));
  }
  newMoons.sort((a, b) => a.getTime() - b.getTime());
  
  // Encontrar el Lunato 0 (primera luna nueva antes o en el solsticio)
  const solsticeOnNewMoon = newMoons.find(
    moon => moon.toDateString() === solstice.toDateString()
  );
  
  let lunato0Start: Date;
  if (solsticeOnNewMoon) {
    lunato0Start = solsticeOnNewMoon;
  } else {
    let foundStart: Date | null = null;
    for (let i = newMoons.length - 1; i >= 0; i--) {
      if (newMoons[i] < solstice) {
        foundStart = newMoons[i];
        break;
      }
    }
    lunato0Start = foundStart || solstice;
  }
  
  // Encontrar el índice del Lunato 0
  const lunato0Index = newMoons.findIndex(
    moon => Math.abs(moon.getTime() - lunato0Start.getTime()) < 1000 * 60 * 60
  );
  
  if (lunato0Index === -1 || lunato0Index + lunatoNumber >= newMoons.length - 1) {
    throw new Error(`No se puede calcular el lunato ${lunatoNumber} para el Sol ${sol}`);
  }
  
  // Obtener el inicio y fin del lunato solicitado
  const lunatoStart = newMoons[lunato0Index + lunatoNumber];
  const lunatoEnd = newMoons[lunato0Index + lunatoNumber + 1];
  
  return buildLunatoCalendar(sol, lunatoNumber, solstice, lunatoStart, lunatoEnd);
};

/**
 * Cuenta cuántos lunatos tiene un Sol específico
 */
export const countLunatosInSol = (sol: number): number => {
  const sol0Year = 1992;
  const solsticeYear = sol0Year + sol;
  const solstice = getWinterSolstice(solsticeYear);
  const nextSolstice = getWinterSolstice(solsticeYear + 1);
  
  // Obtener lunas nuevas entre los dos solsticios
  const newMoons: Date[] = [];
  for (let y = solsticeYear - 1; y <= solsticeYear + 2; y++) {
    newMoons.push(...getNewMoonDates(y));
  }
  newMoons.sort((a, b) => a.getTime() - b.getTime());
  
  // Encontrar Lunato 0
  const solsticeOnNewMoon = newMoons.find(
    moon => moon.toDateString() === solstice.toDateString()
  );
  
  let lunato0Start: Date;
  if (solsticeOnNewMoon) {
    lunato0Start = solsticeOnNewMoon;
  } else {
    let foundStart: Date | null = null;
    for (let i = newMoons.length - 1; i >= 0; i--) {
      if (newMoons[i] < solstice) {
        foundStart = newMoons[i];
        break;
      }
    }
    lunato0Start = foundStart || solstice;
  }
  
  // Contar lunatos hasta encontrar uno que contenga el siguiente solstice
  let count = 0;
  const lunato0Index = newMoons.findIndex(
    moon => Math.abs(moon.getTime() - lunato0Start.getTime()) < 1000 * 60 * 60
  );
  
  for (let i = lunato0Index; i < newMoons.length - 1; i++) {
    const lunatoStart = newMoons[i];
    const lunatoEnd = newMoons[i + 1];
    
    count++;
    
    // Si este lunato contiene el siguiente solstice, es el último
    if (lunatoStart <= nextSolstice && lunatoEnd > nextSolstice) {
      break;
    }
  }
  
  return count;
};

/**
 * Obtiene la información completa de un lunato para el calendario
 * DEPRECATED: Usar getLunatoForSol en su lugar
 */
export const getLunatoCalendarInfo = (date: Date = new Date(), offset: number = 0): LunatoCalendarInfo => {
  const calendar = getOzkarCalendar(date);
  const year = date.getFullYear();
  
  // Generar lunas nuevas para un rango amplio (10 años antes y después)
  // Esto permite navegar libremente sin restricciones artificiales
  const years = [];
  for (let y = year - 10; y <= year + 10; y++) {
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
  
  // Si estamos fuera del rango, generar datos para ese rango específico
  if (targetLunatoIndex < 0 || targetLunatoIndex >= allNewMoons.length - 1) {
    // Calcular la fecha aproximada del lunato objetivo
    const targetDate = new Date(date);
    // Aproximadamente 29.53 días por lunato
    targetDate.setDate(targetDate.getDate() + (offset * 29.53));
    
    const targetYear = targetDate.getFullYear();
    
    // Generar lunas nuevas para ese año y los adyacentes
    const extendedYears = [];
    for (let y = targetYear - 2; y <= targetYear + 2; y++) {
      extendedYears.push(...getNewMoonDates(y));
    }
    extendedYears.sort((a, b) => a.getTime() - b.getTime());
    
    // Encontrar el lunato más cercano a la fecha objetivo
    const targetLunatoIdx = extendedYears.findIndex(moon => moon > targetDate);
    const actualIdx = targetLunatoIdx > 0 ? targetLunatoIdx - 1 : 0;
    
    if (actualIdx >= 0 && actualIdx < extendedYears.length - 1) {
      const lunatoStart = extendedYears[actualIdx];
      const lunatoEnd = extendedYears[actualIdx + 1];
      
      // Calcular parámetros para buildLunatoCalendar
      const currentYear = lunatoStart.getFullYear();
      const currentYearSolstice = getWinterSolstice(currentYear);
      const prevYearSolstice = getWinterSolstice(currentYear - 1);
      const solstice = lunatoStart >= currentYearSolstice ? currentYearSolstice : prevYearSolstice;
      const { lunato: lunatoNumber } = getLunatoInfo(lunatoStart, solstice);
      const sol0Year = 1992;
      const sol = solstice.getFullYear() - sol0Year;
      
      return buildLunatoCalendar(sol, lunatoNumber, solstice, lunatoStart, lunatoEnd);
    }
  }
  
  const lunatoStart = allNewMoons[targetLunatoIndex];
  const lunatoEnd = allNewMoons[targetLunatoIndex + 1];
  
  // Calcular parámetros para buildLunatoCalendar
  const currentYear = lunatoStart.getFullYear();
  const currentYearSolstice = getWinterSolstice(currentYear);
  const prevYearSolstice = getWinterSolstice(currentYear - 1);
  const solstice = lunatoStart >= currentYearSolstice ? currentYearSolstice : prevYearSolstice;
  const { lunato: lunatoNumber } = getLunatoInfo(lunatoStart, solstice);
  const sol0Year = 1992;
  const sol = solstice.getFullYear() - sol0Year;
  
  return buildLunatoCalendar(sol, lunatoNumber, solstice, lunatoStart, lunatoEnd);
};

/**
 * Construye la información del calendario de un lunato
 * @param sol - Número del Sol al que pertenece este lunato
 * @param lunatoNumber - Número del lunato (0-12 o 0-13)
 * @param solstice - Solsticio que define este Sol
 * @param lunatoStart - Fecha de inicio del lunato (luna nueva)
 * @param lunatoEnd - Fecha de fin del lunato (siguiente luna nueva)
 */
const buildLunatoCalendar = (
  sol: number,
  lunatoNumber: number,
  solstice: Date,
  lunatoStart: Date, 
  lunatoEnd: Date
): LunatoCalendarInfo => {
  // Calcular todos los días del lunato
  const days: LunatoDayInfo[] = [];
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  // El siguiente solsticio (para detectar si es el último lunato del Sol)
  const nextSolstice = getWinterSolstice(solstice.getFullYear() + 1);
  
  // Verificar qué solsticio contiene este lunato (si alguno)
  const containsThisSolstice = (lunatoStart <= solstice && lunatoEnd > solstice);
  const containsNextSolstice = (lunatoStart <= nextSolstice && lunatoEnd > nextSolstice);
  
  let currentDay = new Date(lunatoStart);
  let jorno = 1;
  
  while (currentDay < lunatoEnd) {
    // Verificar si es el día del solsticio
    const isSolsticeDay = currentDay.toDateString() === solstice.toDateString() ||
                          currentDay.toDateString() === nextSolstice.toDateString();
    
    // Determinar si pertenece al Sol actual según las reglas:
    // - Si es Lunato 0 (primero) y contiene el solsticio de inicio: gris ANTES del solsticio (SIN incluir el solsticio)
    // - Si es el último lunato y contiene el siguiente solsticio: gris DESPUÉS del solsticio (INCLUYENDO el solsticio)
    // - En todos los demás casos: todos los días pertenecen al Sol actual
    let belongsToCurrentSol = true;
    
    if (lunatoNumber === 0 && containsThisSolstice) {
      // Lunato 0: días antes del solsticio son del Sol anterior
      // El solsticio mismo pertenece al nuevo Sol
      belongsToCurrentSol = currentDay >= solstice;
    } else if (containsNextSolstice) {
      // Último lunato: días después del solsticio (incluyendo el solsticio) son del Sol siguiente
      belongsToCurrentSol = currentDay < nextSolstice;
    }
    
    const dayInfo: LunatoDayInfo = {
      jorno,
      jornoDozenal: toDozenal(jorno),
      civilDate: new Date(currentDay),
      lunarPhase: getLunarPhase(jorno),
      isToday: currentDay.toDateString() === currentDate.toDateString(),
      isSolstice: isSolsticeDay,
      belongsToCurrentSol
    };
    days.push(dayInfo);
    
    currentDay = new Date(currentDay.getTime() + 24 * 60 * 60 * 1000);
    jorno++;
  }
  
  // Obtener constelación zodiacal basada en el número de lunato (asignación fija)
  const constellation = getConstellationForLunato(lunatoNumber);
  
  // Organizar por fases
  const phases = {
    novLuno: days.filter(d => d.jorno <= 7),
    prePlena: days.filter(d => d.jorno > 7 && d.jorno <= 15),
    plena: days.filter(d => d.jorno > 15 && d.jorno <= 22),
    preNova: days.filter(d => d.jorno > 22)
  };
  
  return {
    lunato: lunatoNumber,
    lunatoDozenal: toDozenal(lunatoNumber),
    sol: sol,
    solDozenal: toDozenal(sol),
    constellation: constellation,
    startDate: lunatoStart,
    endDate: lunatoEnd,
    days,
    phases
  };
};

// Re-exportar para compatibilidad
export { toDozenal as formatDozenal };
