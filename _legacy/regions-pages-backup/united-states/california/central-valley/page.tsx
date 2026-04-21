import RegionLayout from '@/components/RegionLayout';

// Central Valley AVAs
const CENTRAL_VALLEY_AVAS = [
  { name: 'Clarksburg', slug: 'clarksburg' },
  { name: 'Cosumnes River', slug: 'cosumnes-river' },
  { name: 'Diablo Grande', slug: 'diablo-grande' },
  { name: 'Jahant', slug: 'jahant' },
  { name: 'Lodi', slug: 'lodi' },
  { name: 'Madera', slug: 'madera' },
  { name: 'Merritt Island', slug: 'merritt-island' },
  { name: 'Mokelumne River', slug: 'mokelumne-river' },
  { name: 'River Junction', slug: 'river-junction' },
  { name: 'Salado Creek', slug: 'salado-creek' },
  { name: 'Sloughhouse', slug: 'sloughhouse' },
  { name: 'Tracy Hills', slug: 'tracy-hills' },
];

export default function CentralValleyPage() {
  return (
    <RegionLayout
      title="Central Valley"
      level="sub-region"
      parentRegion="united-states/california"
      sidebarLinks={CENTRAL_VALLEY_AVAS}
      contentFile="central-valley-guide.md"
    />
  );
}
