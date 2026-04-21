import RegionLayout from '@/components/RegionLayout';

export default function LesCombardsPage() {
  return (
    <RegionLayout
      title="Les Combards"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-combards-vineyard-guide.md"
    />
  );
}
