import RegionLayout from '@/components/RegionLayout';

const MARLBOROUGH_PRODUCERS = [
  { name: 'Cloudy Bay', slug: 'cloudy-bay', classification: 'single-vineyard' as const },
  { name: 'Greywacke', slug: 'greywacke', classification: 'single-vineyard' as const },
  { name: 'Fromm', slug: 'fromm', classification: 'single-vineyard' as const },
];

export default function MarlboroughPage() {
  return (
    <RegionLayout
      title="Marlborough"
      level="region"
      parentRegion="new-zealand"
      sidebarLinks={MARLBOROUGH_PRODUCERS}
      contentFile="marlborough-guide.md"
    />
  );
}
