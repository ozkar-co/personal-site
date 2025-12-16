/**
 * Main Morphology Analyzer
 * Combines all analysis steps to provide complete morphological analysis
 */

import { MorphologyAnalysis } from './types';
import { normalize, tokenize } from './tokenizer';
import { identifyMorphemes, getRoot } from './morphemes';
import { tagPartOfSpeech } from './tagger';
import { extractFeatures } from './features';

/**
 * Performs complete morphological analysis on a single word
 */
export function analyzeWord(word: string): MorphologyAnalysis {
  // Step 1: Normalize the word
  const normalized = normalize(word);
  
  // Step 2: Identify morphemes
  const morphemes = identifyMorphemes(normalized);
  
  // Step 3: Get root
  const root = getRoot(normalized);
  
  // Step 4: Tag part of speech
  const partOfSpeech = tagPartOfSpeech(normalized);
  
  // Step 5: Extract features
  const features = extractFeatures(normalized, root, partOfSpeech);
  
  return {
    word,
    normalized,
    partOfSpeech,
    morphemes,
    features
  };
}

/**
 * Analyzes multiple words
 */
export function analyzeWords(words: string[]): MorphologyAnalysis[] {
  return words.map(analyzeWord);
}

/**
 * Analyzes text by tokenizing and analyzing each word
 */
export function analyzeText(text: string): MorphologyAnalysis[] {
  const words = tokenize(text);
  return analyzeWords(words);
}

/**
 * Formats analysis results as a readable string
 */
export function formatAnalysis(analysis: MorphologyAnalysis): string {
  const lines: string[] = [];
  
  lines.push(`Word: ${analysis.word}`);
  lines.push(`Normalized: ${analysis.normalized}`);
  lines.push(`Part of Speech: ${analysis.partOfSpeech}`);
  
  if (analysis.morphemes.length > 0) {
    lines.push('Morphemes:');
    for (const morpheme of analysis.morphemes) {
      const meaning = morpheme.meaning ? ` (${morpheme.meaning})` : '';
      lines.push(`  - ${morpheme.type}: ${morpheme.value}${meaning}`);
    }
  }
  
  if (analysis.features) {
    lines.push('Features:');
    for (const [key, value] of Object.entries(analysis.features)) {
      lines.push(`  - ${key}: ${value}`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Gets a simple summary of the analysis
 */
export function getAnalysisSummary(analysis: MorphologyAnalysis): string {
  const pos = analysis.partOfSpeech;
  const root = getRoot(analysis.normalized);
  return `"${analysis.word}" is a ${pos} with root "${root}"`;
}
