import RegionLayout from '@/components/RegionLayout';

const CHILE_SUB_REGIONS = [
  // Coastal regions
  { name: 'Casablanca Valley', slug: 'casablanca-valley' },
  { name: 'San Antonio Valley', slug: 'san-antonio-valley' },
  { name: 'Leyda Valley', slug: 'leyda-valley' },
  // Central Valley
  { name: 'Maipo Valley', slug: 'maipo-valley' },
  { name: 'Cachapoal Valley', slug: 'cachapoal-valley' },
  { name: 'Colchagua Valley', slug: 'colchagua-valley' },
  { name: 'Curicó Valley', slug: 'curico-valley' },
  { name: 'Maule Valley', slug: 'maule-valley' },
  // Southern regions
  { name: 'Itata Valley', slug: 'itata-valley' },
  { name: 'Bío Bío Valley', slug: 'bio-bio-valley' },
  // Northern regions
  { name: 'Elqui Valley', slug: 'elqui-valley' },
  { name: 'Limarí Valley', slug: 'limari-valley' },
];

export default function ChilePage() {
  return (
    <RegionLayout
      title="Chile"
      level="country"
      sidebarLinks={CHILE_SUB_REGIONS}
      contentFile="chile-guide.md"
    />
  );
}
