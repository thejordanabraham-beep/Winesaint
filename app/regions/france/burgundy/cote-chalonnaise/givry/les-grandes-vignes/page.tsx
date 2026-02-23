import RegionLayout from '@/components/RegionLayout';

export default function LesGrandesVignesPage() {
  return (
    <RegionLayout
      title="Les Grandes Vignes"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="les-grandes-vignes-guide.md"
    />
  );
}
