import RegionLayout from '@/components/RegionLayout';

export default function LaVignaPage() {
  return (
    <RegionLayout
      title="La Vigna"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/barolo"
      classification="mga"
      contentFile="la-vigna-guide.md"
    />
  );
}
