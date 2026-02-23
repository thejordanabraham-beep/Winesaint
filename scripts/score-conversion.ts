// Score conversion: 100-point scale → 10-point scale

export const SCORE_CONVERSION: Record<number, [number, number]> = {
  100: [9.8, 10.0],
  99: [9.5, 9.7],
  98: [9.3, 9.5],
  97: [9.1, 9.3],
  96: [8.5, 9.0],
  95: [8.1, 8.5],
  94: [8.0, 8.0],
  93: [7.7, 7.9],
  92: [7.5, 7.6],
  91: [7.3, 7.4],
  90: [7.1, 7.2],
  89: [6.9, 7.0],
  88: [6.6, 6.8],
  87: [6.4, 6.5],
};

/**
 * Convert a 100-point score to 10-point scale
 * Uses the midpoint of the conversion range
 */
export function convertScore(score100: number): number {
  if (!score100 || score100 < 87) {
    return 0; // Invalid or too low
  }

  const conversion = SCORE_CONVERSION[score100];

  if (conversion) {
    // Use midpoint of range
    return parseFloat(((conversion[0] + conversion[1]) / 2).toFixed(1));
  }

  // If no exact conversion, use proportional scaling
  // Assume 87-100 maps to 6.4-10.0
  const scaled = 6.4 + ((score100 - 87) / 13) * 3.6;
  return parseFloat(scaled.toFixed(1));
}

/**
 * Get the conversion range for a score
 */
export function getScoreRange(score100: number): [number, number] | null {
  return SCORE_CONVERSION[score100] || null;
}

// Test examples
if (require.main === module) {
  console.log('SCORE CONVERSION EXAMPLES:');
  console.log('100 →', convertScore(100), getScoreRange(100));
  console.log('98 →', convertScore(98), getScoreRange(98));
  console.log('95 →', convertScore(95), getScoreRange(95));
  console.log('93 →', convertScore(93), getScoreRange(93));
  console.log('90 →', convertScore(90), getScoreRange(90));
  console.log('87 →', convertScore(87), getScoreRange(87));
}
