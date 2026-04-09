import RegionLayout from '@/components/RegionLayout';

export default function LesChaumesPage() {
  return (
    <RegionLayout
      title="Les Chaumes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-chaumes-vineyard-guide.md"
    />
  );
}
