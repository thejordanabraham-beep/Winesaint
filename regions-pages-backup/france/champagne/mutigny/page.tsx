import RegionLayout from '@/components/RegionLayout';

export default function MutignyPage() {
  return (
    <RegionLayout
      title="Mutigny"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="mutigny-guide.md"
    />
  );
}
