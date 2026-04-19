import Link from 'next/link';

const RESOURCES = [
  {
    id: 'oak',
    name: 'Oak Guide',
    description: 'Forests, species, cooperage, toast levels, barrel formats, and regional traditions. Everything about how oak shapes wine.',
    icon: '🛢️',
    href: '/resources/oak',
    status: 'available',
  },
  {
    id: 'glassware',
    name: 'Glassware Guide',
    description: 'Glass shapes, bowl sizes, and which glasses suit which wines. From Burgundy bowls to flutes.',
    icon: '🍷',
    href: '/resources/glassware',
    status: 'coming-soon',
  },
  {
    id: 'rootstock',
    name: 'Rootstock Guide',
    description: 'Phylloxera, grafting, rootstock varieties, and how the roots beneath the vine affect what ends up in your glass.',
    icon: '🌱',
    href: '/resources/rootstock',
    status: 'coming-soon',
  },
  {
    id: 'glossary',
    name: 'Wine Glossary',
    description: 'Definitions for wine terminology from A to Z. Appellation to zymology.',
    icon: '📖',
    href: '/resources/glossary',
    status: 'coming-soon',
  },
];

export default function ResourcesPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[#722F37]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#1C1C1C]">Resources</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl italic text-[#1C1C1C]">Resources</h1>
          <p className="mt-3 text-gray-600 max-w-3xl">
            Deep dives into the technical aspects of wine. Oak, glassware, rootstocks, and terminology explained.
          </p>
        </div>

        {/* Resource Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {RESOURCES.map((resource) => (
            <div key={resource.id}>
              {resource.status === 'available' ? (
                <Link
                  href={resource.href}
                  className="block bg-white rounded-lg border-3 border-[#1C1C1C] p-6 hover:shadow-lg transition-shadow group h-full"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{resource.icon}</span>
                    <div className="flex-1">
                      <h2 className="font-serif text-2xl italic text-[#1C1C1C] group-hover:text-[#722F37] transition-colors">
                        {resource.name}
                      </h2>
                      <p className="mt-2 text-gray-600">{resource.description}</p>
                      <p className="mt-4 text-sm font-medium text-[#722F37] group-hover:underline">
                        Explore guide →
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="bg-white rounded-lg border-3 border-[#1C1C1C]/30 p-6 h-full opacity-60">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl grayscale">{resource.icon}</span>
                    <div className="flex-1">
                      <h2 className="font-serif text-2xl italic text-[#1C1C1C]">
                        {resource.name}
                      </h2>
                      <p className="mt-2 text-gray-500">{resource.description}</p>
                      <p className="mt-4 text-sm font-medium text-gray-400">
                        Coming soon
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
