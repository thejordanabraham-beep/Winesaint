import RegionLayout from '@/components/RegionLayout';

export default function GarrettiPage() {
  return (
    <RegionLayout
      title="Garretti"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="garretti-guide.md"
    />
  );
}
