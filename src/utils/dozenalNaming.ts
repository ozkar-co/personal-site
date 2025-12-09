/**
 * Dozenal Naming System
 * 
 * This module implements a naming system for dozenal (base-12) numbers
 * following the specified nomenclature rules.
 */

// Digit names (0-W)
const DIGIT_NAMES: { [key: string]: string } = {
  '0': 'zero',
  '1': 'un',
  '2': 'du',
  '3': 'tri',
  '4': 'quar',
  '5': 'kin',
  '6': 'ses',
  '7': 'sep',
  '8': 'ok',
  '9': 'non',
  'X': 'dek',
  'W': 'elv'
};

// Magnitude names (powers of 12)
interface Magnitude {
  value: number;
  name: string;
}

const MAGNITUDES: Magnitude[] = [
  { value: Math.pow(12, 9), name: 'miliardo' },
  { value: Math.pow(12, 6), name: 'milion' },
  { value: Math.pow(12, 3), name: 'mil' },
  { value: Math.pow(12, 2), name: 'grod' },
  { value: 12, name: 'zen' },
  { value: 1, name: '' }
];

/**
 * Converts a dozenal digit to its name
 */
export const digitToName = (digit: string): string => {
  return DIGIT_NAMES[digit.toUpperCase()] || '';
};

/**
 * Converts a number (0-11) to its dozenal digit name
 */
export const numberToDigitName = (num: number): string => {
  if (num < 0 || num > 11) return '';
  const digits = '0123456789XW';
  return DIGIT_NAMES[digits[num]];
};

/**
 * Converts a decimal number to its dozenal word representation
 * Following the specified naming rules
 */
export const numberToWords = (decimal: number): string => {
  if (decimal === 0) return 'zero';
  if (decimal < 0) return 'negative ' + numberToWords(-decimal);
  
  // Handle numbers less than 12 (single digit)
  if (decimal < 12) {
    return numberToDigitName(decimal);
  }
  
  // Handle zen (12-143)
  if (decimal < 144) {
    const zenCount = Math.floor(decimal / 12);
    const remainder = decimal % 12;
    
    if (zenCount === 1 && remainder === 0) return 'zen';
    if (zenCount === 1 && remainder > 0) return 'zen ' + numberToDigitName(remainder);
    if (zenCount > 1 && remainder === 0) return numberToDigitName(zenCount) + 'zen';
    return numberToDigitName(zenCount) + 'zen ' + numberToDigitName(remainder);
  }
  
  // Handle larger numbers recursively
  const parts: string[] = [];
  let remaining = decimal;
  
  for (const magnitude of MAGNITUDES) {
    if (remaining >= magnitude.value) {
      const quotient = Math.floor(remaining / magnitude.value);
      remaining = remaining % magnitude.value;
      
      if (magnitude.name === '') {
        // Units place
        if (quotient > 0) {
          parts.push(numberToDigitName(quotient));
        }
      } else if (magnitude.name === 'zen') {
        // Special handling for zen
        if (quotient === 1) {
          parts.push('zen');
        } else {
          parts.push(numberToDigitName(quotient) + 'zen');
        }
      } else if (magnitude.name === 'grod') {
        // Special handling for grod
        if (quotient < 12) {
          parts.push(numberToDigitName(quotient) + ' grod');
        } else {
          parts.push(numberToWords(quotient) + ' grod');
        }
      } else {
        // mil, milion, miliardo
        parts.push(numberToWords(quotient) + ' ' + magnitude.name);
      }
    }
  }
  
  return parts.join(' ');
};

/**
 * Converts a dozenal string to its word representation
 */
export const dozenalToWords = (dozenal: string): string => {
  // Convert dozenal string to decimal number
  let decimal = 0;
  const str = dozenal.toUpperCase().replace(/^Z/, '');
  
  for (let i = 0; i < str.length; i++) {
    const digit = str[i];
    let value: number;
    if (digit === 'X') value = 10;
    else if (digit === 'W') value = 11;
    else value = parseInt(digit, 10);
    
    if (isNaN(value)) return 'eroro';
    
    decimal = decimal * 12 + value;
  }
  
  return numberToWords(decimal);
};

/**
 * Reads the fractional part of a dozenal number
 * Groups digits in pairs and reads them as if they were numbers (0-143)
 * If a pair starts with 0, it must be explicitly named
 * If the last digit is alone, it's read individually
 */
export const readFractionalPart = (fractionalDigits: string): string => {
  const result: string[] = [];
  const str = fractionalDigits.toUpperCase();
  
  // Process in pairs
  for (let i = 0; i < str.length; i += 2) {
    if (i + 1 < str.length) {
      // We have a pair
      const digit1 = str[i];
      const digit2 = str[i + 1];
      
      // Convert pair to decimal number
      let value1 = DIGIT_NAMES[digit1] ? (digit1 === 'X' ? 10 : digit1 === 'W' ? 11 : parseInt(digit1, 10)) : 0;
      let value2 = DIGIT_NAMES[digit2] ? (digit2 === 'X' ? 10 : digit2 === 'W' ? 11 : parseInt(digit2, 10)) : 0;
      
      const pairValue = value1 * 12 + value2;
      
      // Read the pair as a number
      result.push(numberToWords(pairValue));
    } else {
      // Last digit alone
      const digit = str[i];
      const name = DIGIT_NAMES[digit];
      if (name) {
        result.push(name);
      }
    }
  }
  
  return result.join(' ');
};

/**
 * Converts a complete dozenal number (with fractional part) to words
 * Format: "5,3" → "kin koma tri"
 * Format: "5,38" → "kin koma quarzen" (38 dozenal = 44 decimal)
 */
export const dozenalWithFractionalToWords = (dozenal: string): string => {
  // Split by comma or point
  const parts = dozenal.split(/[.,]/);
  
  if (parts.length === 1) {
    // No fractional part
    return dozenalToWords(parts[0]);
  }
  
  // Integer part
  const integerWords = dozenalToWords(parts[0]);
  
  // Fractional part - read in pairs
  const fractionalWords = readFractionalPart(parts[1]);
  
  return `${integerWords} koma ${fractionalWords}`;
};
