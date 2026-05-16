'use client';

import Link from 'next/link';
import { formatWineDisplayName } from '@/lib/utils';
import { ScoreBadge } from '@/components/ui/ScoreBadge';

interface WineResult {
  _id: string;
  name: string;
  slug: string;
  vintage: number;
  priceUsd?: number;
  grapeVarieties?: string[];
  producer: { name: string } | null;
  region: { name: string; country: string } | null;
  review?: {
    score: number;
    tastingNotes: string;
    reviewerName: string;
    reviewDate: string;
    flavorProfile?: string[];
    foodPairings?: string[];
    drinkThisIf?: string;
    drinkingWindowStart?: number;
    drinkingWindowEnd?: number;
  };
}

interface SearchResultCardProps {
  wine: WineResult;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SearchResultCard({ wine, isExpanded, onToggle }: SearchResultCardProps) {
  // Display Producer + Wine Name + Vintage (deduped when same)
  const fullTitle = formatWineDisplayName(wine.producer?.name || 'Unknown Producer', wine.name, wine.vintage);

  return (
    <div className="py-4">
      <div className="relative">
        {/* Score badge floated into text area */}
        {wine.review && (
          <div className="float-right ml-2 mt-1">
            <ScoreBadge score={wine.review.score} size="sm" />
          </div>
        )}

        <Link
          href={`/wines/${wine.slug}`}
          className="text-base font-medium text-[#722F37] hover:underline"
        >
          {fullTitle}
        </Link>

        <div className="mt-1 text-sm text-gray-600">
          <p>
            {(() => {
              const regionName = wine.region?.name || 'Unknown Region';
              const country = wine.region?.country;

              if (!country || country === 'Unknown') {
                return regionName;
              }

              if (regionName.startsWith(country) || regionName.includes(` - ${country}`) || regionName.includes(`${country} - `)) {
                return regionName;
              }

              return `${regionName}, ${country}`;
            })()}
          </p>
        </div>

        {wine.review && wine.review.tastingNotes && (
          <div className="mt-2">
            <p className={`text-gray-700 leading-relaxed text-sm ${!isExpanded ? 'line-clamp-3' : ''}`}>
              {wine.review.tastingNotes}
            </p>

            {isExpanded && (
              <>
                {wine.review.flavorProfile && wine.review.flavorProfile.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {wine.review.flavorProfile.map((flavor) => (
                      <span
                        key={flavor}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {flavor}
                      </span>
                    ))}
                  </div>
                )}

                {wine.review.foodPairings && wine.review.foodPairings.length > 0 && (
                  <p className="mt-3 text-sm text-gray-600">
                    <span className="font-medium">Pairs with:</span> {wine.review.foodPairings.join(', ')}
                  </p>
                )}

                {wine.review.drinkThisIf && (
                  <p className="mt-2 text-sm text-[#722F37] font-medium">
                    Drink this if: {wine.review.drinkThisIf} 🍷
                  </p>
                )}
              </>
            )}

            {wine.review.tastingNotes.length > 180 && (
              <button
                onClick={onToggle}
                className="mt-1.5 text-sm text-gray-400 hover:text-[#722F37] inline-flex items-center gap-1"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                {isExpanded ? 'Less' : 'More'}
              </button>
            )}
          </div>
        )}

        {!wine.review && (
          <p className="mt-2 text-xs text-gray-400 italic">No review</p>
        )}
      </div>
    </div>
  );
}
