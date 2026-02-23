'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  slug: string;
  path: string;
}

interface MapBreadcrumbProps {
  breadcrumbs: BreadcrumbItem[];
}

export default function MapBreadcrumb({ breadcrumbs }: MapBreadcrumbProps) {
  return (
    <nav className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md z-10">
      <ol className="flex items-center space-x-1 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.slug} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-300">/</span>}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-[#1C1C1C]">{crumb.name}</span>
            ) : (
              <Link
                href={crumb.path}
                className="text-gray-500 hover:text-[#722F37] transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
