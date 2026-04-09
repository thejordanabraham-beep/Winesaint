import RegionLayout from '@/components/RegionLayout';

export default function VosgrosPage() {
  return (
    <RegionLayout
      title="Vosgros"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="vosgros-guide.md"
    />
  );
}
