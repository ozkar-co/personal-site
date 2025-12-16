# Spanish Morphology Analyzer

A simple morphological analyzer for Spanish words following a basic grammar guide.

## Overview

This morphology analyzer can identify:
- **Part of Speech**: nouns, verbs, adjectives, adverbs, articles, pronouns, prepositions, conjunctions
- **Morphemes**: prefixes, roots, suffixes, and inflectional endings
- **Grammatical Features**: gender, number, person, tense, etc.

## Grammar Guide

The grammar rules and patterns are documented in `data/quick_gramm.txt`. This file contains:
- Part of speech categories
- Morpheme patterns (prefixes, suffixes)
- Conjugation rules for verbs
- Basic analysis roadmap
- Implementation notes

## Structure

```
src/utils/morphology/
├── index.ts          # Main exports
├── types.ts          # TypeScript type definitions
├── tokenizer.ts      # Step 1: Word tokenization
├── morphemes.ts      # Step 2: Morpheme identification
├── tagger.ts         # Step 3: Part of speech tagging
├── features.ts       # Step 4: Feature extraction
└── analyzer.ts       # Main analyzer combining all steps

scripts/
├── test-morphology.cjs  # Test script with sample words
└── check-word.cjs       # Script to analyze individual words

data/
└── quick_gramm.txt      # Human-readable grammar guide
```

## Usage

### Command Line Scripts

#### Test the analyzer with sample words:
```bash
node scripts/test-morphology.cjs
```

#### Analyze a single word:
```bash
node scripts/check-word.cjs <word>
```

Examples:
```bash
node scripts/check-word.cjs hablamos
node scripts/check-word.cjs rápidamente
node scripts/check-word.cjs deshacer
node scripts/check-word.cjs información
```

### TypeScript/JavaScript Integration

Import and use in your code:

```typescript
import { analyzeWord, formatAnalysis } from './src/utils/morphology';

// Analyze a single word
const analysis = analyzeWord('hablamos');
console.log(analysis);

// Format analysis as readable text
const formatted = formatAnalysis(analysis);
console.log(formatted);
```

Example output:
```
Word: hablamos
Normalized: hablamos
Part of Speech: verb
Morphemes:
  - root: habl
  - ending: amos (verb conjugation)
Features:
  - conjugation: -ar
  - tense: present
  - person: 1st
  - number: plural
```

## API Reference

### Main Functions

- **`analyzeWord(word: string)`** - Analyzes a single word and returns complete morphological analysis
- **`analyzeWords(words: string[])`** - Analyzes multiple words
- **`analyzeText(text: string)`** - Tokenizes and analyzes entire text
- **`formatAnalysis(analysis: MorphologyAnalysis)`** - Formats analysis as readable string
- **`getAnalysisSummary(analysis: MorphologyAnalysis)`** - Returns brief summary

### Utility Functions

- **`tokenize(text: string)`** - Splits text into words
- **`normalize(word: string)`** - Normalizes a word
- **`removeAccents(word: string)`** - Removes accent marks
- **`identifyMorphemes(word: string)`** - Identifies morphemes in a word
- **`getRoot(word: string)`** - Extracts the root of a word
- **`tagPartOfSpeech(word: string)`** - Determines part of speech
- **`extractFeatures(word, root, pos)`** - Extracts grammatical features

## Roadmap

Following the guide in `data/quick_gramm.txt`, the implementation follows these steps:

1. **Word Tokenization** (`tokenizer.ts`)
   - Split text into individual words
   - Remove punctuation and normalize

2. **Morpheme Identification** (`morphemes.ts`)
   - Identify root/stem
   - Identify prefixes
   - Identify suffixes
   - Identify inflectional endings

3. **Part of Speech Tagging** (`tagger.ts`)
   - Determine grammatical category
   - Based on endings, patterns, and context

4. **Feature Extraction** (`features.ts`)
   - For nouns: gender, number
   - For verbs: tense, person, number
   - For adjectives: gender, number, degree

## Design Philosophy

### Single Responsibility
Each module handles one specific aspect of morphological analysis:
- Tokenizer: text → words
- Morphemes: word → parts
- Tagger: word → category
- Features: word + category → grammatical features

### Standalone Scripts
Scripts in the `scripts/` folder can be run independently to test specific functionality. This allows for:
- Manual testing of individual steps
- Debugging specific components
- Building more complex features on top of basic functions

### Extensibility
The current implementation is simplified but designed to be extended:
- Grammar rules can be expanded in `data/quick_gramm.txt`
- Dictionaries can be added for irregular forms
- Machine learning models could be integrated for disambiguation
- Support for regional variations can be added

## Limitations

This is a simplified morphological analyzer. It does not handle:
- Irregular verbs in full detail (ser, estar, ir, etc.)
- Stem-changing verbs (e→ie, o→ue, e→i)
- Complex accent and orthographic rules
- Compound words
- Context-dependent disambiguation
- Semantic analysis

For production use, consider:
- A comprehensive dictionary
- Machine learning models
- Integration with existing NLP libraries
- Support for regional Spanish variations

## Examples

### Nouns
```bash
node scripts/check-word.cjs casa
# Part of Speech: noun
# Gender: feminine, Number: singular

node scripts/check-word.cjs gatos
# Part of Speech: noun
# Gender: masculine, Number: plural
```

### Verbs
```bash
node scripts/check-word.cjs hablar
# Part of Speech: verb
# Form: infinitive

node scripts/check-word.cjs hablamos
# Part of Speech: verb
# Person: 1st, Number: plural
```

### Adjectives
```bash
node scripts/check-word.cjs hermoso
# Part of Speech: adjective
# Gender: masculine, Number: singular
```

### Adverbs
```bash
node scripts/check-word.cjs rápidamente
# Part of Speech: adverb
# Suffix: -mente (adverb formation)
```

### Words with Prefixes
```bash
node scripts/check-word.cjs deshacer
# Prefix: des- (negation/reversal)
# Root: hacer
```

## Future Enhancements

As noted in the grammar guide, future enhancements could include:
- Comprehensive dictionary of irregular forms
- Machine learning for disambiguation
- Support for regional variations
- Compound word analysis
- Integration with semantic analysis
- Web interface for interactive analysis

## License

Part of the personal-site project - MIT License
