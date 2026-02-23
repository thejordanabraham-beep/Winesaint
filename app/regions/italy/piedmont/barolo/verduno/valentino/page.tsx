import RegionLayout from '@/components/RegionLayout';

export default function ValentinoPage() {
  return (
    <RegionLayout
      title="Valentino"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/verduno"
      classification="mga"
      contentFile="valentino-guide.md"
    />
  );
}
