import Link from 'next/link';
import { RatingBadge } from '@/components/ui/RatingBadge';

interface VintageReportCardProps {
  report: {
    _id: string;
    year: number;
    slug?: string;
    overview: string;
    overallRating: string;
    region?: {
      name: string;
      slug: string;
      country?: string;
    };
  };
}

export function VintageReportCard({ report }: VintageReportCardProps) {
  return (
    <Link
      href={`/vintages/${report.region?.slug}/${report.year}`}
      className="group block"
    >
      <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video bg-gradient-to-br from-red-900 to-red-700 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-4xl font-bold">{report.year}</p>
              <p className="text-lg mt-1 opacity-90">{report.region?.name}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
              {report.region?.name} {report.year}
            </h3>
            <RatingBadge rating={report.overallRating} />
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {report.overview}
          </p>

          {report.region?.country && (
            <p className="text-xs text-gray-500 mt-2">
              {report.region.country}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
