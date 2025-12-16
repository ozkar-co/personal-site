/**
 * Example usage of the morphology analyzer
 * This file demonstrates how to use the analyzer in TypeScript code
 */

import { analyzeWord, analyzeText, formatAnalysis, getAnalysisSummary } from './analyzer';

// Example 1: Analyze a single word
console.log('Example 1: Analyzing a single word');
console.log('=====================================');
const analysis1 = analyzeWord('hablamos');
console.log(formatAnalysis(analysis1));
console.log('');

// Example 2: Get a simple summary
console.log('Example 2: Get analysis summary');
console.log('================================');
const analysis2 = analyzeWord('casas');
console.log(getAnalysisSummary(analysis2));
console.log('');

// Example 3: Analyze multiple words
console.log('Example 3: Analyzing text');
console.log('=========================');
const text = 'El gato come rápidamente';
const analyses = analyzeText(text);
analyses.forEach(analysis => {
  console.log(`- ${analysis.word} (${analysis.partOfSpeech})`);
});
console.log('');

// Example 4: Detailed analysis with morphemes
console.log('Example 4: Word with prefix');
console.log('===========================');
const analysis4 = analyzeWord('deshacer');
console.log(`Word: ${analysis4.word}`);
console.log('Morphemes:');
analysis4.morphemes.forEach(m => {
  console.log(`  ${m.type}: ${m.value}${m.meaning ? ` (${m.meaning})` : ''}`);
});
console.log('');

// Example 5: Examining features
console.log('Example 5: Extracting features');
console.log('===============================');
const analysis5 = analyzeWord('hermosas');
console.log(`Word: ${analysis5.word}`);
console.log(`Part of Speech: ${analysis5.partOfSpeech}`);
if (analysis5.features) {
  console.log('Features:');
  Object.entries(analysis5.features).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
}
