import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#FAF7F2] border-t-3 border-[#1C1C1C]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
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
              <li>
                <Link href="/wines" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Reviews
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
                <Link href="/education" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Education
                </Link>
              </li>
              <li>
                <Link href="/articles" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">
              Popular Regions
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/wines?region=bordeaux" className="fun-link text-gray-600 hover:text-[#722F37]">
                  🇫🇷 Bordeaux
                </Link>
              </li>
              <li>
                <Link href="/wines?region=burgundy" className="fun-link text-gray-600 hover:text-[#722F37]">
                  🇫🇷 Burgundy
                </Link>
              </li>
              <li>
                <Link href="/wines?region=napa-valley" className="fun-link text-gray-600 hover:text-[#722F37]">
                  🇺🇸 Napa Valley
                </Link>
              </li>
              <li>
                <Link href="/wines?region=tuscany" className="fun-link text-gray-600 hover:text-[#722F37]">
                  🇮🇹 Tuscany
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="fun-link text-gray-600 hover:text-[#722F37]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Get in Touch
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Newsletter
                </Link>
              </li>
              <li>
                <a href="https://instagram.com" className="fun-link text-gray-600 hover:text-[#722F37]">
                  Instagram
                </a>
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
