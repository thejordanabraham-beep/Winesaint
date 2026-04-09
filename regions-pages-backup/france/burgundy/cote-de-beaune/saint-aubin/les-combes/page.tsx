import RegionLayout from '@/components/RegionLayout';

export default function LesCombesPage() {
  return (
    <RegionLayout
      title="Les Combes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="les-combes-guide.md"
    />
  );
}
