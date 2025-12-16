#!/usr/bin/env node

/**
 * Script to test the morphology analyzer with sample words
 * Usage: node scripts/test-morphology.cjs
 */

const fs = require('fs');
const path = require('path');

// Since we're using TypeScript modules, we'll need to load them differently
// For now, we'll create a simple inline implementation for testing

console.log('='.repeat(60));
console.log('Spanish Morphology Analyzer Test');
console.log('='.repeat(60));
console.log('');

// Test words covering different grammatical categories
const testWords = [
  // Nouns
  'casa',
  'casas',
  'gato',
  'gatos',
  'información',
  'libertad',
  
  // Verbs
  'hablar',
  'hablo',
  'hablamos',
  'hablaron',
  'comer',
  'como',
  'comimos',
  
  // Adjectives
  'bueno',
  'buena',
  'hermoso',
  'hermosa',
  
  // Adverbs
  'rápidamente',
  'lentamente',
  'siempre',
  
  // Function words
  'el',
  'la',
  'un',
  'de',
  'en',
  'y',
  
  // Words with prefixes/suffixes
  'deshacer',
  'rehacer',
  'gatito',
  'grandón'
];

console.log('Testing with sample words:');
console.log('-'.repeat(60));

// For the CommonJS test script, we'll just list the words and structure
// The actual analysis will be done by the TypeScript module
testWords.forEach((word, index) => {
  console.log(`${index + 1}. ${word}`);
});

console.log('');
console.log('-'.repeat(60));
console.log('');
console.log('To see detailed analysis, use the check-word script:');
console.log('  node scripts/check-word.cjs <word>');
console.log('');
console.log('Or import the analyzer in your TypeScript code:');
console.log('  import { analyzeWord } from "./src/utils/morphology";');
console.log('  const analysis = analyzeWord("hablamos");');
console.log('');
console.log('Grammar guide available at: data/quick_gramm.txt');
console.log('='.repeat(60));
