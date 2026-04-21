import RegionLayout from '@/components/RegionLayout';

// Pays Nantais appellations - consolidated structure
const PAYS_NANTAIS_APPELLATIONS = [
  { name: 'Muscadet', slug: 'muscadet' },
  { name: 'Gros Plant du Pays Nantais', slug: 'gros-plant-du-pays-nantais' },
];

export default function PaysNantaisPage() {
  return (
    <RegionLayout
      title="Pays Nantais"
      level="sub-region"
      parentRegion="france/loire-valley"
      sidebarLinks={PAYS_NANTAIS_APPELLATIONS}
      contentFile="pays-nantais-guide.md"
    />
  );
}
