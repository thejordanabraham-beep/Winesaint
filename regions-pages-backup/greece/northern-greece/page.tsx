import RegionLayout from '@/components/RegionLayout';

const NORTHERN_GREECE_REGIONS = [
  { name: 'Naoussa', slug: 'naoussa' },
  { name: 'Amyndeon', slug: 'amyndeon' },
  { name: 'Drama', slug: 'drama' },
];

export default function NorthernGreecePage() {
  return (
    <RegionLayout
      title="Northern Greece"
      level="region"
      parentRegion="greece"
      sidebarLinks={NORTHERN_GREECE_REGIONS}
      contentFile="northern-greece-guide.md"
    />
  );
}
