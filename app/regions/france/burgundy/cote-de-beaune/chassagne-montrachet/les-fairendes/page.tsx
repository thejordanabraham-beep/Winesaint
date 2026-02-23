import RegionLayout from '@/components/RegionLayout';

export default function LesFairendesPage() {
  return (
    <RegionLayout
      title="Les Fairendes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-fairendes-vineyard-guide.md"
    />
  );
}
