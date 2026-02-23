import RegionLayout from '@/components/RegionLayout';

export default function LesRavellesPage() {
  return (
    <RegionLayout
      title="Les Ravelles"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/meursault"
      classification="premier-cru"
      contentFile="les-ravelles-vineyard-guide.md"
    />
  );
}
