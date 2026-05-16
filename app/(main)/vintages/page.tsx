'use client';

import { useState } from 'react';
import { VintageReportCard } from '@/components/wine/VintageReportCard';
import type { VintageReport } from '@/types';

// Demo data - replace with Sanity data
const demoReports: VintageReport[] = [
  {
    _id: 'vr1',
    year: 2022,
    slug: '2022',
    overview: 'An exceptional vintage marked by ideal growing conditions and concentrated, age-worthy wines. Early spring frost concerns gave way to a warm, dry summer that produced wines of remarkable intensity.',
    overallRating: 'outstanding',
    region: { _id: 'r1', name: 'Bordeaux', slug: 'bordeaux', country: 'France' },
  },
  {
    _id: 'vr2',
    year: 2021,
    slug: '2021',
    overview: 'A classic vintage with elegant wines showing great balance and freshness. Challenging conditions required careful vineyard management, but the best producers crafted exceptional wines.',
    overallRating: 'excellent',
    region: { _id: 'r4', name: 'Burgundy', slug: 'burgundy', country: 'France' },
  },
  {
    _id: 'vr3',
    year: 2022,
    slug: '2022',
    overview: 'One of the greatest Napa vintages in recent memory. Perfect weather throughout the growing season produced rich, balanced wines with excellent aging potential.',
    overallRating: 'outstanding',
    region: { _id: 'r2', name: 'Napa Valley', slug: 'napa-valley', country: 'USA' },
  },
  {
    _id: 'vr4',
    year: 2020,
    slug: '2020',
    overview: 'A vintage of contrasts in Tuscany. Heat spikes challenged growers, but those who adapted produced concentrated, powerful wines with firm tannins.',
    overallRating: 'very_good',
    region: { _id: 'r3', name: 'Tuscany', slug: 'tuscany', country: 'Italy' },
  },
  {
    _id: 'vr5',
    year: 2021,
    slug: '2021',
    overview: 'A standout vintage for Barolo, with a long, cool growing season producing wines of elegance and finesse. Great structure with refined tannins.',
    overallRating: 'excellent',
    region: { _id: 'r5', name: 'Piedmont', slug: 'piedmont', country: 'Italy' },
  },
  {
    _id: 'vr6',
    year: 2019,
    slug: '2019',
    overview: 'Historic vintage in Champagne with exceptional quality across all sub-regions. Warm conditions produced ripe, expressive base wines.',
    overallRating: 'outstanding',
    region: { _id: 'r6', name: 'Champagne', slug: 'champagne', country: 'France' },
  },
];

const regions = ['All Regions', 'Bordeaux', 'Burgundy', 'Napa Valley', 'Tuscany', 'Piedmont', 'Champagne'];
const years = ['All Years', '2022', '2021', '2020', '2019', '2018'];

export default function VintagesPage() {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedYear, setSelectedYear] = useState('All Years');

  const filteredReports = demoReports.filter((report) => {
    if (selectedRegion !== 'All Regions' && report.region?.name !== selectedRegion) {
      return false;
    }
    if (selectedYear !== 'All Years' && report.year.toString() !== selectedYear) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vintage Reports</h1>
          <p className="mt-2 text-gray-600">
            In-depth analysis of vintages from wine regions around the world.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-0 sm:min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-0 sm:min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredReports.length} vintage reports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <VintageReportCard key={report._id} report={report} />
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No vintage reports match your filters.</p>
            <button
              onClick={() => {
                setSelectedRegion('All Regions');
                setSelectedYear('All Years');
              }}
              className="mt-2 text-red-600 hover:text-red-700"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
