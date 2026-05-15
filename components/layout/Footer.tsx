import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#FAF7F2] border-t-3 border-[#1C1C1C]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-serif text-3xl italic">
              WineSaint
            </Link>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Drinking Great Since 1988
            </p>
            <div className="mt-3">
              <Link href="/manifesto" className="fun-link text-sm text-gray-600 hover:text-[#722F37] font-medium">
                Manifesto
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              {/* TEMPORARILY DISABLED — revert to <Link href="/search"> when reviews are cleaned up */}
              <li>
                <span className="text-gray-400 cursor-default">
                  Reviews
                </span>
              </li>
              <li>
                <Link href="/producers" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Producers
                </Link>
              </li>
              <li>
                <Link href="/regions" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Regions
                </Link>
              </li>
              <li>
                <Link href="/vintages" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Vintage Chart
                </Link>
              </li>
              <li>
                <Link href="/maps" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Maps
                </Link>
              </li>
              <li>
                <Link href="/articles" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">
              Learn
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/grapes" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Grape Guide
                </Link>
              </li>
              <li>
                <Link href="/resources/viticulture" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Viticulture Guide
                </Link>
              </li>
              <li>
                <Link href="/resources/winemaking" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Winemaking Guide
                </Link>
              </li>
              <li>
                <Link href="/resources/tasting" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Tasting Science Guide
                </Link>
              </li>
              <li>
                <Link href="/resources/terroir" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Terroir Guide
                </Link>
              </li>
              <li>
                <Link href="/resources/oak" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Oak Guide
                </Link>
              </li>
              <li>
                <Link href="/resources/rootstock" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Rootstock Guide
                </Link>
              </li>
              <li>
                <Link href="/resources/yeast" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Yeast Guide
                </Link>
              </li>
              <li>
                <Link href="/resources/glossary" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Wine Glossary
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-[#1C1C1C]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} WineSaint. Made with 🍷 and questionable judgement.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-2xl hover:rotate-12 transition-transform cursor-default">🍷</span>
            <span className="text-2xl hover:rotate-12 transition-transform cursor-default">🍇</span>
            <span className="text-2xl hover:rotate-12 transition-transform cursor-default">🥂</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
