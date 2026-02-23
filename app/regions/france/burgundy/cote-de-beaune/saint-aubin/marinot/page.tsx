import RegionLayout from '@/components/RegionLayout';

export default function MarinotPage() {
  return (
    <RegionLayout
      title="Marinot"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="marinot-vineyard-guide.md"
    />
  );
}
