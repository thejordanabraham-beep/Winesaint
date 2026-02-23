import RegionLayout from '@/components/RegionLayout';

export default function BoschettiPage() {
  return (
    <RegionLayout
      title="Boschetti"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/barolo"
      classification="mga"
      contentFile="boschetti-guide.md"
    />
  );
}
