/**
 * REGION COMPARISON TOOL
 *
 * Side-by-side comparison of wine regions
 * Perfect for understanding differences between similar regions
 */

'use client';

import { useState } from 'react';

interface RegionData {
  name: string;
  slug: string;
  climate: string;
  soilTypes: string[];
  primaryGrapes: string[];
  wineStyles: string[];
  avgPrice: string;
  bestVintages: number[];
}

export default function RegionComparisonTool() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // Sample data - will be populated from guides
  const regions: Record<string, RegionData> = {
    burgundy: {
      name: 'Burgundy',
      slug: 'burgundy',
      climate: 'Continental',
      soilTypes: ['Limestone', 'Marl', 'Clay'],
      primaryGrapes: ['Pinot Noir', 'Chardonnay'],
      wineStyles: ['Red (Pinot Noir)', 'White (Chardonnay)'],
      avgPrice: '$50-200',
      bestVintages: [2019, 2018, 2015, 2010, 2005]
    },
    bordeaux: {
      name: 'Bordeaux',
      slug: 'bordeaux',
      climate: 'Maritime',
      soilTypes: ['Gravel', 'Clay', 'Limestone'],
      primaryGrapes: ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc'],
      wineStyles: ['Red Blends', 'Sweet Whites (Sauternes)'],
      avgPrice: '$30-150',
      bestVintages: [2019, 2016, 2010, 2009, 2005]
    }
  };

  const addRegion = (slug: string) => {
    if (selectedRegions.length < 3 && !selectedRegions.includes(slug)) {
      setSelectedRegions([...selectedRegions, slug]);
    }
  };

  const removeRegion = (slug: string) => {
    setSelectedRegions(selectedRegions.filter(s => s !== slug));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Compare Wine Regions
      </h2>

      {selectedRegions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Select up to 3 regions to compare side-by-side
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => addRegion('burgundy')}
              className="px-4 py-2 bg-wine-600 text-white rounded-lg hover:bg-wine-700"
            >
              Add Burgundy
            </button>
            <button
              onClick={() => addRegion('bordeaux')}
              className="px-4 py-2 bg-wine-600 text-white rounded-lg hover:bg-wine-700"
            >
              Add Bordeaux
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Attribute</th>
                {selectedRegions.map(slug => {
                  const region = regions[slug];
                  return (
                    <th key={slug} className="text-left py-3 px-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-wine-700">{region.name}</span>
                        <button
                          onClick={() => removeRegion(slug)}
                          className="ml-2 text-gray-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Climate</td>
                {selectedRegions.map(slug => (
                  <td key={slug} className="py-3 px-4 text-gray-600">
                    {regions[slug].climate}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Soil Types</td>
                {selectedRegions.map(slug => (
                  <td key={slug} className="py-3 px-4 text-gray-600">
                    {regions[slug].soilTypes.join(', ')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Primary Grapes</td>
                {selectedRegions.map(slug => (
                  <td key={slug} className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {regions[slug].primaryGrapes.map(grape => (
                        <span key={grape} className="inline-block px-2 py-1 bg-wine-100 text-wine-700 rounded text-sm">
                          {grape}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Wine Styles</td>
                {selectedRegions.map(slug => (
                  <td key={slug} className="py-3 px-4 text-gray-600">
                    {regions[slug].wineStyles.join(', ')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Avg Price</td>
                {selectedRegions.map(slug => (
                  <td key={slug} className="py-3 px-4 text-gray-600">
                    {regions[slug].avgPrice}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Best Recent Vintages</td>
                {selectedRegions.map(slug => (
                  <td key={slug} className="py-3 px-4 text-gray-600">
                    {regions[slug].bestVintages.join(', ')}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
