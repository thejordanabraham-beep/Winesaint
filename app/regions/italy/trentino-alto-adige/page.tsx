import RegionLayout from '@/components/RegionLayout';

const TRENTINO_ALTO_ADIGE_SUB_REGIONS = [
  { name: 'Alto Adige', slug: 'alto-adige' },
  { name: 'Trentino', slug: 'trentino' },
];

export default function TrentinoAltoAdigePage() {
  return (
    <RegionLayout
      title="Trentino-Alto Adige"
      level="region"
      parentRegion="italy"
      sidebarLinks={TRENTINO_ALTO_ADIGE_SUB_REGIONS}
      contentFile="trentino-alto-adige-guide.md"
    />
  );
}
