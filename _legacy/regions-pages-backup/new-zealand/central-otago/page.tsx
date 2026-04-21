import RegionLayout from '@/components/RegionLayout';

const CENTRALOTAGO_PRODUCERS = [
  { name: 'Felton Road', slug: 'felton-road', classification: 'single-vineyard' as const },
  { name: 'Rippon', slug: 'rippon', classification: 'single-vineyard' as const },
  { name: 'Mount Difficulty', slug: 'mount-difficulty', classification: 'single-vineyard' as const },
];

export default function CentralOtagoPage() {
  return (
    <RegionLayout
      title="Central Otago"
      level="region"
      parentRegion="new-zealand"
      sidebarLinks={CENTRALOTAGO_PRODUCERS}
      contentFile="central-otago-guide.md"
    />
  );
}
