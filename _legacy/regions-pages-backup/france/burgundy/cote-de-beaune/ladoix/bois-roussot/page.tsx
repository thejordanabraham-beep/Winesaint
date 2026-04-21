import RegionLayout from '@/components/RegionLayout';

export default function BoisRoussotPage() {
  return (
    <RegionLayout
      title="Bois Roussot"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/ladoix"
      classification="premier-cru"
      contentFile="bois-roussot-guide.md"
    />
  );
}
