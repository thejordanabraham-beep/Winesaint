export interface Producer {
  _id: string;
  name: string;
  slug: string;
  region: Region;
  description?: string;
  website?: string;
  image?: SanityImage;
}

export interface Region {
  _id: string;
  name: string;
  slug: string;
  country: string;
  description?: string;
  subRegions?: string[];
  image?: SanityImage;
}

export interface Wine {
  _id: string;
  name: string;
  slug: string;
  producer: Producer;
  region: Region;
  appellation?: string;
  grapeVarieties: string[];
  vintage: number;
  priceUsd?: number;
  priceRange?: 'budget' | 'mid-range' | 'premium' | 'luxury';
  alcoholPercentage?: number;
  criticAvg?: number;
  vivinoScore?: number;
  flavorMentions?: string[];
  hasAiReview?: boolean;
  image?: SanityImage;
  reviews?: Review[];
  latestReview?: Review;
}

export interface Review {
  _id: string;
  wine: Wine;
  score: number;
  shortSummary?: string;
  tastingNotes: string;
  flavorProfile?: string[];
  drinkThisIf?: string;
  foodPairings?: string[];
  drinkingWindowStart?: number;
  drinkingWindowEnd?: number;
  reviewerName: string;
  reviewDate: string;
  isFeatured?: boolean;
  isAiGenerated?: boolean;
  scoreJustification?: string;
  criticAvg?: number;
  vivinoScore?: number;
}

export interface VintageReport {
  _id: string;
  region: Region;
  year: number;
  slug: string;
  overview: string;
  conditionsNotes?: string;
  overallRating: 'poor' | 'fair' | 'good' | 'very_good' | 'excellent' | 'outstanding';
  featuredWines?: Wine[];
  image?: SanityImage;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

export type ScoreColor = 'red' | 'orange' | 'yellow' | 'green' | 'emerald';

// GeoJSON Types for Map Feature
export interface GeoJSONPoint {
  longitude: number;
  latitude: number;
}

export interface GeoJSONGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: GeoJSONGeometry;
  properties?: {
    fillColor?: string;
    strokeColor?: string;
  };
}

export interface Appellation {
  _id: string;
  name: string;
  slug: string;
  parentRegion?: Region;
  parentAppellation?: Appellation;
  level?: 'continent' | 'country' | 'state' | 'sub_region' | 'major_ava' | 'sub_ava';
  boundaries?: GeoJSONFeature;
  centerPoint?: {
    longitude: number;
    latitude: number;
    defaultZoom: number;
  };
  description?: string;
  establishedYear?: number;
  totalAcreage?: number;
  image?: SanityImage;
  childCount?: number;
  vineyardCount?: number;
}

export interface Vineyard {
  _id: string;
  name: string;
  slug: string;
  appellation: Appellation;
  boundaries?: GeoJSONFeature;
  labelPosition?: GeoJSONPoint;
  acreage?: number;
  elevationRange?: {
    min: number;
    max: number;
  };
  soilTypes?: string[];
  primaryGrapes?: string[];
  currentOwner?: Producer;
  fruitBuyers?: Producer[];
  description?: string;
  image?: SanityImage;
}

export interface Climat {
  _id: string;
  name: string;
  slug: string;
  appellation?: Appellation;
  classification: 'grand_cru' | 'premier_cru' | 'village' | 'regionale' | 'mga' | 'einzellage' | 'grosses_gewachs' | 'erste_lage' | 'single_vineyard';
  region?: Region;
  boundaries?: GeoJSONFeature;
  acreage?: number;
  hectares?: number;
  elevationRange?: {
    min: number;
    max: number;
  };
  soilTypes?: string[];
  aspect?: 'north' | 'northeast' | 'east' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest';
  slope?: number;
  producers?: Producer[];
  primaryGrapes?: string[];
  description?: string;
  historicalNotes?: string;
  officialDesignationYear?: number;
  image?: SanityImage;
  sources?: string[];
}

export interface FilterOptions {
  regions?: string[];
  grapes?: string[];
  minScore?: number;
  maxScore?: number;
  priceRange?: Wine['priceRange'][];
  vintageStart?: number;
  vintageEnd?: number;
}

// AI Review Generation Types
export interface AiReviewInput {
  wine_name: string;
  producer: string;
  vintage: number;
  region: string;
  grapes: string;
  price_usd: number;
  critic_avg: number;
  vivino_score: number;
  flavor_mentions: string;
}

export interface AiReviewOutput {
  wine: {
    name: string;
    producer: string;
    vintage: number;
    region: string;
    country: string;
    grapes: string[];
    price_usd: number;
    price_range: 'budget' | 'mid-range' | 'premium' | 'luxury';
  };
  scores: {
    final_score: number;
    critic_avg: number;
    vivino_score: number;
    score_justification: string;
  };
  review: {
    short_summary: string;
    full_review: string;
    flavor_profile: string[];
    drink_this_if: string;
    food_pairings: string[];
  };
  metadata: {
    generated_date: string;
    scoring_method: string;
    disclaimer: string;
  };
}
