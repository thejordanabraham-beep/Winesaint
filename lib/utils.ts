import { type ScoreColor } from '@/types';

// Convert 100-point score to 10-point score
export function convertTo10Point(score100: number): number {
  const conversionTable: Record<number, number> = {
    100: 10.0,
    99: 9.6,
    98: 9.4,
    97: 9.2,
    96: 8.8,
    95: 8.3,
    94: 8.0,
    93: 7.8,
    92: 7.55,
    91: 7.35,
    90: 7.15,
    89: 6.95,
    88: 6.7,
    87: 6.45,
    86: 6.25,
  };

  // If exact match in table, use it
  if (conversionTable[score100] !== undefined) {
    return conversionTable[score100];
  }

  // For scores below 86, extrapolate
  if (score100 < 86) {
    return Math.max(1, 6.25 - (86 - score100) * 0.15);
  }

  // For any other case, interpolate
  return Math.round((score100 / 10) * 10) / 10;
}

// Get color based on 10-point score
export function getScoreColor(score: number): ScoreColor {
  // Convert if it's a 100-point score
  const score10 = score > 10 ? convertTo10Point(score) : score;

  if (score10 >= 9.0) return 'emerald';
  if (score10 >= 8.0) return 'green';
  if (score10 >= 7.0) return 'yellow';
  if (score10 >= 6.0) return 'orange';
  return 'red';
}

export function getScoreColorClasses(score: number): string {
  const color = getScoreColor(score);
  const colorMap: Record<ScoreColor, string> = {
    emerald: 'bg-emerald-500 text-white',
    green: 'bg-green-500 text-white',
    yellow: 'bg-yellow-500 text-black',
    orange: 'bg-orange-500 text-white',
    red: 'bg-red-500 text-white',
  };
  return colorMap[color];
}

export function formatDrinkingWindow(start?: number, end?: number): string {
  if (!start && !end) return 'Drink now';
  if (start && end) return `${start}–${end}`;
  if (start) return `From ${start}`;
  return `Until ${end}`;
}

export function formatPriceRange(range?: string): string {
  const priceMap: Record<string, string> = {
    budget: '$',
    moderate: '$$',
    premium: '$$$',
    luxury: '$$$$',
  };
  return range ? priceMap[range] || range : '';
}

export function formatRating(rating: string): string {
  const ratingMap: Record<string, string> = {
    poor: 'Poor',
    fair: 'Fair',
    good: 'Good',
    very_good: 'Very Good',
    excellent: 'Excellent',
    outstanding: 'Outstanding',
  };
  return ratingMap[rating] || rating;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
