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
    <div className="py-5">
      <div className="flex justify-between items-start gap-4">
        {/* Left: Wine Info */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/wines/${wine.slug}`}
            className="text-lg font-medium text-[#722F37] hover:underline"
          >
            {fullTitle}
          </Link>

          <div className="mt-1.5 text-sm text-gray-600">
            <p>
              {(() => {
                const regionName = wine.region?.name || 'Unknown Region';
                const country = wine.region?.country;

                // If no country or country is "Unknown", just show region name
                if (!country || country === 'Unknown') {
                  return regionName;
                }

                // If region name already includes country, don't append it again
                if (regionName.startsWith(country) || regionName.includes(` - ${country}`) || regionName.includes(`${country} - `)) {
                  return regionName;
                }

                // Otherwise append country
                return `${regionName}, ${country}`;
              })()}
            </p>
          </div>

          {wine.review && wine.review.tastingNotes && (
            <div className="mt-3">
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
                  className="mt-2 text-sm text-gray-400 hover:text-[#722F37] flex items-center gap-1"
                >
                  {isExpanded ? 'Show Less' : 'Read More'}
                  <svg
                    className={`w-4 h-4 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Score & Details */}
        <div className="flex flex-col items-center flex-shrink-0 w-14 sm:w-20">
          {wine.review ? (
            <>
              <ScoreBadge score={wine.review.score} size="sm" />
              {wine.priceUsd && (
                <p className="text-xs text-gray-600 mt-1">${wine.priceUsd}</p>
              )}
            </>
          ) : (
            <p className="text-xs text-gray-400 italic text-center">No review</p>
          )}

          <button
            onClick={onToggle}
            className="mt-1 p-1 hover:bg-gray-100 rounded inline-flex"
          >
            <svg
              className={`w-4 h-4 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
