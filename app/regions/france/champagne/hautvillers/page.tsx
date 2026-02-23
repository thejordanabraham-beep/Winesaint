import RegionLayout from '@/components/RegionLayout';

export default function HautvillersPage() {
  return (
    <RegionLayout
      title="Hautvillers"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="hautvillers-guide.md"
    />
  );
}
