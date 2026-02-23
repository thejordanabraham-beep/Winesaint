import RegionLayout from '@/components/RegionLayout';

export default function BroglioPage() {
  return (
    <RegionLayout
      title="Broglio"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="broglio-guide.md"
    />
  );
}
