import RegionLayout from '@/components/RegionLayout';

export default function ClosdelaChapellePage() {
  return (
    <RegionLayout
      title="Clos de la Chapelle"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/volnay"
      classification="premier-cru"
      contentFile="clos-de-la-chapelle-guide.md"
    />
  );
}
