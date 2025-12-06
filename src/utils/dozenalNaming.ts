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
        if (quotient === 1 && remaining === 0) {
          parts.push('zen');
        } else if (quotient === 1) {
          parts.push('zen');
        } else if (remaining === 0) {
          parts.push(numberToDigitName(quotient) + 'zen');
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
    
    if (isNaN(value)) return 'invalid';
    
    decimal = decimal * 12 + value;
  }
  
  return numberToWords(decimal);
};
