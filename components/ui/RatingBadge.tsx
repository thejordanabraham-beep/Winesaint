import { formatRating, cn } from '@/lib/utils';

interface RatingBadgeProps {
  rating: string;
  className?: string;
}

const ratingColors: Record<string, string> = {
  poor: 'bg-red-100 text-red-800',
  fair: 'bg-orange-100 text-orange-800',
  good: 'bg-yellow-100 text-yellow-800',
  very_good: 'bg-green-100 text-green-800',
  excellent: 'bg-emerald-100 text-emerald-800',
  outstanding: 'bg-purple-100 text-purple-800',
};

export function RatingBadge({ rating, className }: RatingBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        ratingColors[rating] || 'bg-gray-100 text-gray-800',
        className
      )}
    >
      {formatRating(rating)}
    </span>
  );
}
