/**
 * GRAPE VARIETY CARD
 *
 * Beautiful card showcasing individual grape varieties
 * Part of the comprehensive grape database
 */

'use client';

import Link from 'next/link';

interface GrapeVarietyCardProps {
  name: string;
  type: 'red' | 'white';
  regions: string[];
  characteristics: {
    body: 'light' | 'medium' | 'full';
    acidity: 'low' | 'medium' | 'high';
    tannins?: 'low' | 'medium' | 'high';
  };
  aromas: string[];
  foodPairings: string[];
  notableWines: string[];
}

export default function GrapeVarietyCard({
  name,
  type,
  regions,
  characteristics,
  aromas,
  foodPairings,
  notableWines
}: GrapeVarietyCardProps) {
  const typeColor = type === 'red' ? 'from-wine-600 to-wine-700' : 'from-amber-500 to-yellow-600';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200">
      {/* Header */}
      <div className={`bg-gradient-to-br ${typeColor} text-white p-6`}>
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>
        <h3 className="text-3xl font-bold">{name}</h3>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Characteristics */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Characteristics
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Body:</span>
              <span className="ml-2 font-medium text-gray-900 capitalize">{characteristics.body}</span>
            </div>
            <div>
              <span className="text-gray-600">Acidity:</span>
              <span className="ml-2 font-medium text-gray-900 capitalize">{characteristics.acidity}</span>
            </div>
            {characteristics.tannins && (
              <div>
                <span className="text-gray-600">Tannins:</span>
                <span className="ml-2 font-medium text-gray-900 capitalize">{characteristics.tannins}</span>
              </div>
            )}
          </div>
        </div>

        {/* Key Regions */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Key Regions
          </h4>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <span
                key={region}
                className="px-2 py-1 bg-wine-50 text-wine-700 rounded text-sm"
              >
                {region}
              </span>
            ))}
          </div>
        </div>

        {/* Aromas */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Typical Aromas
          </h4>
          <p className="text-sm text-gray-600">{aromas.join(', ')}</p>
        </div>

        {/* Food Pairings */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Food Pairings
          </h4>
          <p className="text-sm text-gray-600">{foodPairings.join(', ')}</p>
        </div>

        {/* Notable Wines */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Notable Wines
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {notableWines.slice(0, 3).map((wine, index) => (
              <li key={index}>• {wine}</li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Link
          href={`/grapes/${name.toLowerCase().replace(/\s+/g, '-')}`}
          className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors mt-4"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
