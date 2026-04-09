import RegionLayout from '@/components/RegionLayout';

// Official sub-regions of the Douro - proper geographic hierarchy
const DOURO_SUBREGIONS = [
  { name: 'Baixo Corgo', slug: 'baixo-corgo', type: 'sub-region' },
  { name: 'Cima Corgo', slug: 'cima-corgo', type: 'sub-region' },
  { name: 'Douro Superior', slug: 'douro-superior', type: 'sub-region' }
];

export default function DouroPage() {
  return (
    <RegionLayout
      title="Douro"
      level="region"
      parentRegion="portugal"
      sidebarLinks={DOURO_SUBREGIONS}
      contentFile="douro-guide.md"
    />
  );
}
