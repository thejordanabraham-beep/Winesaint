import Link from 'next/link';
import { notFound } from 'next/navigation';
import terroirData from '@/app/data/terroir.json';

export function generateStaticParams() {
  return terroirData.sections.examples.sites.map((site) => ({
    slug: site.id,
  }));
}

function AspectCompass({ aspect }: { aspect: string }) {
  const aspectLower = aspect.toLowerCase();
  let direction = 'S';
  if (aspectLower.includes('south') && aspectLower.includes('east')) direction = 'SE';
  else if (aspectLower.includes('south') && aspectLower.includes('west')) direction = 'SW';
  else if (aspectLower.includes('north') && aspectLower.includes('east')) direction = 'NE';
  else if (aspectLower.includes('north') && aspectLower.includes('west')) direction = 'NW';
  else if (aspectLower.includes('east')) direction = 'E';
  else if (aspectLower.includes('west')) direction = 'W';
  else if (aspectLower.includes('north')) direction = 'N';

  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-3 border-[#1C1C1C]/20 rounded-full" />
        {directions.map((dir, i) => {
          const angle = (i * 45 - 90) * (Math.PI / 180);
          const x = 40 + 30 * Math.cos(angle);
          const y = 40 + 30 * Math.sin(angle);
          const isActive = dir === direction;
          return (
            <div
              key={dir}
              className={`absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full text-xs flex items-center justify-center font-medium ${
                isActive ? 'bg-[#722F37] text-white' : 'text-gray-400'
              }`}
              style={{ left: x, top: y }}
            >
              {dir}
            </div>
          );
        })}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-[#722F37] rounded-full" />
        </div>
      </div>
      <div>
        <p className="text-lg font-medium text-[#1C1C1C]">{direction}</p>
        <p className="text-sm text-gray-600">{aspect}</p>
      </div>
    </div>
  );
}

function ElevationProfile({ elevation }: { elevation: string }) {
  const match = elevation.match(/(\d+)/);
  const meters = match ? parseInt(match[1]) : 200;
  const percentage = Math.min((meters / 1500) * 100, 100);

  return (
    <div className="flex items-end gap-4">
      <div className="relative w-8 h-24 bg-gradient-to-t from-green-600 via-amber-500 to-gray-400 rounded-lg overflow-hidden">
        <div
          className="absolute left-0 right-0 h-1 bg-[#722F37]"
          style={{ bottom: `${percentage}%` }}
        />
        <div
          className="absolute -right-2 w-4 h-4 bg-[#722F37] rounded-full border-2 border-white"
          style={{ bottom: `calc(${percentage}% - 8px)` }}
        />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1C1C1C]">{elevation}</p>
        <p className="text-xs text-gray-500">above sea level</p>
      </div>
    </div>
  );
}

function ClimateCard({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5">
      <h3 className="font-serif text-xl italic text-[#722F37] mb-4">Climate Profile</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Climate Type</p>
          <p className="font-medium">{data.climate_type}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Growing Degree Days</p>
          <p className="font-medium">{data.growing_degree_days}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Annual Rainfall</p>
          <p className="font-medium">{data.annual_rainfall}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Summer Temperature</p>
          <p className="font-medium">{data.avg_summer_temp}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Diurnal Shift</p>
          <p className="font-medium">{data.diurnal_shift}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Sunshine Hours</p>
          <p className="font-medium">{data.sunshine_hours}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-blue-600 font-medium">Rainfall Pattern</p>
          <p className="text-sm text-blue-900">{data.rainfall_pattern}</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
          <p className="text-xs text-amber-600 font-medium">Frost Risk</p>
          <p className="text-sm text-amber-900">{data.frost_risk}</p>
        </div>
      </div>
    </div>
  );
}

