/**
 * API COST CALCULATION
 *
 * Utilities to convert API token usage to actual costs and estimate expenses.
 * Uses Anthropic's pricing for Claude models.
 */

export interface CostBreakdown {
  model: string;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

/**
 * Anthropic API Pricing (as of January 2025)
 * Prices in USD per million tokens
 */
export const API_PRICING = {
  'claude-sonnet-4-5-20250929': {
    inputPerMillion: 3.00,    // $3 per million input tokens
    outputPerMillion: 15.00,  // $15 per million output tokens
  },
  'claude-opus-4-5-20251101': {
    inputPerMillion: 15.00,   // $15 per million input tokens
    outputPerMillion: 75.00,  // $75 per million output tokens
  },
  'claude-haiku-4-20250131': {
    inputPerMillion: 0.80,    // $0.80 per million input tokens
    outputPerMillion: 4.00,   // $4 per million output tokens
  },
} as const;

/**
 * Calculate the cost of an API call based on token usage
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): CostBreakdown {
  const pricing = API_PRICING[model as keyof typeof API_PRICING];

  if (!pricing) {
    console.warn(`Unknown model: ${model}. Using Sonnet pricing as default.`);
    const defaultPricing = API_PRICING['claude-sonnet-4-5-20250929'];
    const inputCost = (inputTokens / 1_000_000) * defaultPricing.inputPerMillion;
    const outputCost = (outputTokens / 1_000_000) * defaultPricing.outputPerMillion;

    return {
      model,
      inputTokens,
      outputTokens,
      inputCost,
      outputCost,
      totalCost: inputCost + outputCost,
    };
  }

  const inputCost = (inputTokens / 1_000_000) * pricing.inputPerMillion;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPerMillion;

  return {
    model,
    inputTokens,
    outputTokens,
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
  };
}

/**
 * Estimate the cost of generating guides based on historical averages
 */
export interface CostEstimate {
  estimatedCost: number;
  breakdown: {
    level: string;
    numGuides: number;
    avgCostPerGuide: number;
    subtotal: number;
  }[];
}

/**
 * Historical average costs per guide level (based on observed token usage)
 * These are estimates - actual costs may vary
 */
const AVERAGE_COSTS_PER_LEVEL = {
  'country': 0.45,      // ~2,500-3,500 words
  'region': 0.65,       // ~3,500-5,000 words
  'sub-region': 0.35,   // ~1,500-2,500 words
};

/**
 * Estimate total cost for generating multiple guides
 */
export function estimateCost(
  guides: Array<{ level: 'country' | 'region' | 'sub-region' }>
): CostEstimate {
  const breakdown: CostEstimate['breakdown'] = [];

  // Group by level
  const byLevel = {
    country: guides.filter(g => g.level === 'country').length,
    region: guides.filter(g => g.level === 'region').length,
    'sub-region': guides.filter(g => g.level === 'sub-region').length,
  };

  let total = 0;

  for (const [level, count] of Object.entries(byLevel)) {
    if (count === 0) continue;

    const avgCost = AVERAGE_COSTS_PER_LEVEL[level as keyof typeof AVERAGE_COSTS_PER_LEVEL];
    const subtotal = count * avgCost;
    total += subtotal;

    breakdown.push({
      level,
      numGuides: count,
      avgCostPerGuide: avgCost,
      subtotal,
    });
  }

  return {
    estimatedCost: total,
    breakdown,
  };
}

/**
 * Format cost as a currency string (e.g., "$0.45")
 */
export function formatCost(cost: number): string {
  return `$${cost.toFixed(2)}`;
}

/**
 * Format cost breakdown for display
 */
export function formatCostBreakdown(breakdown: CostBreakdown): string {
  return [
    `Model: ${breakdown.model}`,
    `Input: ${breakdown.inputTokens.toLocaleString()} tokens (${formatCost(breakdown.inputCost)})`,
    `Output: ${breakdown.outputTokens.toLocaleString()} tokens (${formatCost(breakdown.outputCost)})`,
    `Total: ${formatCost(breakdown.totalCost)}`,
  ].join('\n');
}

/**
 * Calculate total cost from multiple cost breakdowns
 */
export function sumCosts(costs: CostBreakdown[]): number {
  return costs.reduce((sum, cost) => sum + cost.totalCost, 0);
}

/**
 * Group costs by level and calculate statistics
 */
export interface CostStatistics {
  totalCost: number;
  avgCostPerGuide: number;
  byLevel: Record<string, {
    count: number;
    totalCost: number;
    avgCost: number;
  }>;
}

export function calculateStatistics(
  results: Array<{ level: string; cost: CostBreakdown }>
): CostStatistics {
  const totalCost = sumCosts(results.map(r => r.cost));
  const byLevel: CostStatistics['byLevel'] = {};

  for (const result of results) {
    if (!byLevel[result.level]) {
      byLevel[result.level] = {
        count: 0,
        totalCost: 0,
        avgCost: 0,
      };
    }

    byLevel[result.level].count++;
    byLevel[result.level].totalCost += result.cost.totalCost;
  }

  // Calculate averages
  for (const level of Object.keys(byLevel)) {
    byLevel[level].avgCost = byLevel[level].totalCost / byLevel[level].count;
  }

  return {
    totalCost,
    avgCostPerGuide: totalCost / results.length,
    byLevel,
  };
}
