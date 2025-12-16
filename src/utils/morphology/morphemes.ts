/**
 * Step 2: Morpheme Identification
 * Identifies prefixes, roots, suffixes, and endings in Spanish words
 */

import { Morpheme } from './types';

// Common Spanish prefixes
const PREFIXES = {
  'des': 'negation/reversal',
  're': 'repetition/again',
  'pre': 'before',
  'anti': 'against',
  'inter': 'between',
  'sub': 'under',
  'super': 'above/over',
  'ex': 'former/out',
  'in': 'negation/in',
  'im': 'negation',
  'contra': 'against',
  'auto': 'self'
};

// Common Spanish suffixes
const SUFFIXES = {
  'mente': 'adverb formation',
  'ción': 'noun formation',
  'sión': 'noun formation',
  'dad': 'noun formation (quality)',
  'tad': 'noun formation (quality)',
  'oso': 'adjective (full of)',
  'osa': 'adjective (full of)',
  'ito': 'diminutive',
  'ita': 'diminutive',
  'ón': 'augmentative',
  'ona': 'augmentative',
  'ísimo': 'superlative',
  'ísima': 'superlative',
  'ería': 'place/activity',
  'ero': 'profession/agent',
  'era': 'profession/agent',
  'ador': 'agent',
  'adora': 'agent'
};

// Verb conjugation endings for -ar verbs (present)
const AR_PRESENT_ENDINGS = ['o', 'as', 'a', 'amos', 'áis', 'an'];
const AR_PRETERITE_ENDINGS = ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'];

// Verb conjugation endings for -er verbs (present)
const ER_PRESENT_ENDINGS = ['o', 'es', 'e', 'emos', 'éis', 'en'];
const ER_PRETERITE_ENDINGS = ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'];

// Verb conjugation endings for -ir verbs (present)
const IR_PRESENT_ENDINGS = ['o', 'es', 'e', 'imos', 'ís', 'en'];
const IR_PRETERITE_ENDINGS = ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'];

/**
 * Identifies morphemes in a word
 */
export function identifyMorphemes(word: string): Morpheme[] {
  const morphemes: Morpheme[] = [];
  let remaining = word;

  // Check for prefix
  for (const [prefix, meaning] of Object.entries(PREFIXES)) {
    if (remaining.startsWith(prefix) && remaining.length > prefix.length) {
      morphemes.push({ type: 'prefix', value: prefix, meaning });
      remaining = remaining.slice(prefix.length);
      break;
    }
  }

  // Check for suffix (check longer suffixes first)
  const suffixEntries = Object.entries(SUFFIXES).sort((a, b) => b[0].length - a[0].length);
  for (const [suffix, meaning] of suffixEntries) {
    if (remaining.endsWith(suffix) && remaining.length > suffix.length) {
      const root = remaining.slice(0, -suffix.length);
      morphemes.push({ type: 'root', value: root });
      morphemes.push({ type: 'suffix', value: suffix, meaning });
      return morphemes;
    }
  }

  // Check for verb endings
  const verbEnding = identifyVerbEnding(remaining);
  if (verbEnding) {
    const root = remaining.slice(0, -verbEnding.value.length);
    if (root.length > 0) {
      morphemes.push({ type: 'root', value: root });
      morphemes.push(verbEnding);
      return morphemes;
    }
  }

  // Check for plural endings
  if (remaining.endsWith('es') && remaining.length > 2) {
    const root = remaining.slice(0, -2);
    morphemes.push({ type: 'root', value: root });
    morphemes.push({ type: 'ending', value: 'es', meaning: 'plural' });
    return morphemes;
  }

  if (remaining.endsWith('s') && remaining.length > 1) {
    const root = remaining.slice(0, -1);
    morphemes.push({ type: 'root', value: root });
    morphemes.push({ type: 'ending', value: 's', meaning: 'plural' });
    return morphemes;
  }

  // If no special morphemes found, the whole word is the root
  morphemes.push({ type: 'root', value: remaining });

  return morphemes;
}

/**
 * Identifies verb endings
 */
function identifyVerbEnding(word: string): Morpheme | null {
  // Check -ar verb endings
  for (const ending of [...AR_PRESENT_ENDINGS, ...AR_PRETERITE_ENDINGS]) {
    if (word.endsWith(ending) && word.length > ending.length + 2) {
      const stem = word.slice(0, -ending.length);
      if (stem.endsWith('ar') || isLikelyVerbalStem(stem)) {
        return { type: 'ending', value: ending, meaning: 'verb conjugation' };
      }
    }
  }

  // Check -er verb endings
  for (const ending of [...ER_PRESENT_ENDINGS, ...ER_PRETERITE_ENDINGS]) {
    if (word.endsWith(ending) && word.length > ending.length + 2) {
      const stem = word.slice(0, -ending.length);
      if (stem.endsWith('er') || isLikelyVerbalStem(stem)) {
        return { type: 'ending', value: ending, meaning: 'verb conjugation' };
      }
    }
  }

  // Check -ir verb endings
  for (const ending of [...IR_PRESENT_ENDINGS, ...IR_PRETERITE_ENDINGS]) {
    if (word.endsWith(ending) && word.length > ending.length + 2) {
      const stem = word.slice(0, -ending.length);
      if (stem.endsWith('ir') || isLikelyVerbalStem(stem)) {
        return { type: 'ending', value: ending, meaning: 'verb conjugation' };
      }
    }
  }

  return null;
}

/**
 * Checks if a stem is likely to be a verb stem
 */
function isLikelyVerbalStem(stem: string): boolean {
  // Very simple heuristic - can be improved
  return stem.length >= 2;
}

/**
 * Gets the root of a word (without morphemes)
 */
export function getRoot(word: string): string {
  const morphemes = identifyMorphemes(word);
  const root = morphemes.find(m => m.type === 'root');
  return root ? root.value : word;
}
