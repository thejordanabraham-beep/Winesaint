import RegionLayout from '@/components/RegionLayout';

export default function LesRuchottesPage() {
  return (
    <RegionLayout
      title="Les Ruchottes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="les-ruchottes-guide.md"
    />
  );
}
