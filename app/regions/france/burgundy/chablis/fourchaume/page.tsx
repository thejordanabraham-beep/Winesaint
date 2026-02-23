import RegionLayout from '@/components/RegionLayout';

export default function FourchaumePage() {
  return (
    <RegionLayout
      title="Fourchaume"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="fourchaume-guide.md"
    />
  );
}
