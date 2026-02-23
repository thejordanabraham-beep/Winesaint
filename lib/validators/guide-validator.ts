/**
 * GUIDE CONTENT VALIDATOR
 *
 * Validates wine region guides for quality standards before deployment.
 * Ensures word count, required sections, and content uniqueness.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ValidationResult {
  valid: boolean;
  errors: string[];      // Blocking issues that should prevent save
  warnings: string[];    // Non-blocking concerns
  metrics: {
    wordCount: number;
    hasRequiredSections: boolean;
    sectionsFound: string[];
    uniqueWordRatio: number;  // Ratio of unique words to total words (detect repetition)
  };
}

/**
 * Word count requirements by guide level
 */
const WORD_COUNT_RANGES = {
  country: { min: 2500, max: 4000, recommended: { min: 2500, max: 3500 } },
  region: { min: 3500, max: 6000, recommended: { min: 3500, max: 5000 } },
  'sub-region': { min: 1500, max: 3000, recommended: { min: 1500, max: 2500 } },
  vineyard: { min: 300, max: 99999, recommended: { min: 400, max: 99999 } }, // No upper limit - famous sites can go deep
};

/**
 * Required sections by guide level
 */
const REQUIRED_SECTIONS = {
  country: [
    // Country guides should have overview content but no strict section requirements
  ],
  region: [
    'GEOLOGY',
    'CLIMATE',
    'GRAPES',
    'WINES',
  ],
  'sub-region': [
    // Sub-region guides should have at least one ## section
  ],
  vineyard: [
    // Vineyard guides can have any structure - no required sections
  ],
};

/**
 * Validate a wine region guide
 */
export function validateGuide(
  content: string,
  level: 'country' | 'region' | 'sub-region' | 'vineyard'
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Extract metrics
  const wordCount = countWords(content);
  const sections = extractSections(content);
  const uniqueWordRatio = calculateUniqueWordRatio(content);

  // Validate word count
  const range = WORD_COUNT_RANGES[level];
  if (wordCount < range.min) {
    errors.push(
      `Word count ${wordCount.toLocaleString()} is below minimum ${range.min.toLocaleString()} for ${level} guides`
    );
  } else if (wordCount > range.max) {
    warnings.push(
      `Word count ${wordCount.toLocaleString()} exceeds maximum ${range.max.toLocaleString()} for ${level} guides`
    );
  } else if (wordCount < range.recommended.min) {
    warnings.push(
      `Word count ${wordCount.toLocaleString()} is below recommended minimum ${range.recommended.min.toLocaleString()}`
    );
  } else if (wordCount > range.recommended.max) {
    warnings.push(
      `Word count ${wordCount.toLocaleString()} exceeds recommended maximum ${range.recommended.max.toLocaleString()}`
    );
  }

  // Validate required sections
  const requiredSections = REQUIRED_SECTIONS[level];
  const hasRequiredSections = requiredSections.every(section =>
    sections.some(s => s.toUpperCase().includes(section))
  );

  if (!hasRequiredSections) {
    const missing = requiredSections.filter(
      section => !sections.some(s => s.toUpperCase().includes(section))
    );
    errors.push(
      `Missing required sections: ${missing.join(', ')}`
    );
  }

  // Validate sub-region has at least one section
  if (level === 'sub-region' && sections.length === 0) {
    errors.push('Sub-region guide must have at least one ## section');
  }

  // Vineyard guides are very flexible - no required sections
  // They can be anywhere from 300-5000 words based on available information

  // Check for repetitive content
  if (uniqueWordRatio < 0.4) {
    warnings.push(
      `Low unique word ratio (${uniqueWordRatio.toFixed(2)}). Content may be repetitive.`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    metrics: {
      wordCount,
      hasRequiredSections,
      sectionsFound: sections,
      uniqueWordRatio,
    },
  };
}

/**
 * Check if content is a duplicate or very similar to existing guides
 */
export interface DuplicateCheckResult {
  isDuplicate: boolean;
  similarity: number;  // 0-1 scale
  matchedFile?: string;
}

export function checkDuplicateContent(
  newContent: string,
  existingGuidePaths: string[]
): DuplicateCheckResult {
  let maxSimilarity = 0;
  let matchedFile: string | undefined;

  const newWords = extractWords(newContent);

  for (const guidePath of existingGuidePaths) {
    if (!fs.existsSync(guidePath)) continue;

    const existingContent = fs.readFileSync(guidePath, 'utf-8');
    const existingWords = extractWords(existingContent);

    const similarity = calculateSimilarity(newWords, existingWords);

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      matchedFile = guidePath;
    }
  }

  // Consider it a duplicate if >80% similar
  const isDuplicate = maxSimilarity > 0.8;

  return {
    isDuplicate,
    similarity: maxSimilarity,
    matchedFile,
  };
}

/**
 * Helper: Count words in content
 */
function countWords(content: string): number {
  // Remove markdown syntax, code blocks, etc.
  const cleaned = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Keep link text
    .replace(/#{1,6}\s+/g, '') // Remove heading markers
    .replace(/[*_~`]/g, '') // Remove formatting
    .replace(/^\s*[-*+]\s+/gm, ''); // Remove list markers

  const words = cleaned.split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

/**
 * Helper: Extract section headings from markdown
 */
function extractSections(content: string): string[] {
  const sections: string[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      sections.push(match[1].trim());
    }
  }

  return sections;
}

/**
 * Helper: Calculate unique word ratio (detect repetition)
 */
function calculateUniqueWordRatio(content: string): number {
  const words = extractWords(content);
  if (words.length === 0) return 0;

  const uniqueWords = new Set(words);
  return uniqueWords.size / words.length;
}

/**
 * Helper: Extract words from content (normalized)
 */
function extractWords(content: string): string[] {
  const cleaned = content
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[^a-z0-9\s]/g, ' ');

  return cleaned
    .split(/\s+/)
    .filter(w => w.length > 3); // Ignore very short words
}

/**
 * Helper: Calculate similarity between two word sets (Jaccard similarity)
 */
function calculateSimilarity(words1: string[], words2: string[]): number {
  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const intersection = new Set(Array.from(set1).filter(w => set2.has(w)));
  const union = new Set(Array.from(set1).concat(Array.from(set2)));

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Get all existing guide files in the guides directory
 */
export function getExistingGuidePaths(guidesDir: string): string[] {
  if (!fs.existsSync(guidesDir)) return [];

  return fs
    .readdirSync(guidesDir)
    .filter(file => file.endsWith('.md') && file !== 'generation-summary.json')
    .map(file => path.join(guidesDir, file));
}

/**
 * Format validation result for display
 */
export function formatValidationResult(result: ValidationResult, regionName: string): string {
  const lines: string[] = [];

  if (result.valid) {
    lines.push(`✅ ${regionName}: PASS (${result.metrics.wordCount.toLocaleString()} words)`);
  } else {
    lines.push(`❌ ${regionName}: FAIL (${result.metrics.wordCount.toLocaleString()} words)`);
  }

  // Show errors
  if (result.errors.length > 0) {
    result.errors.forEach(error => {
      lines.push(`   ❌ ${error}`);
    });
  }

  // Show warnings
  if (result.warnings.length > 0) {
    result.warnings.forEach(warning => {
      lines.push(`   ⚠️  ${warning}`);
    });
  }

  // Show sections found
  if (result.metrics.sectionsFound.length > 0) {
    lines.push(`   ✓ Sections: ${result.metrics.sectionsFound.slice(0, 5).join(', ')}${result.metrics.sectionsFound.length > 5 ? '...' : ''}`);
  }

  return lines.join('\n');
}
