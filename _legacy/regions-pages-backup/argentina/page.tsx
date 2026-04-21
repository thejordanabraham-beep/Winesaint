import RegionLayout from '@/components/RegionLayout';

const ARGENTINA_SUB_REGIONS = [
  { name: 'Mendoza', slug: 'mendoza' },
  { name: 'Salta', slug: 'salta' },
  { name: 'San Juan', slug: 'san-juan' },
  { name: 'Patagonia', slug: 'patagonia' },
  { name: 'La Rioja', slug: 'la-rioja' },
  { name: 'Catamarca', slug: 'catamarca' },
];

export default function ArgentinaPage() {
  return (
    <RegionLayout
      title="Argentina"
      level="country"
      sidebarLinks={ARGENTINA_SUB_REGIONS}
      contentFile="argentina-guide.md"
    />
  );
}
