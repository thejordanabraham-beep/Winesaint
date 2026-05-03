import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import { getPayload } from 'payload';
import config from '@payload-config';

interface Grape {
  id: number;
  name: string;
  slug: string;
  color: string;
  isEssential: boolean;
  description?: string;
  content?: string;
  aliases?: Array<{ alias: string }>;
  flavorProfile?: Array<{ flavor: string }>;
  majorRegions?: Array<{ region: string }>;
}

async function getGrapeBySlug(slug: string): Promise<Grape | null> {
  try {
    const payload = await getPayload({ config });
    const data = await payload.find({
      collection: 'grapes',
      where: {
        slug: { equals: slug }
      },
      limit: 1,
    });
    return (data.docs?.[0] as Grape) || null;
  } catch (error) {
    console.error('Error fetching grape:', error);
    return null;
  }
}

function formatGrapeName(name: string) {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getColorBadge(color: string) {
  if (color === 'red') {
    return { label: 'Red', bgClass: 'bg-[#722F37]', textClass: 'text-white' };
  }
  if (color === 'white') {
    return { label: 'White', bgClass: 'bg-[#E8DFD0]', textClass: 'text-[#1C1C1C]' };
  }
  return { label: 'Rosé', bgClass: 'bg-[#E8B4B8]', textClass: 'text-[#1C1C1C]' };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const grape = await getGrapeBySlug(slug);

  if (!grape) {
    return { title: 'Grape Not Found' };
  }

  const name = formatGrapeName(grape.name);
  return {
    title: `${name} - Grape Guide | WineSaint`,
    description: grape.description || `Learn about ${name} grape variety.`,
  };
}

export default async function GrapeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const grape = await getGrapeBySlug(slug);

  if (!grape) {
    notFound();
  }

  const colorBadge = getColorBadge(grape.color);
  const flavors = grape.flavorProfile?.map(f => f.flavor) || [];
  const regions = grape.majorRegions?.map(r => r.region) || [];
  const aliases = grape.aliases?.map(a => a.alias) || [];

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-[#722F37]">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/grapes" className="hover:text-[#722F37]">Grape Guide</Link>
            </li>
            <li>/</li>
            <li className="text-[#1C1C1C] font-medium">{formatGrapeName(grape.name)}</li>
          </ol>
        </nav>

        {/* Header Card */}
        <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="font-serif text-4xl italic text-[#1C1C1C]">
              {formatGrapeName(grape.name)}
            </h1>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 border-[#1C1C1C] ${colorBadge.bgClass} ${colorBadge.textClass}`}>
              {colorBadge.label}
            </span>
          </div>

          {grape.description && (
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              {grape.description}
            </p>
          )}

          {/* Flavor Pills */}
          {flavors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#1C1C1C] mb-2">Typical Flavors</h3>
              <div className="flex flex-wrap gap-2">
                {flavors.map((flavor, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-[#FAF7F2] border border-[#1C1C1C]/20 text-[#1C1C1C] text-sm px-3 py-1 rounded"
                  >
                    {flavor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Regions */}
          {regions.length > 0 && (
            <div className="pt-4 border-t border-[#1C1C1C]/10 mb-4">
              <h3 className="text-sm font-medium text-[#1C1C1C] mb-2">Major Regions</h3>
              <p className="text-sm text-gray-600">{regions.join(' · ')}</p>
            </div>
          )}

          {/* Aliases */}
          {aliases.length > 0 && (
            <div className="pt-4 border-t border-[#1C1C1C]/10">
              <h3 className="text-sm font-medium text-[#1C1C1C] mb-2">Also Known As</h3>
              <p className="text-sm text-gray-600">{aliases.join(' · ')}</p>
            </div>
          )}
        </div>

        {/* Full Content */}
        {grape.content && (
          <div className="bg-white border-3 border-[#1C1C1C] rounded-lg p-8 mb-6">
            <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:italic prose-headings:text-[#1C1C1C] prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-[#722F37] prose-strong:text-[#1C1C1C]">
              <ReactMarkdown>{grape.content}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/grapes"
            className="text-[#722F37] hover:text-[#5a252c] font-medium"
          >
            ← Back to Grape Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
