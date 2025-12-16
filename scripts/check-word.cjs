#!/usr/bin/env node

/**
 * Script to check morphology of a single word
 * Usage: node scripts/check-word.cjs <word>
 */

// Simple inline morphology analyzer for testing
// This is a simplified version that doesn't require TypeScript compilation

const ARTICLES = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas']);
const PRONOUNS = new Set(['yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'me', 'te', 'se', 'lo', 'la']);
const PREPOSITIONS = new Set(['a', 'de', 'en', 'con', 'por', 'para', 'sin', 'sobre', 'entre']);
const CONJUNCTIONS = new Set(['y', 'e', 'o', 'u', 'pero', 'sino', 'aunque', 'porque', 'si', 'cuando']);
const ADVERBS = new Set(['ahora', 'hoy', 'mañana', 'siempre', 'nunca', 'aquí', 'allí', 'bien', 'mal', 'muy', 'mucho']);

const PREFIXES = {
  'des': 'negation/reversal',
  're': 'repetition',
  'pre': 'before',
  'anti': 'against',
  'in': 'negation'
};

const SUFFIXES = {
  'mente': 'adverb',
  'ción': 'noun',
  'sión': 'noun',
  'dad': 'noun (quality)',
  'oso': 'adjective',
  'osa': 'adjective',
  'ito': 'diminutive',
  'ita': 'diminutive',
  'ón': 'augmentative'
};

function analyzeWord(word) {
  const normalized = word.toLowerCase().trim();
  const analysis = {
    word: word,
    normalized: normalized,
    partOfSpeech: 'unknown',
    morphemes: [],
    features: {}
  };

  // Determine part of speech
  if (ARTICLES.has(normalized)) {
    analysis.partOfSpeech = 'article';
  } else if (PRONOUNS.has(normalized)) {
    analysis.partOfSpeech = 'pronoun';
  } else if (PREPOSITIONS.has(normalized)) {
    analysis.partOfSpeech = 'preposition';
  } else if (CONJUNCTIONS.has(normalized)) {
    analysis.partOfSpeech = 'conjunction';
  } else if (ADVERBS.has(normalized)) {
    analysis.partOfSpeech = 'adverb';
  } else if (normalized.endsWith('mente')) {
    analysis.partOfSpeech = 'adverb';
  } else if (normalized.endsWith('ar') || normalized.endsWith('er') || normalized.endsWith('ir')) {
    if (normalized.length > 2) {
      analysis.partOfSpeech = 'verb';
      analysis.features.form = 'infinitive';
    }
  } else if (normalized.endsWith('ción') || normalized.endsWith('sión') || normalized.endsWith('dad')) {
    analysis.partOfSpeech = 'noun';
  } else if (normalized.endsWith('oso') || normalized.endsWith('osa')) {
    analysis.partOfSpeech = 'adjective';
  } else if (normalized.endsWith('amos') || normalized.endsWith('emos') || normalized.endsWith('imos')) {
    analysis.partOfSpeech = 'verb';
    analysis.features.person = '1st';
    analysis.features.number = 'plural';
  } else if (normalized.endsWith('o') || normalized.endsWith('a')) {
    analysis.partOfSpeech = 'noun';
  }

  // Identify morphemes
  let remaining = normalized;
  
  // Check for prefix
  for (const [prefix, meaning] of Object.entries(PREFIXES)) {
    if (remaining.startsWith(prefix) && remaining.length > prefix.length + 1) {
      analysis.morphemes.push({ type: 'prefix', value: prefix, meaning });
      remaining = remaining.slice(prefix.length);
      break;
    }
  }

  // Check for suffix
  const suffixEntries = Object.entries(SUFFIXES).sort((a, b) => b[0].length - a[0].length);
  for (const [suffix, meaning] of suffixEntries) {
    if (remaining.endsWith(suffix) && remaining.length > suffix.length) {
      const root = remaining.slice(0, -suffix.length);
      analysis.morphemes.push({ type: 'root', value: root });
      analysis.morphemes.push({ type: 'suffix', value: suffix, meaning });
      remaining = '';
      break;
    }
  }

  // Check for plural endings
  if (remaining && remaining.endsWith('es') && remaining.length > 2) {
    const root = remaining.slice(0, -2);
    analysis.morphemes.push({ type: 'root', value: root });
    analysis.morphemes.push({ type: 'ending', value: 'es', meaning: 'plural' });
    analysis.features.number = 'plural';
    remaining = '';
  } else if (remaining && remaining.endsWith('s') && remaining.length > 1) {
    const root = remaining.slice(0, -1);
    analysis.morphemes.push({ type: 'root', value: root });
    analysis.morphemes.push({ type: 'ending', value: 's', meaning: 'plural' });
    analysis.features.number = 'plural';
    remaining = '';
  }

  // If something remains, it's the root
  if (remaining && analysis.morphemes.length === 0) {
    analysis.morphemes.push({ type: 'root', value: remaining });
  } else if (remaining) {
    analysis.morphemes.push({ type: 'root', value: remaining });
  }

  // Extract gender
  if (normalized.endsWith('o') || normalized.endsWith('os')) {
    analysis.features.gender = 'masculine';
  } else if (normalized.endsWith('a') || normalized.endsWith('as')) {
    analysis.features.gender = 'feminine';
  }

  // Extract number if not already set
  if (!analysis.features.number) {
    if (normalized.endsWith('s')) {
      analysis.features.number = 'plural';
    } else {
      analysis.features.number = 'singular';
    }
  }

  return analysis;
}

function formatAnalysis(analysis) {
  const lines = [];
  
  lines.push('='.repeat(60));
  lines.push(`Morphological Analysis: "${analysis.word}"`);
  lines.push('='.repeat(60));
  lines.push('');
  lines.push(`Word:           ${analysis.word}`);
  lines.push(`Normalized:     ${analysis.normalized}`);
  lines.push(`Part of Speech: ${analysis.partOfSpeech}`);
  lines.push('');
  
  if (analysis.morphemes.length > 0) {
    lines.push('Morphemes:');
    for (const morpheme of analysis.morphemes) {
      const meaning = morpheme.meaning ? ` (${morpheme.meaning})` : '';
      lines.push(`  • ${morpheme.type.padEnd(10)} ${morpheme.value}${meaning}`);
    }
    lines.push('');
  }
  
  if (Object.keys(analysis.features).length > 0) {
    lines.push('Features:');
    for (const [key, value] of Object.entries(analysis.features)) {
      lines.push(`  • ${key.padEnd(10)} ${value}`);
    }
    lines.push('');
  }
  
  lines.push('='.repeat(60));
  
  return lines.join('\n');
}

// Main script
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node scripts/check-word.cjs <word>');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/check-word.cjs hablamos');
  console.log('  node scripts/check-word.cjs casas');
  console.log('  node scripts/check-word.cjs rápidamente');
  console.log('  node scripts/check-word.cjs deshacer');
  console.log('');
  process.exit(1);
}

const word = args[0];
const analysis = analyzeWord(word);
console.log(formatAnalysis(analysis));
