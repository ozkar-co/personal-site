/**
 * Step 1: Word Tokenization
 * Splits text into individual words and normalizes them
 */

/**
 * Tokenizes text into words, removing punctuation and normalizing
 */
export function tokenize(text: string): string[] {
  // Remove punctuation and split by whitespace
  const cleaned = text
    .toLowerCase()
    .replace(/[¡!¿?.,;:"""''\(\)\[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned.split(' ').filter(word => word.length > 0);
}

/**
 * Normalizes a single word (lowercase, remove accents for comparison if needed)
 */
export function normalize(word: string): string {
  return word.toLowerCase().trim();
}

/**
 * Removes accent marks from a word (for pattern matching)
 */
export function removeAccents(word: string): string {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
