/**
 * Result Reranker - Multi-signal scoring for better RAG retrieval
 *
 * Reranks results based on:
 * - Semantic relevance (40%)
 * - Metadata match (30%)
 * - Content type relevance (20%)
 * - Source authority (10%)
 */

interface RerankResult {
  document: string;
  metadata: Record<string, any>;
  similarity?: number;
  rerank_score?: number;
}

interface MetadataHints {
  content_type?: string;
  regions?: string;
  grapes?: string;
  producer?: string;
}

export class ResultReranker {
  /**
   * Rerank results based on multiple signals
   */
  rerank(
    query: string,
    results: RerankResult[],
    metadataHints?: MetadataHints
  ): RerankResult[] {
    const scoredResults = results.map((result) => {
      let score = 0.0;

      // 1. Semantic relevance (from vector search) - 40% weight
      const baseScore = result.similarity || 0.5;
      score += baseScore * 0.4;

      // 2. Metadata match - 30% weight
      if (metadataHints) {
        const metadataScore = this.scoreMetadataMatch(
          result.metadata,
          metadataHints
        );
        score += metadataScore * 0.3;
      }

      // 3. Content type relevance - 20% weight
      const contentTypeScore = this.scoreContentType(
        result.metadata.content_type,
        query
      );
      score += contentTypeScore * 0.2;

      // 4. Source authority - 10% weight
      const sourceScore = this.scoreSourceAuthority(result.metadata);
      score += sourceScore * 0.1;

      return {
        ...result,
        rerank_score: score,
      };
    });

    // Sort by rerank score
    return scoredResults.sort((a, b) => (b.rerank_score || 0) - (a.rerank_score || 0));
  }

  /**
   * Score how well metadata matches expected values
   */
  private scoreMetadataMatch(
    metadata: Record<string, any>,
    hints: MetadataHints
  ): number {
    if (!hints || Object.keys(hints).length === 0) {
      return 0.5; // Neutral if no hints
    }

    let matches = 0;
    let total = 0;

    for (const [key, expectedValue] of Object.entries(hints)) {
      if (!expectedValue) continue;

      total++;
      const actualValue = metadata[key];

      if (typeof actualValue === 'string') {
        // Check if expected value is in actual
        if (actualValue.toLowerCase().includes(expectedValue.toLowerCase())) {
          matches++;
        }
      } else if (Array.isArray(actualValue)) {
        // Check if expected value in list
        if (actualValue.some((v) =>
          String(v).toLowerCase().includes(expectedValue.toLowerCase())
        )) {
          matches++;
        }
      }
    }

    return total > 0 ? matches / total : 0.5;
  }

  /**
   * Score content type relevance based on query
   */
  private scoreContentType(contentType: string | undefined, query: string): number {
    if (!contentType) {
      return 0.5;
    }

    const queryLower = query.toLowerCase();

    // Prefer educational content for "how", "what", "why" questions
    if (['how', 'what', 'why', 'explain'].some((word) => queryLower.includes(word))) {
      if (contentType === 'educational_guide') return 1.0;
      if (contentType === 'tasting_note') return 0.3;
      return 0.5;
    }

    // Prefer tasting notes for flavor/taste queries
    if (['taste', 'flavor', 'aroma', 'palate'].some((word) => queryLower.includes(word))) {
      if (contentType === 'tasting_note') return 1.0;
      if (contentType === 'educational_guide') return 0.6;
      return 0.4;
    }

    // Prefer producer profiles for producer queries
    if (['domaine', 'estate', 'producer', 'winery'].some((word) => queryLower.includes(word))) {
      if (contentType === 'producer_profile') return 1.0;
      return 0.5;
    }

    // Default: slight preference for educational
    if (contentType === 'educational_guide') return 0.7;
    return 0.5;
  }

  /**
   * Score source authority
   * Higher scores for authoritative wine references
   */
  private scoreSourceAuthority(metadata: Record<string, any>): number {
    const title = (metadata.title || '').toLowerCase();
    const filename = (metadata.filename || '').toLowerCase();

    // Authoritative sources
    if (title.includes('oxford companion')) return 1.0;
    if (title.includes('wset') || title.includes('wine & spirit education')) return 0.95;
    if (title.includes('guildsomm') || title.includes('expert guide')) return 0.9;

    // Expert authors
    const expertAuthors = [
      'clive coates',
      'wink lorch',
      'jancis robinson',
      'jon bonne',
      'peter liem',
      'jane anson',
    ];

    if (expertAuthors.some((author) => title.includes(author))) return 0.85;

    if (metadata.content_type === 'educational_guide') return 0.7;

    return 0.5;
  }
}

/**
 * Build metadata hints based on wine context
 */
export function buildMetadataHints(
  producer: string,
  region: string,
  grapes?: string
): MetadataHints {
  const hints: MetadataHints = {
    content_type: 'educational_guide',
  };

  if (region) {
    hints.regions = region;
  }

  if (grapes) {
    hints.grapes = grapes;
  }

  if (producer) {
    hints.producer = producer;
  }

  return hints;
}
