import RegionLayout from '@/components/RegionLayout';

export default function ManocinoPage() {
  return (
    <RegionLayout
      title="Manocino"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="manocino-guide.md"
    />
  );
}
