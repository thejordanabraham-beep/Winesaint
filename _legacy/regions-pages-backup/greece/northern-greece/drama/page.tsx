import RegionLayout from '@/components/RegionLayout';

const NORTHERN_GREECE_REGIONS = [
  { name: 'Naoussa', slug: 'naoussa' },
  { name: 'Amyndeon', slug: 'amyndeon' },
  { name: 'Drama', slug: 'drama' },
];

export default function DramaPage() {
  return (
    <RegionLayout
      title="Drama"
      level="sub-region"
      parentRegion="greece/northern-greece"
      sidebarLinks={NORTHERN_GREECE_REGIONS}
      contentFile="drama-guide.md"
    />
  );
}
