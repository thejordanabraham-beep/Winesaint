import RegionLayout from '@/components/RegionLayout';

export default function LesCombesauSudPage() {
  return (
    <RegionLayout
      title="Les Combes au Sud"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="les-combes-au-sud-guide.md"
    />
  );
}
