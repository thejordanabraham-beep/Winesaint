import Link from 'next/link';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { formatPriceRange, formatWineDisplayName } from '@/lib/utils';

interface WineCardProps {
  wine: {
    _id: string;
    name: string;
    slug: string;
    vintage: number;
    grapeVarieties?: string[];
    priceRange?: 'budget' | 'moderate' | 'premium' | 'luxury';
    image?: unknown;
    producer?: { name: string };
    region?: { name: string };
    climat?: { name: string; classification?: string };
    latestReview?: { score: number };
  };
}

export function WineCard({ wine }: WineCardProps) {
  const score = wine.latestReview?.score;

  return (
    <Link href={`/wines/${wine.slug}`} className="group block article-card">
      <article className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-[3/4] bg-gradient-to-b from-stone-50 to-stone-100 relative flex items-center justify-center">
          <div className="w-14 h-44 bg-gradient-to-b from-stone-200 to-stone-300 rounded-sm" />

          {score && (
            <div className="absolute top-3 right-3">
              <ScoreBadge score={score} size="sm" />
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-serif font-medium text-[#1C1C1C] group-hover:text-[#722F37] transition-colors line-clamp-2">
            {wine.climat?.name
              ? `${wine.vintage} ${wine.producer?.name} ${wine.climat.name}`
              : formatWineDisplayName(wine.producer?.name, wine.name, wine.vintage)}
          </h3>

          {wine.climat?.classification && (
            <p className="text-xs text-[#B8926A] uppercase tracking-wide mt-1">
              {wine.climat.classification === 'grand_cru' && 'Grand Cru'}
              {wine.climat.classification === 'premier_cru' && 'Premier Cru'}
              {wine.climat.classification === 'village' && 'Village'}
            </p>
          )}

          <p className="text-sm text-gray-500 mt-1">
            {wine.producer?.name}
          </p>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {wine.region?.name}
            </span>
            {wine.priceRange && (
              <span className="text-xs font-medium text-gray-500">
                {formatPriceRange(wine.priceRange)}
              </span>
            )}
          </div>

          {wine.grapeVarieties && wine.grapeVarieties.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {wine.grapeVarieties.slice(0, 2).map((grape) => (
                <span
                  key={grape}
                  className="text-[10px] uppercase tracking-wider bg-stone-100 text-gray-600 px-2 py-0.5 rounded"
                >
                  {grape}
                </span>
              ))}
              {wine.grapeVarieties.length > 2 && (
                <span className="text-[10px] text-gray-400">
                  +{wine.grapeVarieties.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
