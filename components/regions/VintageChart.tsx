/**
 * VINTAGE CHART COMPONENT
 *
 * Visual representation of vintage quality ratings by region
 * Helps users identify great years for specific regions
 */

'use client';

interface VintageData {
  year: number;
  rating: number; // 1-5 scale
  notes?: string;
}

interface VintageChartProps {
  region: string;
  vintages: VintageData[];
}

export default function VintageChart({ region, vintages }: VintageChartProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-emerald-500';
    if (rating >= 4) return 'bg-green-500';
    if (rating >= 3.5) return 'bg-yellow-500';
    if (rating >= 3) return 'bg-orange-400';
    return 'bg-gray-400';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return 'Exceptional';
    if (rating >= 4) return 'Excellent';
    if (rating >= 3.5) return 'Very Good';
    if (rating >= 3) return 'Good';
    return 'Fair';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Vintage Chart: {region}
      </h3>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
          <span className="text-gray-600">Exceptional</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Excellent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span className="text-gray-600">Very Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-orange-400"></div>
          <span className="text-gray-600">Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-400"></div>
          <span className="text-gray-600">Fair</span>
        </div>
      </div>

      {/* Vintage Bars */}
      <div className="space-y-3">
        {vintages.map((vintage) => (
          <div key={vintage.year} className="group">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700 w-16">
                {vintage.year}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                <div
                  className={`h-full ${getRatingColor(vintage.rating)} transition-all duration-300 flex items-center px-3`}
                  style={{ width: `${(vintage.rating / 5) * 100}%` }}
                >
                  <span className="text-white text-xs font-medium">
                    {getRatingLabel(vintage.rating)}
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-600 w-8">
                {vintage.rating.toFixed(1)}
              </span>
            </div>
            {vintage.notes && (
              <p className="text-xs text-gray-500 ml-19 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {vintage.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-6">
        Ratings based on overall vintage quality for {region}. Individual wines may vary.
      </p>
    </div>
  );
}
