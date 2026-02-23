import RegionLayout from '@/components/RegionLayout';

export default function LesEmbrazesPage() {
  return (
    <RegionLayout
      title="Les Embrazées"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-embrazees-guide.md"
    />
  );
}
