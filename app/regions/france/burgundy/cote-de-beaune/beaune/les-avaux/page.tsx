import RegionLayout from '@/components/RegionLayout';

export default function LesAvauxPage() {
  return (
    <RegionLayout
      title="Les Avaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-avaux-guide.md"
    />
  );
}
