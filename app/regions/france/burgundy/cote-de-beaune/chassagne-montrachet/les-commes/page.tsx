import RegionLayout from '@/components/RegionLayout';

export default function LesCommesPage() {
  return (
    <RegionLayout
      title="Les Commes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-commes-vineyard-guide.md"
    />
  );
}
