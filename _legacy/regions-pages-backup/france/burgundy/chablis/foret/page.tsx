import RegionLayout from '@/components/RegionLayout';

export default function FortPage() {
  return (
    <RegionLayout
      title="Forêt"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="foret-guide.md"
    />
  );
}
