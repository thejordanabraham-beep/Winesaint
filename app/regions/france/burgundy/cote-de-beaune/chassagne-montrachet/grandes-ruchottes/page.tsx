import RegionLayout from '@/components/RegionLayout';

export default function GrandesRuchottesPage() {
  return (
    <RegionLayout
      title="Grandes Ruchottes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="grandes-ruchottes-guide.md"
    />
  );
}
