import RegionLayout from '@/components/RegionLayout';

export default function LaCortePage() {
  return (
    <RegionLayout
      title="La Corte"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="la-corte-guide.md"
    />
  );
}
