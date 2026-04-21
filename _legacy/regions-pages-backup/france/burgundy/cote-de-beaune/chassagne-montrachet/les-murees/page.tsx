import RegionLayout from '@/components/RegionLayout';

export default function LesMureesPage() {
  return (
    <RegionLayout
      title="Les Murees"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-murees-vineyard-guide.md"
    />
  );
}
