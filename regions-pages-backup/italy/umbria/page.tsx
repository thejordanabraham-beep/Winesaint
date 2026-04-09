import RegionLayout from '@/components/RegionLayout';

const UMBRIA_SUB_REGIONS = [
  { name: 'Montefalco', slug: 'montefalco' },
  { name: 'Orvieto', slug: 'orvieto' },
  { name: 'Torgiano', slug: 'torgiano' },
];

export default function UmbriaPage() {
  return (
    <RegionLayout
      title="Umbria"
      level="region"
      parentRegion="italy"
      sidebarLinks={UMBRIA_SUB_REGIONS}
      contentFile="umbria-guide.md"
    />
  );
}
