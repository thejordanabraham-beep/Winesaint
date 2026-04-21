import RegionLayout from '@/components/RegionLayout';

export default function BorzonePage() {
  return (
    <RegionLayout
      title="Borzone"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="borzone-guide.md"
    />
  );
}
