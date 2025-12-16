/**
 * Step 3: Part of Speech Tagging
 * Determines the grammatical category of words
 */

import { PartOfSpeech } from './types';
import { removeAccents } from './tokenizer';

// Common Spanish articles
const ARTICLES = new Set([
  'el', 'la', 'los', 'las',
  'un', 'una', 'unos', 'unas'
]);

// Common Spanish pronouns
const PRONOUNS = new Set([
  'yo', 'tú', 'tu', 'él', 'ella', 'nosotros', 'nosotras',
  'vosotros', 'vosotras', 'ellos', 'ellas', 'usted', 'ustedes',
  'me', 'te', 'se', 'lo', 'la', 'le', 'nos', 'os', 'los', 'las', 'les',
  'mí', 'mi', 'ti', 'sí'
]);

// Common Spanish prepositions
const PREPOSITIONS = new Set([
  'a', 'ante', 'bajo', 'con', 'contra', 'de', 'desde', 'durante',
  'en', 'entre', 'hacia', 'hasta', 'para', 'por', 'según', 'sin',
  'sobre', 'tras', 'mediante', 'versus', 'vía'
]);

// Common Spanish conjunctions
const CONJUNCTIONS = new Set([
  'y', 'e', 'o', 'u', 'pero', 'mas', 'sino', 'aunque', 'porque',
  'pues', 'si', 'cuando', 'como', 'que', 'ni'
]);

// Common adverbs of time, place, manner
const ADVERBS = new Set([
  'ahora', 'hoy', 'ayer', 'mañana', 'siempre', 'nunca', 'jamás',
  'aquí', 'ahí', 'allí', 'acá', 'allá', 'arriba', 'abajo', 'dentro', 'fuera',
  'bien', 'mal', 'así', 'también', 'tampoco', 'sí', 'no', 'muy', 'mucho',
  'poco', 'bastante', 'demasiado', 'más', 'menos', 'tan', 'tanto'
]);

/**
 * Determines the part of speech of a word
 */
export function tagPartOfSpeech(word: string): PartOfSpeech {
  const normalized = word.toLowerCase();
  const noAccents = removeAccents(normalized);

  // Check function words first (closed classes)
  if (ARTICLES.has(normalized) || ARTICLES.has(noAccents)) {
    return 'article';
  }

  if (PRONOUNS.has(normalized) || PRONOUNS.has(noAccents)) {
    return 'pronoun';
  }

  if (PREPOSITIONS.has(normalized) || PREPOSITIONS.has(noAccents)) {
    return 'preposition';
  }

  if (CONJUNCTIONS.has(normalized) || CONJUNCTIONS.has(noAccents)) {
    return 'conjunction';
  }

  if (ADVERBS.has(normalized) || ADVERBS.has(noAccents)) {
    return 'adverb';
  }

  // Check for adverbs ending in -mente
  if (normalized.endsWith('mente')) {
    return 'adverb';
  }

  // Check for verb infinitives
  if (normalized.endsWith('ar') || normalized.endsWith('er') || normalized.endsWith('ir')) {
    if (normalized.length > 2) {
      return 'verb';
    }
  }

  // Check for verb conjugations (very simplified)
  if (isLikelyConjugatedVerb(normalized)) {
    return 'verb';
  }

  // Check for nouns with common endings
  if (normalized.endsWith('ción') || normalized.endsWith('sión') || 
      normalized.endsWith('dad') || normalized.endsWith('tad') ||
      normalized.endsWith('miento') || normalized.endsWith('aje')) {
    return 'noun';
  }

  // Check for adjectives with common endings
  if (normalized.endsWith('oso') || normalized.endsWith('osa') ||
      normalized.endsWith('ivo') || normalized.endsWith('iva') ||
      normalized.endsWith('able') || normalized.endsWith('ible')) {
    return 'adjective';
  }

  // Default heuristics based on endings
  if (normalized.endsWith('o') || normalized.endsWith('a')) {
    // Could be noun or adjective, default to noun
    return 'noun';
  }

  if (normalized.endsWith('s') || normalized.endsWith('es')) {
    // Likely plural noun or adjective
    return 'noun';
  }

  return 'unknown';
}

/**
 * Checks if a word is likely a conjugated verb
 */
function isLikelyConjugatedVerb(word: string): boolean {
  // Check common verb endings
  const verbEndings = [
    // -ar present: o, as, a, amos, áis, an
    'amos', 'áis',
    // -er/-ir present: o, es, e, emos/imos, éis/ís, en
    'emos', 'éis', 'imos', 'ís',
    // preterite: é, aste, ó, imos, isteis, aron/ieron
    'aste', 'asteis', 'aron', 'ieron', 'isteis'
  ];

  for (const ending of verbEndings) {
    if (word.endsWith(ending) && word.length > ending.length + 1) {
      return true;
    }
  }

  return false;
}

/**
 * Determines if a word is a noun
 */
export function isNoun(pos: PartOfSpeech): boolean {
  return pos === 'noun';
}

/**
 * Determines if a word is a verb
 */
export function isVerb(pos: PartOfSpeech): boolean {
  return pos === 'verb';
}

/**
 * Determines if a word is an adjective
 */
export function isAdjective(pos: PartOfSpeech): boolean {
  return pos === 'adjective';
}
