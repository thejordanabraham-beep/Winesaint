import RegionLayout from '@/components/RegionLayout';

export default function VaillonsPage() {
  return (
    <RegionLayout
      title="Vaillons"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="vaillons-guide.md"
    />
  );
}