function GeologyCard({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5">
      <h3 className="font-serif text-xl italic text-[#722F37] mb-4">Geological Foundation</h3>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="bg-[#FAF7F2] rounded-lg p-4">
          <p className="text-xs text-gray-500">Formation Period</p>
          <p className="font-medium text-[#1C1C1C]">{data.formation_period}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-4">
          <p className="text-xs text-gray-500">Parent Rock</p>
          <p className="font-medium text-[#1C1C1C]">{data.parent_rock}</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-[#1C1C1C] mb-3">Soil Profile</h4>
        <div className="space-y-2">
          {data.soil_profile.map((layer: any, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-20 flex-shrink-0">
                <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">{layer.depth}</span>
              </div>
              <div
                className="flex-1 p-2 rounded text-sm"
                style={{
                  backgroundColor: i === 0 ? '#E8DDD0' : i === 1 ? '#D4C4B0' : '#B8A890'
                }}
              >
                {layer.composition}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Soil pH</p>
          <p className="font-medium">{data.soil_ph}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Active Limestone</p>
          <p className="font-medium">{data.active_limestone}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Iron Content</p>
          <p className="font-medium">{data.iron_content}</p>
        </div>
      </div>

      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
        <p className="text-xs text-amber-600 font-medium mb-1">Geological Notes</p>
        <p className="text-sm text-amber-900">{data.geological_notes}</p>
      </div>
    </div>
  );
}

function HydrologyCard({ data }: { data: any }) {
  const drainageColors: Record<string, string> = {
    'Excellent': 'bg-green-500',
    'Good': 'bg-blue-500',
    'Good to excellent': 'bg-green-400',
    'Excellent to moderate': 'bg-blue-400',
    'Excellent despite clay': 'bg-green-500',
    'Moderate': 'bg-yellow-500',
  };
  const drainageColor = Object.entries(drainageColors).find(([key]) =>
    data.drainage_rating.toLowerCase().includes(key.toLowerCase())
  )?.[1] || 'bg-blue-500';

  return (
    <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5">
      <h3 className="font-serif text-xl italic text-[#722F37] mb-4">Hydrology & Drainage</h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Drainage Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-3 h-3 rounded-full ${drainageColor}`} />
            <p className="font-medium">{data.drainage_rating}</p>
          </div>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Water Table Depth</p>
          <p className="font-medium">{data.water_table_depth}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Root Depth</p>
          <p className="font-medium">{data.root_depth}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Irrigation</p>
          <p className="font-medium">{data.irrigation}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Water Stress</p>
          <p className="font-medium">{data.water_stress}</p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-xs text-blue-600 font-medium mb-1">Drainage Notes</p>
        <p className="text-sm text-blue-900">{data.drainage_notes}</p>
      </div>
    </div>
  );
}

function ViticultureCard({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5">
      <h3 className="font-serif text-xl italic text-[#722F37] mb-4">Viticulture</h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Vine Age</p>
          <p className="font-medium">{data.vine_age}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Rootstock</p>
          <p className="font-medium">{data.rootstock}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Training System</p>
          <p className="font-medium">{data.training}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Vine Density</p>
          <p className="font-medium">{data.density}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Yield</p>
          <p className="font-medium">{data.yield}</p>
        </div>
        <div className="bg-[#FAF7F2] rounded-lg p-3">
          <p className="text-xs text-gray-500">Harvest Date</p>
          <p className="font-medium">{data.harvest_date}</p>
        </div>
      </div>

      {data.organic_status && (
        <div className="mt-4 bg-green-50 rounded-lg p-3 border border-green-200">
          <p className="text-xs text-green-600 font-medium">Organic Status</p>
          <p className="text-sm text-green-900">{data.organic_status}</p>
        </div>
      )}
    </div>
  );
}

function WineCharacterCard({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5">
      <h3 className="font-serif text-xl italic text-[#722F37] mb-4">Wine Character</h3>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <div>
          <p className="text-xs text-gray-500 mb-2">Typical Color</p>
          <p className="font-medium text-[#1C1C1C]">{data.color}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2">Aging Potential</p>
          <p className="font-medium text-[#722F37] text-lg">{data.aging_potential}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-2">Aromas</p>
        <div className="flex flex-wrap gap-2">
          {data.aromas.map((aroma: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-[#FAF7F2] rounded-full text-sm border border-[#1C1C1C]/10">
              {aroma}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-2">Palate</p>
        <div className="flex flex-wrap gap-2">
          {data.palate.map((note: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-[#722F37]/10 rounded-full text-sm text-[#722F37] border border-[#722F37]/20">
              {note}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-2">Best Vintages</p>
        <div className="flex flex-wrap gap-2">
          {data.best_vintages.slice(0, 8).map((vintage: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-amber-100 rounded-full text-sm font-mono">
              {vintage}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-[#FAF7F2] rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-1">Style Notes</p>
        <p className="text-gray-700">{data.style_notes}</p>
      </div>
    </div>
  );
}

export default async function ExampleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = terroirData.sections.examples.sites.find((s) => s.id === slug) as any;

  if (!site) {
    notFound();
  }

  const otherSites = terroirData.sections.examples.sites.filter((s) => s.id !== slug);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources" className="text-gray-500 hover:text-[#722F37]">Resources</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/resources/terroir" className="text-gray-500 hover:text-[#722F37]">Terroir Guide</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">{site.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <span className="text-sm text-[#722F37] font-medium">{site.appellation}</span>
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">{site.name}</h1>
          <p className="mt-2 text-xl text-gray-600">{site.region}</p>
        </div>

        {/* Overview Card */}
        <div className="bg-white rounded-lg border-3 border-[#1C1C1C] p-6 mb-6">
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Vineyard Aspect</h3>
              <AspectCompass aspect={site.aspect} />
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Elevation</h3>
              <ElevationProfile elevation={site.elevation} />
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Area</p>
              <p className="text-xl font-medium text-[#1C1C1C]">{site.area}</p>
              <p className="text-sm font-medium text-gray-500 mt-4 mb-2">Slope</p>
              <p className="text-lg font-medium text-[#1C1C1C]">{site.slope}</p>
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Primary Grape</p>
              <span className="inline-block px-4 py-2 bg-[#722F37] text-white rounded-full font-medium">
                {site.grape}
              </span>
              <p className="text-sm font-medium text-gray-500 mt-4 mb-2">Production</p>
              <p className="text-sm text-[#1C1C1C]">{site.production}</p>
            </div>
          </div>

          {/* Terroir Summary */}
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="bg-[#FAF7F2] rounded-lg p-5">
              <h3 className="font-serif text-lg italic text-[#722F37] mb-2">Soil Composition</h3>
              <p className="text-gray-700">{site.soil}</p>
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-5">
              <h3 className="font-serif text-lg italic text-[#722F37] mb-2">Microclimate</h3>
              <p className="text-gray-700">{site.microclimate}</p>
            </div>
          </div>

          {/* What Makes It Special */}
          <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
            <h3 className="font-serif text-xl italic text-amber-800 mb-3">What Makes It Special</h3>
            <p className="text-amber-900 leading-relaxed">{site.what_makes_it_special}</p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="space-y-6 mb-8">
          {/* Climate */}
          {site.climate_data && <ClimateCard data={site.climate_data} />}

          {/* Geology */}
          {site.geology_detail && <GeologyCard data={site.geology_detail} />}

          {/* Hydrology */}
          {site.hydrology && <HydrologyCard data={site.hydrology} />}

          {/* Viticulture */}
          {site.viticulture && <ViticultureCard data={site.viticulture} />}

          {/* Wine Character */}
          {site.wine_character && <WineCharacterCard data={site.wine_character} />}
        </div>

        {/* Notable Producers */}
        {site.notable_producers && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h3 className="font-serif text-xl italic text-[#722F37] mb-4">Notable Producers</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {site.notable_producers.map((producer: any, i: number) => (
                <div key={i} className="bg-[#FAF7F2] rounded-lg p-3">
                  <p className="font-medium text-[#1C1C1C]">{producer.name}</p>
                  <p className="text-sm text-gray-600">{producer.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {site.history && (
          <div className="bg-white rounded-lg border-2 border-[#1C1C1C] p-5 mb-6">
            <h3 className="font-serif text-xl italic text-[#722F37] mb-3">History</h3>
            <p className="text-gray-700 leading-relaxed">{site.history}</p>
          </div>
        )}

        {/* Price */}
        <div className="bg-[#722F37] text-white rounded-lg p-5 mb-8 text-center">
          <p className="text-sm opacity-80 mb-1">Price Indication</p>
          <p className="text-2xl font-medium">{site.price_indication}</p>
        </div>

        {/* Other Famous Sites */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl italic text-[#1C1C1C] mb-4">Explore Other Famous Terroirs</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {otherSites.slice(0, 4).map((other) => (
              <Link
                key={other.id}
                href={`/resources/terroir/examples/${other.id}`}
                className="bg-white rounded-lg border-2 border-[#1C1C1C] p-4 hover:border-[#722F37] hover:shadow-md transition-all group"
              >
                <h3 className="font-serif text-lg italic text-[#1C1C1C] group-hover:text-[#722F37]">
                  {other.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{other.region}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{other.grape}</span>
                  <span className="text-[#722F37]">{other.elevation}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/resources/terroir"
            className="inline-flex items-center text-[#722F37] hover:underline"
          >
            ← Back to Terroir Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
