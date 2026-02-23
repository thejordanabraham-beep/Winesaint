import RegionLayout from '@/components/RegionLayout';

export default function MonviglieroPage() {
  return (
    <RegionLayout
      title="Monvigliero"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/verduno"
      classification="mga"
      contentFile="monvigliero-guide.md"
    />
  );
}
