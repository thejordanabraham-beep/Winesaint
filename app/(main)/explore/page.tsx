/**
 * EXPLORE PAGE
 *
 * Central hub for discovering wine regions
 * Beautiful, interactive, and educational
 */

import InteractiveRegionExplorer from '@/components/regions/InteractiveRegionExplorer';
import RegionComparisonTool from '@/components/regions/RegionComparisonTool';
import LearningPathCard from '@/components/learning/LearningPathCard';
import { getAllRegions } from '@/lib/guide-config';

export const metadata = {
  title: 'Explore Wine Regions | WineSaint',
  description: 'Discover the world\'s great wine regions through interactive guides and learning paths',
};

export default function ExplorePage() {
  const totalRegions = getAllRegions().length;
  const countries = getAllRegions('country').length;

  const learningPaths = [
    {
      title: 'French Classics',
      description: 'Master the great wines of France from Burgundy to Bordeaux',
      level: 'intermediate' as const,
      icon: '🇫🇷',
      totalDuration: '6 hours',
      modules: [
        { title: 'Burgundy: Terroir & Pinot Noir', description: '', duration: '45 min', slug: 'burgundy-basics' },
        { title: 'Bordeaux: The Art of Blending', description: '', duration: '50 min', slug: 'bordeaux-blending' },
        { title: 'Champagne: Méthode Traditionnelle', description: '', duration: '40 min', slug: 'champagne-method' },
        { title: 'Rhône Valley: Syrah vs Grenache', description: '', duration: '45 min', slug: 'rhone-grapes' },
        { title: 'Loire Valley: Diversity Defined', description: '', duration: '50 min', slug: 'loire-diversity' },
      ]
    },
    {
      title: 'Old World Foundations',
      description: 'Build your knowledge of classic European wine regions',
      level: 'beginner' as const,
      icon: '🏛️',
      totalDuration: '4 hours',
      modules: [
        { title: 'Wine Geography 101', description: '', duration: '30 min', slug: 'geography-101' },
        { title: 'Climate & Terroir Basics', description: '', duration: '35 min', slug: 'climate-terroir' },
        { title: 'Reading European Wine Labels', description: '', duration: '40 min', slug: 'label-reading' },
        { title: 'Classic vs Modern Winemaking', description: '', duration: '45 min', slug: 'winemaking-styles' },
      ]
    },
    {
      title: 'New World Innovation',
      description: 'Explore modern wine regions pushing boundaries',
      level: 'intermediate' as const,
      icon: '🌎',
      totalDuration: '5 hours',
      modules: [
        { title: 'California: Napa & Beyond', description: '', duration: '50 min', slug: 'california-intro' },
        { title: 'Australia: Shiraz Country', description: '', duration: '45 min', slug: 'australia-shiraz' },
        { title: 'New Zealand: Sauvignon Blanc Revolution', description: '', duration: '40 min', slug: 'nz-sauvignon' },
        { title: 'South America: High Altitude Wines', description: '', duration: '50 min', slug: 'south-america-altitude' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-wine-700 via-wine-600 to-wine-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Explore the World of Wine
            </h1>
            <p className="text-xl md:text-2xl text-wine-100 mb-8 max-w-3xl mx-auto">
              Deep-dive guides to {totalRegions} wine regions across {countries} countries
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">{countries}</div>
                <div className="text-wine-100">Countries</div>
              </div>
              <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">{getAllRegions('region').length}</div>
                <div className="text-wine-100">Regions</div>
              </div>
              <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                <div className="text-3xl font-bold">{getAllRegions('sub-region').length}</div>
                <div className="text-wine-100">Sub-regions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-16">
        <InteractiveRegionExplorer />
      </section>

      {/* Learning Paths */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Guided Learning Paths
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Structured courses that take you from beginner to expert
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {learningPaths.map((path, index) => (
            <LearningPathCard key={index} {...path} />
          ))}
        </div>
      </section>

      {/* Comparison Tool */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Compare Regions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understand the differences between similar wine regions
          </p>
        </div>
        <RegionComparisonTool />
      </section>

      {/* Quick Access Cards */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Popular Regions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Burgundy', 'Bordeaux', 'Champagne', 'Tuscany', 'Piedmont', 'Rioja', 'Napa Valley', 'Barossa Valley', 'Marlborough', 'Douro', 'Mosel', 'Rhône Valley'].map((region) => (
              <a
                key={region}
                href={`/regions/${region.toLowerCase().replace(/\s+/g, '-')}`}
                className="group bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all border border-gray-200 hover:border-wine-300"
              >
                <div className="text-3xl mb-2">🍷</div>
                <div className="font-semibold text-gray-900 group-hover:text-wine-700">
                  {region}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
