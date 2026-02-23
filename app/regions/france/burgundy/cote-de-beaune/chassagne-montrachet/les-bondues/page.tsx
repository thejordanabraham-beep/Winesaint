import RegionLayout from '@/components/RegionLayout';

export default function LesBonduesPage() {
  return (
    <RegionLayout
      title="Les Bondues"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-bondues-vineyard-guide.md"
    />
  );
}
