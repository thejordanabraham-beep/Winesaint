import Link from 'next/link';

export default function ManifestoPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b-3 border-[#1C1C1C] bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#722F37]">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#1C1C1C]">Manifesto</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#722F37] to-[#457b9d] py-10 sm:py-16 border-b-3 border-[#1C1C1C]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl italic text-white leading-tight mb-6">
            The WineSaint Manifesto
          </h1>
          <p className="text-xl text-white/90">
            Drinking Great Since 1988
          </p>
        </div>
      </div>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl leading-relaxed text-gray-700 mb-8">
            Coming soon...
          </p>

          <div className="bg-[#722F37]/10 border-l-4 border-[#722F37] p-6 my-8">
            <p className="text-gray-700 mb-0 italic">
              "Wine is sunlight, held together by water." — Galileo Galilei
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
