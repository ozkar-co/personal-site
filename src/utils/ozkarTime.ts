/**
 * OzkarTime - Sistema de tiempo personalizado
 * 
 * Este módulo implementa un sistema de medición de tiempo alternativo,
 * creado como experimento filosófico sobre cómo medimos nuestras vidas.
 * 
 * RELOJ DECIMAL (OzkarClock):
 * - 10 horas por día (en lugar de 24)
 * - 100 minutos por hora (en lugar de 60)
 * - 100 segundos por minuto
 * - Total: 100,000 "ozk-segundos" por día
 * - Un "ozk-segundo" = 0.864 segundos reales
 * 
 * CALENDARIO PERSONAL (OzkarCalendar):
 * - Año 0 comienza en el nacimiento (8 de enero de 1993)
 * - 13 meses de 28 días cada uno = 364 días
 * - 1-2 días especiales al final del año ("Días del Mago")
 * - Nombres de meses inspirados en conceptos personales
 */

// Fecha de nacimiento - Año 0 del calendario personal
const BIRTHDATE = new Date('1993-01-08T22:30:00-05:00');

// Nombres de los 13 meses del calendario OzkarTime
export const MONTH_NAMES = [
  'Genesis',      // Mes del nacimiento y nuevos comienzos
  'Codex',        // Mes del conocimiento y aprendizaje
  'Ignis',        // Mes del fuego y la pasión
  'Terra',        // Mes de la tierra y la estabilidad
  'Aqua',         // Mes del agua y la adaptabilidad
  'Ventus',       // Mes del viento y el cambio
  'Lumen',        // Mes de la luz y la claridad
  'Umbra',        // Mes de la sombra y la introspección
  'Nexus',        // Mes de las conexiones y relaciones
  'Arcanum',      // Mes de los misterios y lo oculto
  'Tempus',       // Mes del tiempo y la reflexión
  'Virtus',       // Mes de la virtud y el crecimiento
  'Infinitum'     // Mes del infinito y las posibilidades
];

// Nombres de los días de la semana (4 semanas de 7 días por mes)
export const DAY_NAMES = [
  'Solis',    // Día del Sol
  'Lunae',    // Día de la Luna
  'Martis',   // Día de Marte
  'Mercurii', // Día de Mercurio
  'Iovis',    // Día de Júpiter
  'Veneris',  // Día de Venus
  'Saturni'   // Día de Saturno
];

export interface OzkarClockTime {
  hours: number;        // 0-9
  minutes: number;      // 0-99
  seconds: number;      // 0-99
  formatted: string;    // "H:MM:SS"
  period: string;       // Descripción del período del día
}

export interface OzkarCalendarDate {
  year: number;         // Año personal (0 = nacimiento)
  month: number;        // 1-13
  monthName: string;    // Nombre del mes
  day: number;          // 1-28 (o día especial)
  dayOfWeek: number;    // 0-6
  dayName: string;      // Nombre del día
  isSpecialDay: boolean;// Si es un "Día del Mago"
  specialDayName?: string;
  formatted: string;    // "DD MonthName, Year X"
  season: string;       // Estación personal
}

/**
 * Convierte el tiempo actual a OzkarClock (tiempo decimal)
 * Un día tiene 100,000 "ozk-segundos"
 */
export const getOzkarClock = (date: Date = new Date()): OzkarClockTime => {
  // Calcular segundos transcurridos desde medianoche
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  
  const totalRealSeconds = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  const secondsInDay = 24 * 60 * 60;
  
  // Convertir a tiempo decimal (100,000 unidades por día)
  const totalOzkarSeconds = (totalRealSeconds / secondsInDay) * 100000;
  
  const ozkarHours = Math.floor(totalOzkarSeconds / 10000);
  const remainingAfterHours = totalOzkarSeconds % 10000;
  const ozkarMinutes = Math.floor(remainingAfterHours / 100);
  const ozkarSeconds = Math.floor(remainingAfterHours % 100);
  
  // Determinar período del día
  let period: string;
  if (ozkarHours < 2) {
    period = 'Aurora';       // 0-2: Amanecer
  } else if (ozkarHours < 4) {
    period = 'Prima Lux';    // 2-4: Primera luz
  } else if (ozkarHours < 5) {
    period = 'Meridiem';     // 4-5: Mediodía
  } else if (ozkarHours < 7) {
    period = 'Sol Cadens';   // 5-7: Sol cayendo
  } else if (ozkarHours < 9) {
    period = 'Crepusculum';  // 7-9: Crepúsculo
  } else {
    period = 'Nox';          // 9-10: Noche
  }
  
  const formatted = `${ozkarHours}:${ozkarMinutes.toString().padStart(2, '0')}:${ozkarSeconds.toString().padStart(2, '0')}`;
  
  return {
    hours: ozkarHours,
    minutes: ozkarMinutes,
    seconds: ozkarSeconds,
    formatted,
    period
  };
};

