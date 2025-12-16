/**
 * Types for Spanish morphology analysis
 */

export type PartOfSpeech = 
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'article'
  | 'pronoun'
  | 'preposition'
  | 'adverb'
  | 'conjunction'
  | 'unknown';

export type Gender = 'masculine' | 'feminine' | 'neutral';
export type Number = 'singular' | 'plural';
export type VerbTense = 'present' | 'preterite' | 'imperfect' | 'future' | 'unknown';
export type Person = '1st' | '2nd' | '3rd';

export interface Morpheme {
  type: 'prefix' | 'root' | 'suffix' | 'ending';
  value: string;
  meaning?: string;
}

export interface NounFeatures {
  gender: Gender;
  number: Number;
}

export interface VerbFeatures {
  conjugation: '-ar' | '-er' | '-ir' | 'irregular';
  tense: VerbTense;
  person: Person;
  number: Number;
}

export interface AdjectiveFeatures {
  gender: Gender;
  number: Number;
}

export interface MorphologyAnalysis {
  word: string;
  normalized: string;
  partOfSpeech: PartOfSpeech;
  morphemes: Morpheme[];
  features?: NounFeatures | VerbFeatures | AdjectiveFeatures;
}
