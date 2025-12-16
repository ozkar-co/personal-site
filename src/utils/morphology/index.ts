/**
 * Spanish Morphology Analyzer
 * 
 * A simple morphological analyzer for Spanish words following the guide
 * in data/quick_gramm.txt
 * 
 * Usage:
 *   import { analyzeWord } from './utils/morphology';
 *   const analysis = analyzeWord('hablamos');
 *   console.log(analysis);
 */

// Main analyzer functions
export { analyzeWord, analyzeWords, analyzeText, formatAnalysis, getAnalysisSummary } from './analyzer';

// Tokenization utilities
export { tokenize, normalize, removeAccents } from './tokenizer';

// Morpheme identification
export { identifyMorphemes, getRoot } from './morphemes';

// Part of speech tagging
export { tagPartOfSpeech, isNoun, isVerb, isAdjective } from './tagger';

// Feature extraction
export { 
  extractGender, 
  extractNumber, 
  extractVerbTense,
  extractPersonAndNumber,
  extractVerbConjugation,
  extractNounFeatures,
  extractVerbFeatures,
  extractAdjectiveFeatures,
  extractFeatures
} from './features';

// Types
export type {
  PartOfSpeech,
  Gender,
  Number,
  VerbTense,
  Person,
  Morpheme,
  NounFeatures,
  VerbFeatures,
  AdjectiveFeatures,
  MorphologyAnalysis
} from './types';
