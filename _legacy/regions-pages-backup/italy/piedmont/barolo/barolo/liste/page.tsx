import RegionLayout from '@/components/RegionLayout';

export default function ListePage() {
  return (
    <RegionLayout
      title="Liste"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/barolo"
      classification="mga"
      contentFile="liste-guide.md"
    />
  );
}
