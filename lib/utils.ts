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

/**
 * Format wine display name, avoiding redundancy when producer = wine name
 * "Château Margaux" + "Château Margaux" + 2024 → "Château Margaux 2024"
 * "Château Margaux" + "Pavillon Rouge" + 2024 → "Château Margaux Pavillon Rouge 2024"
 */
export function formatWineDisplayName(
  producerName?: string,
  wineName?: string,
  vintage?: number
): string {
  const parts: string[] = [];

  if (producerName) {
    parts.push(producerName);
  }

  // Only add wine name if it's different from producer
  if (wineName && wineName.toLowerCase() !== producerName?.toLowerCase()) {
    parts.push(wineName);
  }

  if (vintage) {
    parts.push(String(vintage));
  }

  return parts.join(' ');
}
