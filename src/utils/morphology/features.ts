/**
 * Step 4: Feature Extraction
 * Extracts grammatical features from words
 */

import { Gender, Number, VerbTense, Person, NounFeatures, VerbFeatures, AdjectiveFeatures, PartOfSpeech } from './types';

/**
 * Extracts gender from a noun or adjective
 */
export function extractGender(word: string): Gender {
  const normalized = word.toLowerCase();
  
  // Common masculine endings
  if (normalized.endsWith('o') || normalized.endsWith('os')) {
    return 'masculine';
  }
  
  // Common feminine endings
  if (normalized.endsWith('a') || normalized.endsWith('as')) {
    return 'feminine';
  }
  
  // Words ending in -e or consonants are often neutral/ambiguous
  return 'neutral';
}

/**
 * Extracts number from a word
 */
export function extractNumber(word: string): Number {
  const normalized = word.toLowerCase();
  
  // Plural markers
  if (normalized.endsWith('s') || normalized.endsWith('es')) {
    return 'plural';
  }
  
  return 'singular';
}

/**
 * Extracts verb tense (simplified)
 */
export function extractVerbTense(word: string, root: string): VerbTense {
  const normalized = word.toLowerCase();
  
  // Infinitive
  if (normalized.endsWith('ar') || normalized.endsWith('er') || normalized.endsWith('ir')) {
    return 'present'; // Consider infinitive as present base
  }
  
  // Preterite endings
  if (normalized.endsWith('é') || normalized.endsWith('ó') || 
      normalized.endsWith('aste') || normalized.endsWith('ió') ||
      normalized.endsWith('aron') || normalized.endsWith('ieron')) {
    return 'preterite';
  }
  
  // Present tense (default for many conjugations)
  return 'present';
}

/**
 * Extracts person and number from verb conjugation
 */
export function extractPersonAndNumber(word: string): { person: Person; number: Number } {
  const normalized = word.toLowerCase();
  
  // First person singular: -o
  if (normalized.endsWith('o') && !normalized.endsWith('ó')) {
    return { person: '1st', number: 'singular' };
  }
  
  // Second person singular: -as, -es
  if (normalized.endsWith('as') || normalized.endsWith('es')) {
    return { person: '2nd', number: 'singular' };
  }
  
  // Third person singular: -a, -e, -ó, -ió
  if (normalized.endsWith('a') || normalized.endsWith('e') || 
      normalized.endsWith('ó') || normalized.endsWith('ió')) {
    return { person: '3rd', number: 'singular' };
  }
  
  // First person plural: -amos, -emos, -imos
  if (normalized.endsWith('amos') || normalized.endsWith('emos') || normalized.endsWith('imos')) {
    return { person: '1st', number: 'plural' };
  }
  
  // Second person plural: -áis, -éis, -ís
  if (normalized.endsWith('áis') || normalized.endsWith('éis') || normalized.endsWith('ís')) {
    return { person: '2nd', number: 'plural' };
  }
  
  // Third person plural: -an, -en, -aron, -ieron
  if (normalized.endsWith('an') || normalized.endsWith('en') || 
      normalized.endsWith('aron') || normalized.endsWith('ieron')) {
    return { person: '3rd', number: 'plural' };
  }
  
  // Default
  return { person: '3rd', number: 'singular' };
}

/**
 * Determines verb conjugation type
 */
export function extractVerbConjugation(word: string, root: string): '-ar' | '-er' | '-ir' | 'irregular' {
  const normalized = word.toLowerCase();
  
  if (normalized.endsWith('ar') || root.endsWith('ar')) {
    return '-ar';
  }
  
  if (normalized.endsWith('er') || root.endsWith('er')) {
    return '-er';
  }
  
  if (normalized.endsWith('ir') || root.endsWith('ir')) {
    return '-ir';
  }
  
  // Try to infer from conjugated forms
  if (normalized.endsWith('amos') || normalized.endsWith('áis')) {
    return '-ar';
  }
  
  if (normalized.endsWith('emos') || normalized.endsWith('éis')) {
    return '-er';
  }
  
  if (normalized.endsWith('imos') || normalized.endsWith('ís')) {
    return '-ir';
  }
  
  return 'irregular';
}

/**
 * Extracts noun features
 */
export function extractNounFeatures(word: string): NounFeatures {
  return {
    gender: extractGender(word),
    number: extractNumber(word)
  };
}

/**
 * Extracts verb features
 */
export function extractVerbFeatures(word: string, root: string): VerbFeatures {
  const { person, number } = extractPersonAndNumber(word);
  
  return {
    conjugation: extractVerbConjugation(word, root),
    tense: extractVerbTense(word, root),
    person,
    number
  };
}

/**
 * Extracts adjective features
 */
export function extractAdjectiveFeatures(word: string): AdjectiveFeatures {
  return {
    gender: extractGender(word),
    number: extractNumber(word)
  };
}

/**
 * Extracts features based on part of speech
 */
export function extractFeatures(
  word: string, 
  root: string, 
  pos: PartOfSpeech
): NounFeatures | VerbFeatures | AdjectiveFeatures | undefined {
  switch (pos) {
    case 'noun':
      return extractNounFeatures(word);
    case 'verb':
      return extractVerbFeatures(word, root);
    case 'adjective':
      return extractAdjectiveFeatures(word);
    default:
      return undefined;
  }
}
