import RegionLayout from '@/components/RegionLayout';

const NORTHERN_GREECE_REGIONS = [
  { name: 'Naoussa', slug: 'naoussa' },
  { name: 'Amyndeon', slug: 'amyndeon' },
  { name: 'Drama', slug: 'drama' },
];

export default function AmyndeonPage() {
  return (
    <RegionLayout
      title="Amyndeon"
      level="sub-region"
      parentRegion="greece/northern-greece"
      sidebarLinks={NORTHERN_GREECE_REGIONS}
      contentFile="amyndeon-guide.md"
    />
  );
}
