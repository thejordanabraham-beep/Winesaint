import RegionLayout from '@/components/RegionLayout';

const NORTHERN_GREECE_REGIONS = [
  { name: 'Naoussa', slug: 'naoussa' },
  { name: 'Amyndeon', slug: 'amyndeon' },
  { name: 'Drama', slug: 'drama' },
];

export default function NaoussaPage() {
  return (
    <RegionLayout
      title="Naoussa"
      level="sub-region"
      parentRegion="greece/northern-greece"
      sidebarLinks={NORTHERN_GREECE_REGIONS}
      contentFile="naoussa-guide.md"
    />
  );
}
