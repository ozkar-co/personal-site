/**
 * Utilidades para manejo de fechas en la aplicación
 */

/**
 * Convierte una fecha a formato ISO (YYYY-MM-DD) para inputs de tipo date
 */
export const toDateInputFormat = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  
  return dateObj.toISOString().split('T')[0];
};

/**
 * Convierte una fecha a formato legible en español
 */
export const toReadableDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Fecha inválida';
  }
  
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Obtiene la fecha actual en formato ISO (YYYY-MM-DD)
 */
export const getCurrentDateISO = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Valida si una fecha es válida
 */
export const isValidDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(dateObj.getTime());
};

/**
 * Convierte una fecha de input (YYYY-MM-DD) a objeto Date
 */
export const fromDateInputFormat = (dateString: string): Date => {
  const date = new Date(dateString + 'T00:00:00.000Z');
  return date;
}; 

/**
 * Muestra una fecha en formato ISO sin conversión de timezone
 * @param dateString - Fecha en formato ISO string (ej: "2025-08-12T00:00:00")
 * @param options - Opciones de formato para toLocaleDateString
 * @returns Fecha formateada sin conversión de timezone
 */
export const formatDateWithoutTimezone = (
  dateString: string, 
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
): string => {
  try {
    console.log('🔍 Input date:', dateString, typeof dateString);
    
    // Verificar que dateString sea un string válido
    if (!dateString || typeof dateString !== 'string') {
      console.warn('Invalid input:', dateString);
      return 'Fecha inválida';
    }
    
    // Extraer solo la parte de la fecha (YYYY-MM-DD) sin la hora
    const dateOnly = dateString.split('T')[0];
    console.log('Date only:', dateOnly);
    
    // Crear fecha local (no UTC) para evitar conversiones de timezone
    const [year, month, day] = dateOnly.split('-').map(Number);
    console.log('Components:', { year, month, day });
    
    // Crear fecha local, no UTC
    const date = new Date(year, month - 1, day);
    console.log('Created date:', date);
    
    // Validar que la fecha sea válida
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateString);
      return 'Fecha inválida';
    }
    
    const result = date.toLocaleDateString('es-ES', options);
    console.log('Result:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
    return 'Fecha inválida';
  }
};

/**
 * Muestra una fecha corta sin conversión de timezone
 * @param dateString - Fecha en formato ISO string
 * @returns Fecha formateada en formato corto
 */
export const formatShortDateWithoutTimezone = (dateString: string): string => {
  return formatDateWithoutTimezone(dateString, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}; 