/**
 * Convierte una fecha a OzkarCalendar
 * - Año 0 = fecha de nacimiento
 * - 13 meses de 28 días
 * - Días especiales al final del año
 */
export const getOzkarCalendar = (date: Date = new Date()): OzkarCalendarDate => {
  // Calcular días transcurridos desde el nacimiento
  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.floor((date.getTime() - BIRTHDATE.getTime()) / msPerDay);
  
  // 13 meses de 28 días = 364 días, más 1-2 días especiales (365 o 366)
  const daysPerMonth = 28;
  const regularDays = 13 * daysPerMonth; // 364 días
  const daysPerYear = 365; // 364 días regulares + 1-2 días especiales
  
  // Calcular año personal
  const year = Math.floor(totalDays / daysPerYear);
  const dayOfYear = ((totalDays % daysPerYear) + daysPerYear) % daysPerYear; // Manejar negativos
  
  let month: number;
  let day: number;
  let isSpecialDay = false;
  let specialDayName: string | undefined;
  
  if (dayOfYear >= regularDays) {
    // Días especiales al final del año (día 364 = día especial 1, día 365+ = día especial 2)
    isSpecialDay = true;
    const specialDayNumber = dayOfYear - regularDays;
    if (specialDayNumber === 0) {
      specialDayName = 'Dies Arcana'; // Día del Mago
      day = 1;
    } else {
      specialDayName = 'Dies Infiniti'; // Día del Infinito (año bisiesto)
      day = 2;
    }
    month = 0;
  } else {
    month = Math.floor(dayOfYear / daysPerMonth) + 1;
    day = (dayOfYear % daysPerMonth) + 1;
  }
  
  // Día de la semana (basado en días totales desde el nacimiento)
  const dayOfWeek = ((totalDays % 7) + 7) % 7; // Manejar negativos
  
  // Determinar estación personal (basada en el mes)
  let season: string;
  if (month >= 1 && month <= 3) {
    season = 'Tempus Initium';     // Tiempo de Inicio
  } else if (month >= 4 && month <= 6) {
    season = 'Tempus Crescendo';   // Tiempo de Crecimiento
  } else if (month >= 7 && month <= 9) {
    season = 'Tempus Plenum';      // Tiempo de Plenitud
  } else if (month >= 10 && month <= 13) {
    season = 'Tempus Reflectionis';// Tiempo de Reflexión
  } else {
    season = 'Tempus Arcanum';     // Tiempo Arcano (días especiales, month === 0)
  }
  
  // Para días especiales (month === 0), usamos specialDayName directamente
  // Para días regulares, accedemos al array con índice válido (month - 1 donde month >= 1)
  const monthName = isSpecialDay ? (specialDayName || 'Dies Specialis') : MONTH_NAMES[month - 1];
  const dayName = DAY_NAMES[dayOfWeek];
  
  let formatted: string;
  if (isSpecialDay) {
    formatted = `${specialDayName}, Año ${year}`;
  } else {
    formatted = `${day} de ${monthName}, Año ${year}`;
  }
  
  return {
    year,
    month,
    monthName,
    day,
    dayOfWeek,
    dayName,
    isSpecialDay,
    specialDayName,
    formatted,
    season
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
 * Obtiene el progreso del año en porcentaje
 * El año tiene 365 días: 364 regulares (13 meses x 28 días) + 1-2 días especiales
 */
export const getYearProgress = (calendar: OzkarCalendarDate): number => {
  const daysPerYear = 365; // 364 días regulares + 1 día especial mínimo
  let dayOfYear: number;
  
  if (calendar.month > 0) {
    // Día regular: (meses completos * 28) + día actual
    dayOfYear = (calendar.month - 1) * 28 + calendar.day;
  } else {
    // Día especial: 364 días regulares + número del día especial
    dayOfYear = 364 + calendar.day;
  }
  
  return Math.min((dayOfYear / daysPerYear) * 100, 100);
};
